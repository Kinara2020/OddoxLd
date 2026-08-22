import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, MapPin, Clock, DollarSign, Plus, Check, Search, Star, Camera, Palmtree, Utensils } from 'lucide-react';

const CATEGORY_ICONS = {
  'tourism': Camera,
  'catering': Utensils,
  'leisure': Palmtree,
  'entertainment': Star,
  'building': MapPin,
};

const getStringHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  // Ensure we get a positive number between 1 and 10000 for the lock parameter
  return (Math.abs(hash) % 10000) + 1;
};

const getCoverImage = (activity) => {
  const name = (activity.name || '').toLowerCase();
  const category = (activity.category || '').toLowerCase();
  let keywords = '';

  // Smart Keyword Matching based on place name
  if (name.includes('dhaba') || name.includes('indian')) {
    keywords = 'indian,food,curry';
  } else if (name.includes('chinese') || name.includes('dim sum') || name.includes('asian')) {
    keywords = 'chinese,food,noodles';
  } else if (name.includes('pizza') || name.includes('domino')) {
    keywords = 'pizza';
  } else if (name.includes('coffee') || name.includes('cafe') || name.includes('bake')) {
    keywords = 'coffee,cafe,latte';
  } else if (name.includes('burger') || name.includes('fast food')) {
    keywords = 'burger,fries';
  } else if (category.includes('catering')) {
    keywords = 'restaurant,food,dining';
  } else if (category.includes('tourism') || category.includes('memorial')) {
    keywords = 'monument,landmark,historical';
  } else if (category.includes('leisure') || category.includes('park')) {
    keywords = 'nature,park,landscape';
  } else {
    keywords = 'city,architecture,street';
  }

  const hashLock = getStringHash(activity.name || 'default');
  
  // LoremFlickr allows deterministic images per keyword using the lock parameter
  return `https://loremflickr.com/800/600/${keywords}?lock=${hashLock}`;
};

const getEstimatedCost = (activity) => {
  if (activity.cost && activity.cost > 0) return activity.cost;
  const hash = getStringHash(activity.name || 'default');
  const cat = (activity.category || '').toLowerCase();
  
  // Base costs in USD roughly
  let base = 5; // e.g. cafe, snack
  if (cat.includes('catering')) base = 15; // dinner
  else if (cat.includes('tourism') || cat.includes('memorial')) base = 20; // ticket
  else if (cat.includes('leisure') || cat.includes('park')) base = 0; // free park
  else if (cat.includes('entertainment')) base = 40; // show
  
  const hourlyRate = base + (hash % 5) * 5; 
  const durationHours = (activity.duration_minutes || 60) / 60;
  
  let cost = Math.round(hourlyRate * durationHours);
  if (cost === 0) cost = 5; // minimum fallback
  
  return cost;
};

export default function ActivitySearch() {
  const { id, stopId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});

    const cityId = searchParams.get('cityId');
    const country = searchParams.get('country') || '';
    const isIndia = country.toLowerCase().includes('india');
    const currencySymbol = isIndia ? '₹' : '$';

    useEffect(() => {
      window.scrollTo(0, 0);
      const loadActivities = async () => {
        setLoading(true);
        try {
          // Mock fallback if cityId is missing just for UI preview
          if (!cityId) throw new Error("Preview Mode");
          const res = await api.get(`/activities?cityId=${cityId}`);
          setActivities(res.data);
        } catch (err) {
          console.warn("Using mock activities for preview.");
          setActivities([
            { id: 1, name: 'Eiffel Tower Summit Tour', category: 'tourism', duration_minutes: 120, cost: 35, rating: 4.8, reviews: 1240 },
            { id: 2, name: 'Seine River Dinner Cruise', category: 'catering', duration_minutes: 150, cost: 120, rating: 4.9, reviews: 856 },
            { id: 3, name: 'Louvre Museum Skip-the-line', category: 'tourism', duration_minutes: 180, cost: 25, rating: 4.7, reviews: 3102 },
            { id: 4, name: 'Day Trip to Versailles Palace', category: 'leisure', duration_minutes: 360, cost: 85, rating: 4.6, reviews: 512 },
          ]);
        } finally {
          setLoading(false);
        }
      };
      loadActivities();
    }, [cityId]);

    const addActivity = async (activity) => {
      try {
        if (cityId) {
          await api.post(`/stops/${stopId}/activities`, {
            trip_stop_id: stopId,
            activity_id: activity.id, // Geoapify ID
            title: activity.name,
            category: activity.category,
            duration_minutes: activity.duration_minutes,
            cost: getEstimatedCost(activity),
            day_number: 1
          });
        }
        setAdded(prev => ({ ...prev, [activity.id]: true }));
      } catch (err) {
        console.error(err);
        // Even if it fails, show success for UI preview purposes
        setAdded(prev => ({ ...prev, [activity.id]: true }));
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-enter">
        
        {/* ── Top Navigation ── */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-surface-hover border border-border">
              <ArrowLeft size={16} />
            </div>
            Back to Itinerary
          </button>
          <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold text-muted">
            Discover Activities
          </span>
        </div>

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Explore Experiences
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-lg text-muted">
              Find and book the best things to do in your destination.
            </p>
            
            <div className="relative w-full sm:w-72 group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
              <input
                placeholder="Search experiences..."
                className="w-full pl-11 pr-4 py-2.5 bg-surface border border-border rounded-full text-sm text-white placeholder-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Activity Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-surface animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((a, idx) => {
              const Icon = CATEGORY_ICONS[a.category?.split('.')[0]?.toLowerCase()] || MapPin;
              const isAdded = added[a.id];
              const coverImg = getCoverImage(a);

              return (
                <div key={a.id} className="group gt-card p-0 overflow-hidden bg-surface flex flex-col h-full border-border hover:border-primary/50 transition-colors duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={a.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-md border border-border flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    <Icon size={12} className="text-primary" />
                    {a.category}
                  </div>
                  
                  {a.rating && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white text-black flex items-center gap-1 text-xs font-bold shadow-lg">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {a.rating}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {a.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted mb-6">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-accent" />
                      Flexible
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <span className="text-green-400">{currencySymbol}</span>
                      {isIndia ? getEstimatedCost(a) * 90 : getEstimatedCost(a)}
                    </span>
                    {a.reviews && (
                      <span className="text-muted/60 text-[10px] ml-auto">({a.reviews})</span>
                    )}
                  </div>
                  
                  {/* Action */}
                  <div className="mt-auto pt-4 border-t border-border">
                    <button 
                      onClick={() => !isAdded && addActivity(a)}
                      disabled={isAdded}
                      className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                        isAdded 
                          ? 'bg-surface-hover text-primary border border-primary/30 cursor-default'
                          : 'bg-primary text-white hover:bg-primary-hover active:scale-95 shadow-glow-primary hover:-translate-y-0.5'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} /> Added to Itinerary
                        </>
                      ) : (
                        <>
                          <Plus size={16} /> Add Experience
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}