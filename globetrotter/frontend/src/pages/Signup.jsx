import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Compass, Eye, EyeOff, MapPin, Plane, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Scroll to top on mount for a clean slate
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } }
    });
    
    if (error) {
      setLoading(false);
      return setError(error.message);
    }
    
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
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
          <span className="text-white/80 hidden sm:inline drop-shadow-md">Already exploring?</span>
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 active:scale-95">
            Log in
          </Link>
        </div>
      </nav>

      {/* ── Left Side: Animated Travel Hero (Hidden on small mobile, visible on sm and up) ── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden bg-black">
        {/* Parallax / Slow moving background image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[float_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/90" />
        </div>

        {/* Floating Travel Route Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 100,500 C 200,300 400,200 600,400 S 800,500 1000,300" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth="2" 
              strokeDasharray="10 10" 
              className="animate-dash" 
            />
          </svg>
          
          <div className="absolute top-[30%] left-[20%] animate-float">
            <MapPin className="text-primary w-6 h-6 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
            <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">Delhi</span>
          </div>
          <div className="absolute top-[45%] left-[50%] animate-float-delayed">
            <MapPin className="text-accent w-8 h-8 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">Dubai</span>
          </div>
          <div className="absolute top-[25%] left-[80%] animate-float">
            <MapPin className="text-primary w-6 h-6 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
            <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">Paris</span>
          </div>
          
          <Plane className="absolute top-[35%] left-[35%] text-white w-6 h-6 -rotate-45 opacity-80 animate-float drop-shadow-md" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 px-12 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide uppercase mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            Join the Journey
          </div>
          <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
            Discover destinations.<br/>Design itineraries.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Share with the world.</span>
          </h2>
          
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-10 h-10 rounded-full border-2 border-black" />
              <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-10 h-10 rounded-full border-2 border-black" />
              <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-10 h-10 rounded-full border-2 border-black" />
              <div className="w-10 h-10 rounded-full border-2 border-black bg-surface flex items-center justify-center text-xs font-bold text-white">+2k</div>
            </div>
            <p className="text-sm font-medium text-white/80">Join thousands of explorers.</p>
          </div>
        </div>
      </div>

      {/* ── Right Side: Mobile Hero (Visible only on mobile) ── */}
      <div className="lg:hidden relative h-64 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" 
          alt="Dubai Skyline" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-black text-white">Your next adventure starts here.</h1>
        </div>
      </div>

      {/* ── Right Side: Signup Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10 bg-background/95 backdrop-blur-xl">
        <div className="w-full max-w-md animate-enter">
          
          <div className="mb-10 text-center lg:text-left hidden lg:block">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Your next adventure starts here.</h2>
            <p className="text-muted text-lg">Plan it. Explore it. Share it.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Error State */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">!</div>
                <p>{error}</p>
              </div>
            )}
            
            {/* Success State */}
            {success && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm flex items-start gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>Welcome aboard! Preparing your travel dashboard...</p>
              </div>
            )}

            {/* Floating Label Input: Full Name */}
            <div className="relative group">
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full px-5 py-4 text-white bg-surface border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200"
                placeholder=" "
                required
              />
              <label 
                htmlFor="fullName" 
                className="absolute text-sm text-muted duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Full Name
              </label>
            </div>

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
                Password (Min. 6 chars)
              </label>
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors focus:outline-none"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-6 py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-primary transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Setting up...
                </>
              ) : success ? (
                'Redirecting...'
              ) : (
                <>
                  Start Exploring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-muted mt-6">
              By joining, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}