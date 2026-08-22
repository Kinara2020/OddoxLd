import React from 'react';
import { Compass, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#222c3c] bg-[#0a0f18] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">
                Globe<span className="text-teal-400">Trotter</span>
              </span>
              <p className="text-[11px] text-slate-500">Multi-City Travel Itinerary Architect</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/trips" className="hover:text-slate-200 transition">My Trips</Link>
            <Link to="/" className="hover:text-slate-200 transition">Featured Route</Link>
            <Link to="/signup" className="hover:text-slate-200 transition">Sign Up</Link>
          </div>

          {/* Powered by */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Supabase • Geoapify • Live Rates
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for globetrotters
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
