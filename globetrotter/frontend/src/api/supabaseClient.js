/**
 * Local-first Auth Client
 * Calls our backend /api/auth/* instead of Supabase directly.
 * Falls back gracefully when no Supabase project is configured.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'gt_token';
const USER_KEY  = 'gt_user';

// ── helpers ──────────────────────────────────────────────────
function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}

// ── Mock Supabase-compatible surface ─────────────────────────
// So AuthContext / client.js can keep using supabase.auth.* calls
const _listeners = new Set();

function notifyListeners(event, session) {
  _listeners.forEach((cb) => cb(event, session));
}

export const supabase = {
  auth: {
    /** Sign in via backend */
    async signInWithPassword({ email, password }) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: { message: data.error || 'Login failed' } };

        const session = { access_token: data.token, user: data.user };
        saveSession(data.token, data.user);
        notifyListeners('SIGNED_IN', session);
        return { data: { session, user: data.user }, error: null };
      } catch (err) {
        console.error('Login error:', err);
        return { data: null, error: { message: `Could not reach server: ${err.message}` } };
      }
    },

    /** Sign up via backend */
    async signUp({ email, password, options }) {
      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: options?.data?.full_name }),
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: { message: data.error || 'Signup failed' } };

        const session = { access_token: data.token, user: data.user };
        saveSession(data.token, data.user);
        notifyListeners('SIGNED_IN', session);
        return { data: { session, user: data.user }, error: null };
      } catch (err) {
        console.error('Signup error:', err);
        return { data: null, error: { message: `Could not reach server: ${err.message}` } };
      }
    },

    /** Restore session from localStorage */
    async getSession() {
      const token = getStoredToken();
      const user  = getStoredUser();
      if (token && user) {
        return { data: { session: { access_token: token, user } }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    /** Sign out */
    async signOut() {
      clearSession();
      notifyListeners('SIGNED_OUT', null);
      return { error: null };
    },

    /** Subscribe to auth state changes */
    onAuthStateChange(callback) {
      _listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => _listeners.delete(callback),
          },
        },
      };
    },
  },
};