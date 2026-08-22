import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Plus, Share2, Copy, Trash2, ArrowLeft,
  Clock, DollarSign, Compass, Utensils, Music, Trees, Sparkles,
  Layers, Map as MapIcon, PieChart, CheckCircle2, Loader2, Globe
} from 'lucide-react';
import { tripsAPI, stopsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AddStopModal from '../components/AddStopModal';
import AddActivityModal from '../components/AddActivityModal';
import ShareTripModal from '../components/ShareTripModal';
import TripMap from '../components/TripMap';
import BudgetOverview from '../components/BudgetOverview';
import PackingList from '../components/PackingList';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stops'); // 'stops' | 'timeline' | 'map' | 'budget'
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState('');

  const loadTrip = async () => {
    try {
      const res = await tripsAPI.getById(id);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Trip not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const handleAddStop = async (stopData) => {
    await stopsAPI.create(stopData);
    await loadTrip();
  };

  const handleDeleteStop = async (stopId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this city stop and its activities?')) return;
    try {
      await stopsAPI.delete(stopId);
      await loadTrip();
    } catch (err) {
      console.error('Failed to delete stop:', err);
    }
  };

  const handleAddActivity = async (activityData) => {
    await stopsAPI.addActivity(activityData.trip_stop_id, activityData);
    await loadTrip();
  };

  const handleCopyTrip = async () => {
    try {
      const res = await tripsAPI.copy(trip.id);
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      console.error('Failed to clone trip:', err);
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this trip?')) return;
    try {
      await tripsAPI.delete(trip.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to delete trip:', err);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span className="text-xs font-semibold">Loading itinerary workspace...</span>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl glass-card border border-rose-500/30 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Trip Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">{error || 'This itinerary does not exist.'}</p>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const stops = trip.trip_stops || [];

  // Group all activities for Timeline view
  const allScheduledActivities = [];
  stops.forEach((stop, stopIdx) => {
    (stop.trip_activities || []).forEach((act) => {
      allScheduledActivities.push({
        ...act,
        stopCity: stop.cities?.name || `Stop ${stopIdx + 1}`,
        stopCountry: stop.cities?.country || '',
        activityDetails: act.activities || { name: 'Custom Activity', category: 'tourism' }
      });
    });
  });

  allScheduledActivities.sort((a, b) => (a.day_number ?? 1) - (b.day_number ?? 1));

  // Group activities by Day number
  const daysGrouped = {};
  allScheduledActivities.forEach((act) => {
    const day = act.day_number || 1;
    if (!daysGrouped[day]) daysGrouped[day] = [];
    daysGrouped[day].push(act);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 mb-8 shadow-2xl">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={
              trip.cover_photo_url ||
              'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80'
            }
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {trip.is_public && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                    <Globe className="w-3 h-3" />
                    Public Itinerary
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-indigo-300 text-[11px] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {stops.length} {stops.length === 1 ? 'Destination' : 'Destinations'}
                </span>
                {trip.start_date && (
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300 text-[11px] font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    {trip.end_date && ` - ${new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </span>
                )}
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

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Share</span>
              </button>

              <button
                onClick={handleCopyTrip}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Clone</span>
              </button>

              <button
                onClick={handleDeleteTrip}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-8">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'stops', label: 'City Destinations', icon: Layers, count: stops.length },
            { id: 'timeline', label: 'Daily Timeline', icon: Calendar, count: allScheduledActivities.length },
            { id: 'map', label: 'Route Map', icon: MapIcon },
            { id: 'budget', label: 'Budget Analyzer', icon: PieChart },
            { id: 'packing', label: 'Packing List', icon: CheckCircle2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count != null && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'stops' && (
          <button
            onClick={() => setShowAddStopModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-glow-emerald transition hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add City Destination</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: City Stops */}
      {activeTab === 'stops' && (
        <div className="space-y-6">
          {stops.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl glass-card border border-slate-800 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No City Stops Yet</h3>
              <p className="text-xs text-slate-400 mb-6">
                Add cities like Paris, Tokyo, or Rome to build your multi-destination travel route.
              </p>
              <button
                onClick={() => setShowAddStopModal(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-glow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First City</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {stops.map((stop, idx) => {
                const cityActivities = stop.trip_activities || [];
                return (
                  <div
                    key={stop.id}
                    className="glass-card rounded-2xl border border-slate-800/80 p-6 relative overflow-hidden group hover:border-slate-700 transition duration-300"
                  >
                    {/* Stop Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white font-extrabold text-sm flex items-center justify-center shadow-glow">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">
                              {stop.cities?.name || 'Destination'}
                            </h3>
                            <span className="text-xs font-medium text-slate-400">
                              {stop.cities?.country}
                            </span>
                          </div>
                          {(stop.start_date || stop.end_date) && (
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {stop.start_date && new Date(stop.start_date).toLocaleDateString()}
                              {stop.end_date && ` → ${new Date(stop.end_date).toLocaleDateString()}`}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveStopForActivity(stop)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition hover:scale-105"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Activity</span>
                        </button>

                        <button
                          onClick={(e) => handleDeleteStop(stop.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Activities List */}
                    <div className="mt-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                        <span>Scheduled Excursions & Places ({cityActivities.length})</span>
                      </div>

                      {cityActivities.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
                          <span>No activities attached to this stop yet.</span>
                          <button
                            onClick={() => setActiveStopForActivity(stop)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Discover Places in {stop.cities?.name}
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {cityActivities.map((ta) => {
                            const act = ta.activities || {};
                            return (
                              <div
                                key={ta.id}
                                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                      {getCategoryIcon(act.category)}
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Day {ta.day_number || 1}
                                      </span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-400">
                                      {currency} {ta.cost || 0}
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-white line-clamp-1">{act.name || 'Custom Activity'}</p>
                                </div>

                                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {ta.start_time || '10:00 AM'}
                                  </span>
                                  <span>{act.duration_minutes ? `~${act.duration_minutes}m` : '60m'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Daily Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {Object.keys(daysGrouped).length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No scheduled activities across days yet.</p>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-indigo-500/20">
              {Object.keys(daysGrouped).map((dayKey) => {
                const dayActivities = daysGrouped[dayKey];
                return (
                  <div key={dayKey} className="relative pl-10 sm:pl-14">
                    {/* Day Badge Node */}
                    <div className="absolute left-2 sm:left-4 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-glow border-2 border-slate-900">
                      D{dayKey}
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-extrabold text-white">
                          Day {dayKey} Itinerary
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {dayActivities.length} {dayActivities.length === 1 ? 'Activity' : 'Activities'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {dayActivities.map((act) => (
                          <div
                            key={act.id}
                            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                                {getCategoryIcon(act.activityDetails.category)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white">{act.activityDetails.name}</p>
                                <p className="text-[11px] text-slate-400">
                                  {act.stopCity} • {act.activityDetails.category || 'Sight'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {act.start_time || '10:00'}
                              </span>
                              <span className="font-bold text-emerald-400">
                                {currency} {act.cost || 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Interactive Route Map */}
      {activeTab === 'map' && (
        <div>
          <TripMap stops={stops} />
        </div>
      )}

      {/* TAB CONTENT: Budget Analyzer */}
      {activeTab === 'budget' && (
        <div>
          <BudgetOverview tripId={trip.id} stops={stops} />
        </div>
      )}

      {/* TAB CONTENT: Packing List */}
      {activeTab === 'packing' && (
        <div>
          <PackingList tripId={trip.id} />
        </div>
      )}

      {/* Modals */}
      {showAddStopModal && (
        <AddStopModal
          tripId={trip.id}
          nextOrderIndex={stops.length}
          onClose={() => setShowAddStopModal(false)}
          onAdd={handleAddStop}
        />
      )}

      {activeStopForActivity && (
        <AddActivityModal
          stop={activeStopForActivity}
          onClose={() => setActiveStopForActivity(null)}
          onAddActivity={handleAddActivity}
        />
      )}

      {showShareModal && (
        <ShareTripModal
          trip={trip}
          onClose={() => setShowShareModal(false)}
          onShared={(updated) => setTrip({ ...trip, ...updated })}
        />
      )}
    </div>
  );
}
