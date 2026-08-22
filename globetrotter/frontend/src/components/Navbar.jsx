import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, LogOut, ChevronDown, Plus, Search, Map } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Hide the global navbar on auth pages since they have their own transparent floating navs
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="gt-navbar h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 shrink-0 group">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
          <Compass size={20} className="text-primary" />
        </div>
        <div className="leading-none hidden sm:block">
          <span className="text-lg font-display font-black text-white tracking-tight">
            Globe<span className="text-primary">Trotter</span>
          </span>
        </div>
      </Link>

      {/* Center Desktop Links */}
      {user && (
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link 
            to="/explore" 
            className={`text-sm font-semibold transition-colors duration-200 ${isActive('/explore') ? 'text-white' : 'text-muted hover:text-white'}`}
          >
            Discover
          </Link>
          <Link 
            to="/trips" 
            className={`text-sm font-semibold transition-colors duration-200 ${isActive('/trips') ? 'text-white' : 'text-muted hover:text-white'}`}
          >
            My Trips
          </Link>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/trips/new"
              className="hidden sm:flex btn-primary px-4 py-2 text-xs"
            >
              <Plus size={14} /> Plan Trip
            </Link>

            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface transition-colors duration-200">
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent uppercase">
                  {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                </div>
                <ChevronDown size={14} className="text-muted group-hover:text-white transition-colors" />
              </div>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 py-2 bg-surface border border-border rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="px-4 py-2 border-b border-border mb-2">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.user_metadata?.full_name || 'Explorer'}
                  </p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors">
                  <User size={14} /> Profile
                </Link>
                <button
                  onClick={() => { signOut(); navigate('/login'); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Log In</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}