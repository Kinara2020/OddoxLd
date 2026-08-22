import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, Compass, Loader2, MapPin, CalendarDays, Navigation } from 'lucide-react';

export default function CreateTrip() {
  const [form, setForm] = useState({ title: '', start_date: '', end_date: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/trips', form);
      // Navigate to the trip detail view where they can start adding cities
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
      setLoading(false);
    }
  };

  // Modern browser date picker trigger
  const handleDateClick = (e) => {
    if (e.target.showPicker) {
      e.target.showPicker();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background">
      
      {/* ── Left Side: Map Visual / Inspiration ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface overflow-hidden border-r border-border">
        {/* Beautiful map/terrain image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" 
            alt="Map terrain" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
        </div>

        {/* Floating UI Elements on the map */}
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 backdrop-blur-md border border-border text-white text-sm font-bold shadow-card">
              <Navigation className="w-4 h-4 text-primary" />
              New Journey
            </div>
          </div>
          
          <div className="relative">
            <h2 className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-lg max-w-md">
              Every great journey begins with a single step.
            </h2>
            <p className="text-lg text-white/80 max-w-md font-medium">
              Give your adventure a name and a timeframe. Next, you'll map out your cities and build your perfect itinerary.
            </p>
          </div>
        </div>

        {/* Interactive map dot animation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-primary/20 animate-ping absolute -left-1 -top-1" />
            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_rgba(20,184,166,1)] border-2 border-white relative z-10" />
            
            {/* Dynamic line connecting to form */}
            <svg className="absolute top-2 left-4 w-64 h-32 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 0,0 C 100,0 150,100 250,100" 
                fill="transparent" 
                stroke="rgba(20,184,166,0.3)" 
                strokeWidth="2" 
                strokeDasharray="6 6"
                className="animate-dash"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Right Side: Mobile Hero ── */}
      <div className="lg:hidden relative h-48 overflow-hidden shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" 
          alt="Map" 
          className="w-full h-full object-cover mix-blend-luminosity opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-black text-white">Plan your journey</h1>
        </div>
      </div>

      {/* ── Right Side: Creation Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 animate-enter relative">
        <div className="absolute top-6 left-6 lg:top-12 lg:left-12">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-surface-hover border border-border">
              <ArrowLeft size={16} />
            </div>
            Back
          </Link>
        </div>

        <div className="w-full max-w-md mt-16 lg:mt-0">
          <div className="mb-10 text-center lg:text-left hidden lg:block">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create Workspace</h2>
            <p className="text-muted text-lg">Define the basics of your trip.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">!</div>
                <p>{error}</p>
              </div>
            )}

            {/* Trip Name */}
            <div className="relative group">
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="block w-full px-5 py-4 pl-12 text-white bg-surface border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200"
                placeholder=" "
                required
              />
              <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted peer-focus:text-primary transition-colors" />
              <label 
                htmlFor="title" 
                className="absolute text-sm text-muted duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-10"
              >
                Trip Name (e.g. Euro Trip 2026)
              </label>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  onClick={handleDateClick}
                  className="block w-full px-5 py-4 pl-12 text-white bg-surface border border-border rounded-xl focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200 cursor-pointer min-h-[58px]"
                  required
                />
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted peer-focus:text-primary transition-colors" />
                <label 
                  htmlFor="start_date" 
                  className="absolute text-[11px] font-bold uppercase tracking-wider text-muted top-1.5 left-12 peer-focus:text-primary transition-colors"
                >
                  Start Date
                </label>
              </div>

              <div className="relative group">
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  onClick={handleDateClick}
                  min={form.start_date}
                  className="block w-full px-5 py-4 pl-12 text-white bg-surface border border-border rounded-xl focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200 cursor-pointer min-h-[58px]"
                  required
                />
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted peer-focus:text-primary transition-colors" />
                <label 
                  htmlFor="end_date" 
                  className="absolute text-[11px] font-bold uppercase tracking-wider text-muted top-1.5 left-12 peer-focus:text-primary transition-colors"
                >
                  End Date
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="relative group">
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="block w-full px-5 py-4 text-white bg-surface border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors duration-200 resize-none"
                placeholder=" "
                rows={3}
              />
              <label 
                htmlFor="description" 
                className="absolute text-sm text-muted duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Description (Optional)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary-hover shadow-glow-primary transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-2 group mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Preparing Workspace...
                </>
              ) : (
                <>
                  Create Trip Workspace <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}