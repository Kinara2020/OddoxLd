import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Clock, DollarSign, Share2, Copy, Star, Navigation, Globe2, Compass } from 'lucide-react';

export default function SharedItinerary() {
  const { slug } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/public/${slug}`);
        setTrip(res.data);
      } catch (err) {
        console.warn("Public trip not found, using mock data for UI preview.");
        setTrip({
          name: "Epic Euro Summer 2026",
          description: "A comprehensive 3-week journey through the best of Western Europe. Features top-tier dining, extensive museum tours, and hidden local gems.",
          cover_photo_url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=80",
          profiles: { full_name: "Sarah Explorer" },
          trip_stops: [
            {
              id: 1, start_date: "2026-06-15", end_date: "2026-06-20",
              city_name: "Paris", country: "France",
              activities: [
                { id: 101, title: "Louvre Museum Tour", category: "Sightseeing", duration_minutes: 180, cost: 25 },
                { id: 102, title: "Seine Dinner Cruise", category: "Dining", duration_minutes: 120, cost: 150 }
              ]
            },
            {
              id: 2, start_date: "2026-06-20", end_date: "2026-06-25",
              city_name: "Amsterdam", country: "Netherlands",
              activities: [
                { id: 201, title: "Canal Boat Tour", category: "Sightseeing", duration_minutes: 90, cost: 20 }
              ]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Compass className="w-12 h-12 text-primary animate-spin-slow mb-4" />
      <p className="text-muted font-bold tracking-widest uppercase text-sm">Loading Itinerary...</p>
    </div>
  );

  if (trip === false) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div className="gt-card p-10 max-w-md border-border">
        <Globe2 className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
        <h1 className="text-2xl font-black text-white mb-2">Trip Not Found</h1>
        <p className="text-muted mb-6">This itinerary may be private or the link has expired.</p>
        <Link to="/explore" className="btn-primary w-full">Discover Public Trips</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 animate-enter">
      
      {/* ── Immersive Hero ── */}
      <div className="relative h-[60vh] min-h-[400px] w-full flex items-end">
        <div className="absolute inset-0">
          <img 
            src={trip.cover_photo_url || "https://images.unsplash.com/photo-1488646953014-85cb84e231b8?auto=format&fit=crop&w=2000&q=80"}
            alt={trip.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/20" />
        </div>
        
        {/* Floating Navbar Overlay */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <Link to="/explore" className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/60 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 hover:bg-black/60 transition-colors">
              <Share2 size={14} /> Share
            </button>
            <button className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-2 hover:bg-primary-hover shadow-glow-primary transition-colors">
              <Copy size={14} /> Clone Trip
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src={`https://ui-avatars.com/api/?name=${trip.profiles?.full_name || 'Creator'}&background=14b8a6&color=fff`} 
              alt="Creator" 
              className="w-12 h-12 rounded-full border-2 border-background"
            />
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Curated By</p>
              <p className="text-sm font-bold text-white">{trip.profiles?.full_name || 'Anonymous Explorer'}</p>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            {trip.name}
          </h1>
          
          {trip.description && (
            <p className="text-lg text-white/80 max-w-2xl font-medium drop-shadow-md">
              {trip.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Itinerary Content ── */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Stops Timeline */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-2">
            <Navigation className="text-accent" />
            The Journey
          </h2>
          
          <div className="space-y-12 relative">
            {/* Connecting Line */}
            <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-border z-0" />
            
            {trip.trip_stops?.map((s, index) => (
              <div key={s.id} className="relative z-10">
                {/* City Header */}
                <div className="flex items-center gap-6 mb-6 group">
                  <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-glow-primary shrink-0 relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <div className="absolute top-full h-8 w-0.5 bg-border -z-10 hidden group-last:block" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                      {s.city_name}
                      <span className="text-xs font-bold text-muted uppercase tracking-widest bg-surface px-2 py-0.5 rounded border border-border">
                        {s.country}
                      </span>
                    </h3>
                    <p className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-1">
                      <Calendar size={14} />
                      {s.start_date ? new Date(s.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'} 
                      {' — '} 
                      {s.end_date ? new Date(s.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'}
                    </p>
                  </div>
                </div>

                {/* Activities Grid */}
                <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {s.activities?.length > 0 ? (
                    s.activities.map((ta) => (
                      <div key={ta.id} className="gt-card p-4 bg-surface/50 border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
                        <div className="mb-4">
                          <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
                            {ta.category || 'Activity'}
                          </div>
                          <h4 className="font-bold text-white text-sm line-clamp-2">
                            {ta.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold text-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-primary" />
                            {ta.duration_minutes || 60}m
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={12} className="text-green-400" />
                            {ta.cost || 0}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-sm text-muted italic bg-surface/30 p-4 rounded-xl border border-dashed border-border">
                      No activities planned for this stop yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sticky Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 gt-card p-6 border-border shadow-card bg-surface/80 backdrop-blur-xl">
            <h3 className="text-lg font-black text-white mb-6">Trip Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm font-semibold text-muted">Destinations</span>
                <span className="text-sm font-bold text-white">{trip.trip_stops?.length || 0} Cities</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm font-semibold text-muted">Activities</span>
                <span className="text-sm font-bold text-white">
                  {trip.trip_stops?.reduce((acc, stop) => acc + (stop.activities?.length || 0), 0) || 0} Planned
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-semibold text-muted">Curated By</span>
                <span className="text-sm font-bold text-primary">{trip.profiles?.full_name?.split(' ')[0] || 'Creator'}</span>
              </div>
            </div>

            <button className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-glow-primary">
              <Copy size={16} />
              Clone to My Workspace
            </button>
            <p className="text-xs text-center text-muted mt-4 font-medium">
              Copy this exact itinerary to customize dates and activities.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}