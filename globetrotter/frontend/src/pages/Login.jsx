import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Compass, Eye, EyeOff, MapPin, Plane, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setLoading(false);
      return setError(error.message);
    }
    
    // Slight delay for smooth UI transition
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* ── Floating Transparent Navbar ── */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-6 lg:px-12 pointer-events-none">
        <Link to="/" className="flex items-center gap-3 group pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
            <Compass size={20} className="text-white" />
          </div>
          <span className="text-xl font-display font-black text-white tracking-tight drop-shadow-md hidden sm:block">
            GlobeTrotter
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold pointer-events-auto">
          <span className="text-white/80 hidden sm:inline drop-shadow-md">New to GlobeTrotter?</span>
          <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 active:scale-95">
            Sign up
          </Link>
        </div>
      </nav>

      {/* ── Left Side: Animated Travel Hero ── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=80" 
            alt="Kyoto Japan" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[float_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/90" />
        </div>

        {/* Floating Travel Route Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 100,200 C 300,100 500,500 700,300 S 900,100 1100,400" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth="2" 
              strokeDasharray="10 10" 
              className="animate-dash" 
            />
          </svg>
          
          <div className="absolute top-[25%] left-[25%] animate-float">
            <MapPin className="text-primary w-6 h-6 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
            <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">Kyoto</span>
          </div>
          <div className="absolute top-[50%] left-[60%] animate-float-delayed">
            <MapPin className="text-accent w-8 h-8 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">Osaka</span>
          </div>
          <div className="absolute top-[35%] left-[85%] animate-float">
            <MapPin className="text-primary w-6 h-6 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
            <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">Tokyo</span>
          </div>
          
          <Plane className="absolute top-[40%] left-[45%] text-white w-6 h-6 -rotate-12 opacity-80 animate-float drop-shadow-md" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 px-12 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide uppercase mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            Welcome Back
          </div>
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
            Pick up right where<br/>you left off.
          </h2>
          <p className="text-lg font-medium text-white/80 max-w-md mx-auto">
            Your itineraries, saved destinations, and travel plans are waiting for you.
          </p>
        </div>
      </div>

      {/* ── Right Side: Mobile Hero ── */}
      <div className="lg:hidden relative h-64 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" 
          alt="Kyoto Japan" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-black text-white">Welcome back.</h1>
        </div>
      </div>

      {/* ── Right Side: Login Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10 bg-background/95 backdrop-blur-xl">
        <div className="w-full max-w-md animate-enter">
          
          <div className="mb-10 text-center lg:text-left hidden lg:block">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Welcome back.</h2>
            <p className="text-muted text-lg">Log in to continue exploring.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error State */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">!</div>
                <p>{error}</p>
              </div>
            )}

            {/* Floating Label Input: Email */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-4 text-white bg-surface border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200"
                placeholder=" "
                required
              />
              <label 
                htmlFor="email" 
                className="absolute text-sm text-muted duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Email Address
              </label>
            </div>

            {/* Floating Label Input: Password */}
            <div className="relative group">
              <input
                type={showPw ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-5 py-4 text-white bg-surface border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200 pr-12"
                placeholder=" "
                required
              />
              <label 
                htmlFor="password" 
                className="absolute text-sm text-muted duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors focus:outline-none"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex justify-end">
              <span className="text-xs font-semibold text-muted hover:text-white cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-primary transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-xs text-muted mb-2">Don't have an account?</p>
              <Link to="/signup" className="text-sm font-bold text-white hover:text-primary transition-colors">
                Create a GlobeTrotter account
              </Link>
            </div>


          </form>
        </div>
      </div>

    </div>
  );
}