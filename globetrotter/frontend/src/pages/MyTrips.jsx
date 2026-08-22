import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Trash2, Copy, Share2, Search, Plus, MapPin } from 'lucide-react';
import TripCard from '../components/TripCard';
import EmptyState from '../components/EmptyState';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.get('/trips')
      .then((res) => setTrips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { load(); }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return;
    try {
      await api.delete(`/trips/${id}`);
      load();
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  };

  const filtered = trips.filter((t) =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container py-10 animate-enter">
      {/* ── Page Header & Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">My Itineraries</h1>
          <p className="text-lg text-muted">
            Manage your multi-city journeys and upcoming adventures.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search your trips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-white placeholder-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          {/* Create Trip */}
          <Link
            to="/trips/new"
            className="w-full sm:w-auto btn-primary whitespace-nowrap"
          >
            <Plus size={18} />
            Create Trip
          </Link>
        </div>
      </div>

      {/* ── Trip Cards Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] rounded-2xl bg-surface animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="max-w-xl mx-auto">
          <EmptyState 
            icon={MapPin}
            title={search ? 'No trips match your search' : 'Your travel calendar is empty'}
            message={search ? 'Try adjusting your search keywords.' : 'Start planning your first multi-city adventure today. Click the button below to get started.'}
            actionText={search ? null : 'Create Your First Trip'}
            actionLink={search ? null : '/trips/new'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, idx) => (
            <div key={t.id} className="relative group/wrapper h-full">
              <TripCard 
                trip={t} 
                index={idx}
                actions={
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-colors"
                      title="Share"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-colors"
                      title="Clone"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(t.id, e)}
                      className="p-2 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}