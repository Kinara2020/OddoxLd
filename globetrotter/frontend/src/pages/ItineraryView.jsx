import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import PackingList from '../components/PackingList';
import { Navigation, CheckCircle2 } from 'lucide-react';

const getStringHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return (Math.abs(hash) % 10000) + 1;
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

export default function ItineraryView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('route');

  useEffect(() => { api.get(`/trips/${id}`).then((res) => setTrip(res.data)); }, [id]);

  if (!trip) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-enter">
      <h1 className="text-3xl mb-6 text-white font-bold">{trip.name} — Full Itinerary</h1>

      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-slate-800 mb-8 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('route')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'route'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Navigation size={18} />
          Full Itinerary
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'packing'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckCircle2 size={18} />
          Smart Packing List
        </button>
      </div>

      {activeTab === 'route' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {trip.trip_stops?.map((s) => (
        <div key={s.id} className="mb-6">
          <h2 className="text-xl font-semibold border-b border-stone-200 pb-2 mb-3">
            {s.cities?.name}, {s.cities?.country}
          </h2>
          {s.trip_activities?.length === 0 && <p className="text-sm text-stone-400">No activities added yet.</p>}
          {s.trip_activities?.map((ta) => {
            const isIndia = (s.country || s.cities?.country || '').toLowerCase().includes('india');
            const currencySymbol = isIndia ? '₹' : '$';
            const displayCost = ta.cost > 0 ? ta.cost : getEstimatedCost(ta.activities || ta);
            return (
              <div key={ta.id} className="flex justify-between py-2 text-sm">
                <span>{ta.activities?.name}</span>
                <span className="text-stone-500">
                  <span className="text-xs text-stone-400 mr-2">(min. approx)</span>
                  {currencySymbol}{isIndia ? displayCost * 90 : displayCost}
                </span>
              </div>
            );
          })}
        </div>
      ))}
        </div>
      )}
      
      {activeTab === 'packing' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PackingList tripId={trip.id} />
        </div>
      )}
    </div>
  );
}