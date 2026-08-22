import React, { useState, useEffect } from 'react';
import { X, Loader2, MapPin, Check } from 'lucide-react';
import { tripsAPI, stopsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AddToTripModal({ activity, location, onClose, onSuccess }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTrips() {
      if (!user) return;
      try {
        const res = await tripsAPI.getAll();
        setTrips(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedTripId(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError("Failed to load your trips.");
      } finally {
        setLoadingTrips(false);
      }
    }
    loadTrips();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTripId) return;
    
    setSubmitting(true);
    setError('');

    try {
      // 1. Fetch full trip details to check existing stops
      const tripRes = await tripsAPI.getById(selectedTripId);
      const trip = tripRes.data;
      
      const existingStops = trip.trip_stops || [];
      let targetStopId = null;

      // Find if we already have a stop for this city
      const existingStop = existingStops.find(s => s.cities?.name === location.name);
      
      if (existingStop) {
        targetStopId = existingStop.id;
      } else {
        // Create new stop for this city
        const newStopRes = await stopsAPI.create({
          trip_id: selectedTripId,
          city_name: location.name,
          country: location.country,
          order_index: existingStops.length
        });
        targetStopId = newStopRes.data.id;
      }

      // 2. Add Activity to this stop
      await stopsAPI.addActivity(targetStopId, {
        trip_stop_id: targetStopId,
        activity_id: `map-${Date.now()}`,
        day_number: 1, // Default to day 1
        start_time: '10:00',
        cost: activity.cost || 0,
        title: activity.name,
        category: activity.category,
        duration_minutes: activity.duration_minutes || 60
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to add activity to trip");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
        <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition"><X className="w-5 h-5" /></button>
          <MapPin className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-xs text-slate-400 mb-6">You need to log in to add activities to your itineraries.</p>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">Understood</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            Add to Itinerary
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Add <strong>{activity?.name}</strong> to one of your planned trips.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Trip
            </label>
            {loadingTrips ? (
              <div className="py-6 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400 mr-2" />
                <span className="text-xs">Loading your trips...</span>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-xs text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                You don't have any trips yet. Create one from the Dashboard first!
              </div>
            ) : (
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || trips.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-glow transition hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {submitting ? 'Adding...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
