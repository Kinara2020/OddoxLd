import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, MapPin, Sparkles, Calendar, DollarSign, Share2, ArrowRight, ShieldCheck, Globe, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleQuickStart = async () => {
    if (!user) await demoLogin();
    navigate('/dashboard');
  };

  const DESTINATIONS = [
    { city: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', tours: 142 },
    { city: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80', tours: 89 },
    { city: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80', tours: 204 },
    { city: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', tours: 156 },
    { city: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', tours: 312 },
    { city: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', tours: 94 },
  ];

  return (
    <div className="relative bg-background min-h-screen">
      
      {/* ── Immersive Hero ── */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Edge-to-edge background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80" 
            alt="Travel background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlays to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
        </div>

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-enter">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide uppercase mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            Discover the World
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 leading-[1.05] drop-shadow-2xl">
            Plan journeys you'll <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">never forget.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            Build personalized multi-city trips, discover places worth visiting, and keep your entire journey organized in one beautiful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleQuickStart}
              className="w-full sm:w-auto btn-primary px-8 py-4 text-base"
            >
              Start Planning
            </button>
            <Link
              to="/explore"
              className="w-full sm:w-auto btn-secondary px-8 py-4 text-base bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
            >
              Explore Trips
            </Link>
          </div>
        </div>
      </section>

      {/* ── Search / Discover Bar (overlapping the hero) ── */}
      <section className="relative z-30 -mt-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="gt-card bg-surface/90 backdrop-blur-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-card-hover border-white/10">
          <div className="flex-1 w-full flex items-center gap-3 bg-background/50 border border-border rounded-xl px-4 py-3">
            <Search className="text-muted w-5 h-5" />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="bg-transparent border-none p-0 focus:ring-0 text-base w-full placeholder-muted text-white"
            />
          </div>
          <button className="w-full sm:w-auto btn-primary px-8 py-3">
            Search
          </button>
        </div>
      </section>

      {/* ── Destinations Gallery ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">Where do you want to go?</h2>
          <p className="text-muted text-lg">Curated destinations to spark your wanderlust.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest, idx) => (
            <div key={idx} className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-500">
              <img 
                src={dest.img} 
                alt={dest.city} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{dest.city}</h3>
                  <p className="text-sm text-gray-300 font-medium">{dest.country}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why GlobeTrotter ── */}
      <section className="py-24 bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-16">Why GlobeTrotter?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Build your itinerary', desc: 'Drag, drop, and seamlessly organize multiple cities in one fluid timeline.', icon: MapPin, color: 'text-primary' },
              { title: 'Discover experiences', desc: 'Find hidden gems and top attractions powered by live global location data.', icon: Compass, color: 'text-accent' },
              { title: 'Track your budget', desc: 'Keep expenses in check with multi-currency tracking and visual breakdown charts.', icon: DollarSign, color: 'text-emerald-400' },
              { title: 'Share your journey', desc: 'Publish beautiful travel stories and allow friends to clone your exact itinerary.', icon: Share2, color: 'text-orange-400' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="gt-card p-8 text-left hover:-translate-y-2 transition-transform duration-300 bg-background/50">
                  <div className={`w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 shadow-sm`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-muted leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Get Inspired (Community CTA) ── */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Get inspired by the community</h2>
          <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
            Browse hundreds of public itineraries crafted by passionate travelers. Find a trip you love, and clone it to your account with a single click.
          </p>
          <Link
            to="/dashboard"
            className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-3"
          >
            Explore Public Itineraries <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
