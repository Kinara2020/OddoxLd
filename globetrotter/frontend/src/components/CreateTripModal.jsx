import React, { useState } from 'react';
import { X, Calendar, Image as ImageIcon, MapPin, Sparkles, Check } from 'lucide-react';

const COVER_PRESETS = [
  {
    title: 'Paris, France',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Kyoto, Japan',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Amalfi Coast, Italy',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Swiss Alps',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'New York City',
    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    title: 'Santorini, Greece',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function CreateTripModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(COVER_PRESETS[0].url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Trip name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onCreate({
        name,
        start_date: startDate || null,
        end_date: endDate || null,
        description,
        cover_photo_url: coverPhotoUrl
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create trip');
    } finally {
      setLoading(false);
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

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            New Itinerary
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create a New Trip</h2>
          <p className="text-xs text-slate-400">
            Set up your journey framework. You will add cities, activities, and budget targets next.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Trip Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Scandinavian Summer & Fjord Expedition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date</label>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date</label>
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Overview & Notes</label>
            <textarea
              rows={3}
              placeholder="What are the main goals or vibes of this trip?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Choose a Cover Photo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {COVER_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.title}
                  onClick={() => setCoverPhotoUrl(preset.url)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition group text-left ${
                    coverPhotoUrl === preset.url
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-transparent hover:border-slate-600'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] font-medium text-white truncate">{preset.title}</span>
                  </div>
                  {coverPhotoUrl === preset.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="Or paste a custom image URL"
                value={coverPhotoUrl}
                onChange={(e) => setCoverPhotoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
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
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-glow-emerald transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Start Planning Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
