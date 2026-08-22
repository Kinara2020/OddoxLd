import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Globe, MapPin, Calendar, Copy, Compass, Clock, Utensils, Music,
  Trees, ArrowRight, Loader2, Sparkles, Check, Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { publicAPI, tripsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TripMap from '../components/TripMap';
import BudgetOverview from '../components/BudgetOverview';

export default function PublicTrip() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, currency, demoLogin } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPublicTrip() {
      setLoading(true);
      try {
        const res = await publicAPI.getBySlug(slug);
        setTrip(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Public itinerary not found');
      } finally {
        setLoading(false);
      }
    }
    loadPublicTrip();
  }, [slug]);

  const handleCloneTrip = async () => {
    setCloning(true);
    try {
      if (!user) {
        await demoLogin();
      }
      const res = await tripsAPI.copy(trip.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        navigate(`/trips/${res.data.id}`);
      }, 700);
    } catch (err) {
      console.error('Failed to clone trip:', err);
      alert('Failed to clone itinerary.');
    } finally {
      setCloning(false);
    }
  };

  const getCategoryIcon = (cat = '') => {
    switch (cat.toLowerCase()) {
      case 'catering':
      case 'restaurant':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'entertainment':
        return <Music className="w-3.5 h-3.5 text-purple-400" />;
      case 'leisure':
      case 'park':
        return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span className="text-xs font-semibold">Loading public itinerary...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 rounded-3xl glass-card border border-slate-800 text-center">
        <Globe className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Public Itinerary Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          {error || 'This link may have expired or been set to private.'}
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2"
        >
          Explore GlobeTrotter
        </Link>
      </div>
    );
  }

  const stops = trip.trip_stops || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 mb-10 shadow-2xl">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={
              trip.cover_photo_url ||
              'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80'
            }
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                  <Globe className="w-3 h-3" />
                  Public Shared Itinerary
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-indigo-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {stops.length} Destinations
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {trip.name}
              </h1>
              {trip.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {trip.description}
                </p>
              )}
            </div>

            {/* Clone CTA */}
            <div className="shrink-0">
              <button
                onClick={handleCloneTrip}
                disabled={cloning}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {cloning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cloning into Account...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Trip to My Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Stops and Activities */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Route Itinerary Details
          </h2>

          <div className="space-y-6">
            {stops.map((stop, idx) => {
              const activities = stop.trip_activities || [];
              return (
                <div
                  key={stop.id}
                  className="glass-card rounded-2xl p-6 border border-slate-800"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-glow">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {stop.cities?.name}
                        </h3>
                        <p className="text-xs text-slate-400">{stop.cities?.country}</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full">
                      {activities.length} activities
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activities.map((ta) => {
                      const act = ta.activities || {};
                      return (
                        <div
                          key={ta.id}
                          className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              {getCategoryIcon(act.category)}
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Day {ta.day_number || 1}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-white">{act.name}</p>
                            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ta.start_time || '10:00 AM'}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-emerald-400">
                            {currency} {ta.cost || 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Map & Budget */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Route Map
            </h3>
            <TripMap stops={stops} />
          </div>

          <div>
            <BudgetOverview tripId={trip.id} stops={stops} />
          </div>
        </div>
      </div>
    </div>
  );
}
