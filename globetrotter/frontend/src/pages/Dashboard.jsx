import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Compass, Map, Clock, ArrowRight, Bookmark, Sparkles, Plane, MapPin } from 'lucide-react';
import TripCard from '../components/TripCard';
import EmptyState from '../components/EmptyState';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trips')
      .then((res) => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'Traveler';

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const upcomingTrips = trips.filter(t => !t.is_public).slice(0, 3);

  // Framer motion variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="pb-20">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-surface py-20 px-6 sm:px-12 lg:px-24 rounded-b-[3rem] border-b border-border/50 mb-12 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80" 
            alt="Aircraft wing" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none animate-float-delayed" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
              <Sparkles size={14} /> Welcome back
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight drop-shadow-md">
              {greeting},<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{displayName}.</span>
            </h1>
            <p className="text-lg text-white/80 max-w-lg mb-8">
              The world is waiting. Where will your next unforgettable journey take you?
            </p>
            <div className="flex items-center gap-4">
              <Link to="/trips/new" className="btn-primary shadow-glow-primary hover:scale-105 transition-transform duration-300">
                <Plane size={18} /> Plan a Trip
              </Link>
              <Link to="/explore" className="btn-secondary bg-white/5 hover:bg-white/10 border-white/10 backdrop-blur-md">
                <Compass size={18} /> Get Inspired
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="hidden lg:block w-72 h-72 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
            <img 
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80" 
              alt="Travel" 
              className="w-full h-full object-cover rounded-[2rem] border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -left-6 bg-surface/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="text-primary w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted font-bold uppercase">Next Stop</p>
                <p className="text-sm font-bold text-white">Paris, France</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* ── Upcoming / Active Trips ── */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="text-primary w-6 h-6" /> Continue Planning
            </h2>
            <Link to="/trips" className="text-sm font-semibold text-primary hover:text-white flex items-center gap-1 transition-colors group">
              View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-3xl bg-surface animate-pulse" />
              ))}
            </div>
          ) : upcomingTrips.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <EmptyState 
                title="No upcoming trips" 
                message="Your itinerary canvas is blank. Start planning your next unforgettable journey today."
                actionText="Create New Trip"
              />
            </motion.div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {upcomingTrips.map((trip, idx) => (
                <motion.div key={trip.id} variants={item}>
                  <TripCard trip={trip} index={idx} />
                </motion.div>
              ))}
              
              {/* Quick Create Card */}
              <motion.div variants={item}>
                <Link to="/trips/new" className="h-full min-h-[320px] rounded-3xl bg-surface/30 backdrop-blur-sm border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center p-8 text-center group transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary group-hover:shadow-glow-primary transition-all duration-500">
                    <Map className="w-8 h-8 text-muted group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Plan a new trip</h3>
                  <p className="text-sm text-muted">Draft a new multi-city itinerary from scratch.</p>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* ── Saved / Inspiration ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bookmark className="text-accent w-6 h-6" /> Saved Inspiration
            </h2>
            <Link to="/explore" className="text-sm font-semibold text-accent hover:text-white flex items-center gap-1 transition-colors group">
              Discover more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-surface to-background border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
            <Compass className="w-16 h-16 text-muted mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">You haven't saved any destinations yet</h3>
            <p className="text-muted mb-8 max-w-md relative z-10 text-lg">
              Explore community itineraries and save places you'd love to visit in the future.
            </p>
            <Link to="/explore" className="btn-secondary relative z-10 hover:bg-white hover:text-black transition-colors duration-300">
              Explore Destinations
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}