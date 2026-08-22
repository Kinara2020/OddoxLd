import express from 'express';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middleware/auth.middleware.js';
import { supabase as globalSupabase } from '../config/supabase.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret-globetrotter-2026';

// We use a separate client for auth so we don't mutate the global service_role client's session
const getAuthClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const { data, error } = await globalSupabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
         // User not found in public.users yet, return minimal profile
         return res.json({ id: req.userId, is_new: true });
      }
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Sign up
router.post('/signup', async (req, res) => {
  const { email, password, full_name } = req.body;
  
  try {
    // Use admin API to auto-confirm email for seamless local dev/demo
    const authClient = getAuthClient();
    const { data: adminData, error: adminError } = await authClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    });

    if (adminError) {
      // If user already exists but is unconfirmed, we could handle it, or just return error
      return res.status(400).json({ error: adminError.message });
    }

    // Now sign in to get the user object
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Generate custom JWT because Service Key Supabase doesn't return sessions
    const token = jwt.sign({ id: data.user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user: data.user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const authClient = getAuthClient();
    let { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    // Auto-confirm if they hit the "Email not confirmed" block
    if (error && error.message.includes('Email not confirmed')) {
      const { data: usersData } = await authClient.auth.admin.listUsers();
      const unconfirmedUser = usersData?.users?.find(u => u.email === email);
      if (unconfirmedUser) {
        await authClient.auth.admin.updateUserById(unconfirmedUser.id, { email_confirm: true });
        
        // Retry login
        const retry = await authClient.auth.signInWithPassword({ email, password });
        data = retry.data;
        error = retry.error;
      }
    }

    if (error) return res.status(401).json({ error: error.message });

    // Generate custom JWT because Service Key Supabase doesn't return sessions
    const token = jwt.sign({ id: data.user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: data.user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
