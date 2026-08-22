import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { Search, Plus, MapPin, Trash2, Calendar, ArrowRight, Loader2, GripVertical, Navigation, CheckCircle2 } from 'lucide-react';
import PackingList from '../components/PackingList';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('route');

  const loadTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
      // Auto-suggest cities based on trip title if there are no stops
      if (res.data.title && (!res.data.trip_stops || res.data.trip_stops.length === 0)) {
        setIsSearching(true);
        try {
          const searchRes = await api.get(`/cities/search?q=${res.data.title}`);
          setCityResults(searchRes.data);
        } catch (e) {
          console.error('Auto-suggest failed:', e);
        } finally {
          setIsSearching(false);
        }
      }
    } catch (err) {
      console.warn("Backend not connected. Loading mock data for UI preview.");
      setTrip({
        id: 'demo',
        title: 'Euro Trip 2026',
        start_date: '2026-06-15',
        end_date: '2026-07-10',
        cover_photo_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
        trip_stops: [
          { id: 1, order_index: 0, start_date: '2026-06-15', end_date: '2026-06-20', city_name: 'Paris', country: 'France' },
          { id: 2, order_index: 1, start_date: '2026-06-20', end_date: '2026-06-25', city_name: 'Amsterdam', country: 'Netherlands' },
          { id: 3, order_index: 2, start_date: '2026-06-25', end_date: '2026-06-30', city_name: 'Berlin', country: 'Germany' },
        ]
      });
    }
  };
  useEffect(() => { loadTrip(); }, [id]);

  const searchCities = async () => {
    if (!cityQuery) return;
    setIsSearching(true);
    try {
      const res = await api.get(`/cities/search?q=${cityQuery}`);
      setCityResults(res.data);
    } finally {
      setIsSearching(false);
    }
  };

  const addStop = async (city) => {
    try {
      await api.post('/stops', {
        trip_id: id,
        city_id: city.id,
        city_name: city.name,
        country: city.country,
        order_index: trip.trip_stops?.length || 0,
        start_date: trip.start_date,
        end_date: trip.end_date
      });
      setCityResults([]);
      setCityQuery('');
      loadTrip();
    } catch (err) {
      console.error('Error adding stop:', err.response?.data || err.message);
      alert('Failed to add stop: ' + (err.response?.data?.error || err.message));
    }
  };

  const removeStop = async (stopId) => {
    await api.delete(`/stops/${stopId}`);
    loadTrip();
  };

  if (!trip) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-semibold">Loading workspace...</p>
      </div>
    </div>
  );

  const stops = trip.trip_stops ? [...trip.trip_stops].sort((a, b) => a.order_index - b.order_index) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-enter">
      
      {/* ── Header Banner ── */}
      <div className="relative rounded-3xl overflow-hidden bg-surface border border-border mb-10 group">
        <div className="absolute inset-0">
          <img 
            src={trip.cover_photo_url || "https://images.unsplash.com/photo-1488646953014-85cb84e231b8?auto=format&fit=crop&w=1600&q=80"}
            alt="Trip Cover" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-wide uppercase mb-4 shadow-glow-primary">
            Workspace
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            {trip.title}
          </h1>
          <p className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible dates'} 
            {trip.end_date && ` — ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </p>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-border mb-8 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('route')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'route'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <Navigation size={18} />
          Route Builder
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'packing'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
              : 'text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <CheckCircle2 size={18} />
          Smart Packing List
        </button>
      </div>

      {activeTab === 'route' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ── Left Column: Add Destinations ── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="gt-card p-6 bg-surface/50 border-border">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="text-primary" size={20} />
              Add Destination
            </h2>
            
            <div className="relative mb-4 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
              <input
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Search city (e.g. Paris)..."
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-sm text-white placeholder-muted focus:outline-none focus:border-primary transition-all"
                onKeyDown={(e) => e.key === 'Enter' && searchCities()}
              />
            </div>
            <button 
              onClick={searchCities} 
              disabled={isSearching || !cityQuery}
              className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Find City
            </button>
            
            {/* Search Results / Suggestions */}
            {cityResults.length > 0 && (
              <div className="mt-6 border border-border rounded-xl overflow-hidden bg-background shadow-card animate-slide-up">
                <div className="bg-surface px-4 py-2 text-xs font-bold text-muted uppercase tracking-wider border-b border-border">
                  {cityQuery ? 'Search Results' : 'Suggested for you'}
                </div>
                {cityResults.map((c, idx) => (
                  <div 
                    key={c.id} 
                    className={`flex justify-between items-center px-4 py-3 ${idx !== cityResults.length - 1 ? 'border-b border-border' : ''} hover:bg-surface transition-colors group/item`}
                  >
                    <div>
                      <span className="block font-bold text-white text-sm">{c.name}</span>
                      <span className="block text-xs text-muted">{c.country}</span>
                    </div>
                    <button 
                      onClick={() => addStop(c)} 
                      className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-glow"
                      title="Add to Itinerary"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Interactive Itinerary Timeline ── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Navigation className="text-accent" size={24} />
              Route Overview
            </h2>
            <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-bold text-muted">
              {stops.length} {stops.length === 1 ? 'Stop' : 'Stops'}
            </span>
          </div>

          <div className="space-y-4 relative">
            {stops.length === 0 ? (
              <div className="gt-card p-12 text-center border-dashed border-border bg-surface/30">
                <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <MapPin className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No destinations yet</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Search for a city on the left to start building your itinerary route.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-10 ml-2">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border z-0" />
                
                {stops.map((s, index) => (
                  <div key={s.id} className="relative z-10 mb-6 last:mb-0 group/stop animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                    {/* Timeline Dot */}
                    <div className="absolute -left-[37px] sm:-left-[53px] top-6 w-6 h-6 rounded-full bg-surface border-2 border-primary flex items-center justify-center shadow-glow-primary transition-transform group-hover/stop:scale-110">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>

                    <div className="gt-card bg-surface/80 hover:bg-surface border-border p-0 overflow-hidden flex flex-col sm:flex-row transition-all duration-300">
                      
                      {/* Left side info */}
                      <div className="p-5 flex-1 flex items-start gap-4">
                        <div className="cursor-grab active:cursor-grabbing p-1 text-muted hover:text-white mt-1 hidden sm:block">
                          <GripVertical size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-bold text-white group-hover/stop:text-primary transition-colors">
                              {s.city_name}
                            </h3>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider bg-background px-2 py-0.5 rounded border border-border">
                              {s.country}
                            </span>
                          </div>
                          
                          <p className="text-xs text-muted flex items-center gap-1.5 mb-4">
                            <Calendar size={12} />
                            {s.start_date ? new Date(s.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'} 
                            {' — '} 
                            {s.end_date ? new Date(s.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'}
                          </p>

                          <div className="flex items-center gap-3">
                            <Link 
                              to={`/trips/${id}/stops/${s.id}/activities?cityId=${encodeURIComponent(s.city_name)}&country=${encodeURIComponent(s.country)}`} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 text-xs font-bold transition-colors"
                            >
                              <Plus size={14} /> Add Activities
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right side Actions/Visual */}
                      <div className="bg-background sm:w-24 flex sm:flex-col items-center justify-center p-3 border-t sm:border-t-0 sm:border-l border-border gap-2">
                        <button 
                          onClick={() => removeStop(s.id)} 
                          className="p-2 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full flex items-center justify-center group/btn"
                          title="Remove Destination"
                        >
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-border flex justify-end gap-4">
            <Link 
              to={`/trips/${id}/budget`} 
              className="btn-ghost text-sm px-6 py-3 flex items-center gap-2 group"
            >
              View Budget Tracker
            </Link>
            <Link 
              to={`/trips/${id}/view`} 
              className="btn-primary text-sm px-6 py-3 flex items-center gap-2 group"
            >
              Preview Itinerary
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* Packing List Section */}
      {activeTab === 'packing' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PackingList tripId={trip.id} />
        </div>
      )}
    </div>
  );
}