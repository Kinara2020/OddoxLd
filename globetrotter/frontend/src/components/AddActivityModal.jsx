import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, DollarSign, Plus, Check, Loader2, Compass, Utensils, Music, Trees } from 'lucide-react';
import { discoveryAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AddActivityModal({ stop, onClose, onAddActivity }) {
  const { currency } = useAuth();
  const [tab, setTab] = useState('discover'); // 'discover' | 'custom'
  const [discovered, setDiscovered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Form fields
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('tourism');
  const [dayNumber, setDayNumber] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [cost, setCost] = useState(25);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadActivities() {
      if (!stop?.city_id) return;
      setLoading(true);
      try {
        const res = await discoveryAPI.getActivities(stop.city_id);
        setDiscovered(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedActivity(res.data[0]);
          setCost(res.data[0].cost || 0);
        }
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, [stop?.city_id]);

  const handleSelectDiscovered = (act) => {
    setSelectedActivity(act);
    setCost(act.cost || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let activityId = selectedActivity?.id;

      // If custom or selected activity doesn't have an ID
      if (tab === 'custom' || !activityId) {
        // Fallback placeholder ID or let backend map it
        activityId = `custom-${Date.now()}`;
      }

      await onAddActivity({
        trip_stop_id: stop.id,
        activity_id: activityId,
        day_number: Number(dayNumber) || 1,
        start_time: startTime || '10:00',
        cost: Number(cost) || 0,
        // Send meta in case local fallback needs it
        activityMeta: tab === 'custom' ? {
          name: customName,
          category: customCategory,
          cost: Number(cost) || 0,
          duration_minutes: 60
        } : selectedActivity
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add activity');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Activity Planner
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Plan Activity for {stop?.cities?.name || 'City Stop'}
          </h2>
          <p className="text-xs text-slate-400">
            Browse discovered highlights in {stop?.cities?.name} or log your own custom excursion.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setTab('discover')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              tab === 'discover'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌟 Discovered Highlights ({discovered.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('custom')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              tab === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✏️ Custom Activity
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {tab === 'discover' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select from Curated & Geoapify Places:
              </label>
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="text-xs">Fetching places for {stop?.cities?.name}...</span>
                </div>
              ) : discovered.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                  No places found. Switch to Custom Activity to add your own.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
                  {discovered.map((act) => {
                    const isSelected = selectedActivity?.name === act.name;
                    return (
                      <button
                        type="button"
                        key={act.id || act.name}
                        onClick={() => handleSelectDiscovered(act)}
                        className={`p-3 rounded-xl text-left border transition flex items-start justify-between gap-2 group ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/40'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {getCategoryIcon(act.category)}
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              {act.category || 'Sight'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                            {act.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            ~{act.duration_minutes || 60} mins • {currency} {act.cost || 0}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Activity Name</label>
                <input
                  type="text"
                  required={tab === 'custom'}
                  placeholder="e.g. Sunset Kayaking Tour / Rooftop Cocktails"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="tourism">Tourism & Sights</option>
                  <option value="catering">Dining & Food</option>
                  <option value="entertainment">Entertainment & Nightlife</option>
                  <option value="leisure">Parks & Leisure</option>
                </select>
              </div>
            </div>
          )}

          {/* Timing & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Trip Day Number</label>
              <input
                type="number"
                min="1"
                max="30"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estimated Cost ({currency})
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
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
              disabled={submitting || (tab === 'discover' && !selectedActivity)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-glow-emerald transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add to Day Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
