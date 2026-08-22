import React, { useState, useEffect } from 'react';
import { X, Search, MapPin, Calendar, Globe, Sparkles, Loader2 } from 'lucide-react';
import { discoveryAPI } from '../api/client';

export default function AddStopModal({ tripId, nextOrderIndex, onClose, onAdd }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await discoveryAPI.searchCities(query);
        setSearchResults(res.data || []);
      } catch (err) {
        console.error('City search failed:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity) {
      setError('Please search and select a city');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onAdd({
        trip_id: tripId,
        city_id: selectedCity.id,
        order_index: nextOrderIndex,
        start_date: startDate || null,
        end_date: endDate || null
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add stop');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            Add Destination Stop
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Add City to Itinerary</h2>
          <p className="text-xs text-slate-400">
            Search world destinations via Geoapify & local caches to attach to your trip timeline.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Search City / Destination
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Type a city name (e.g. Paris, Kyoto, Rome, Zurich)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedCity && selectedCity.name !== e.target.value) {
                    setSelectedCity(null);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {searching && (
                <Loader2 className="w-4 h-4 text-indigo-400 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              )}
            </div>

            {/* Results dropdown */}
            {searchResults.length > 0 && !selectedCity && (
              <div className="mt-2 bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/80 max-h-48 overflow-y-auto shadow-xl">
                {searchResults.map((city) => (
                  <button
                    type="button"
                    key={city.id || city.name}
                    onClick={() => {
                      setSelectedCity(city);
                      setQuery(`${city.name}, ${city.country}`);
                      setSearchResults([]);
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-800/60 transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                          {city.name}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {[city.region, city.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                    {city.popularity_score && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                        ★ {city.popularity_score} pop
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedCity && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">Selected: {selectedCity.name}</p>
                  <p className="text-[11px] text-slate-400">{selectedCity.country}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity(null);
                  setQuery('');
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Change
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Arrival Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Departure Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
              disabled={submitting || !selectedCity}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Stop to Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
