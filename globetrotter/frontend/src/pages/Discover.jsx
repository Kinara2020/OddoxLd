import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Map, Compass, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import api from '../api/client';

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [cloning, setCloning] = useState('');
  
  const filters = ['All', 'Europe', 'Asia', 'Americas', 'Beach', 'Culture', 'Adventure', 'Budget'];

  const destinations = [
    { city: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', tags: ['Culture', 'Asia', 'Historic'] },
    { city: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80', tags: ['Beach', 'Europe', 'Romantic'] },
    { city: 'Machu Picchu', country: 'Peru', img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80', tags: ['Adventure', 'Americas', 'Historic'] },
    { city: 'Amalfi Coast', country: 'Italy', img: 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?auto=format&fit=crop&w=800&q=80', tags: ['Europe', 'Beach', 'Luxury'] },
    { city: 'Banff', country: 'Canada', img: 'https://images.unsplash.com/photo-1517946972046-613d2f924df0?auto=format&fit=crop&w=800&q=80', tags: ['Nature', 'Americas', 'Adventure'] },
    { city: 'Marrakech', country: 'Morocco', img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80', tags: ['Culture', 'Africa', 'Historic'] },
    { city: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80', tags: ['Beach', 'Asia', 'Budget'] },
    { city: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80', tags: ['Adventure', 'Europe', 'Nature'] },
    { city: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', tags: ['City', 'Americas', 'Culture'] },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/map?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/map`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCloneTrip = async (tripTitle, days) => {
    setCloning(tripTitle);
    try {
      const today = new Date();
      const end = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      const res = await api.post('/trips', {
        title: tripTitle + ' (Clone)',
        start_date: today.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0]
      });
      
      const tripId = res.data.id;
      
      // Create some dummy stops based on the trip
      if (tripTitle.includes('Japan')) {
         await api.post('/stops', { trip_id: tripId, city_name: 'Tokyo', country: 'Japan', order_index: 0, start_date: today.toISOString().split('T')[0], end_date: new Date(today.getTime() + 4*24*60*60*1000).toISOString().split('T')[0] });
         await api.post('/stops', { trip_id: tripId, city_name: 'Kyoto', country: 'Japan', order_index: 1, start_date: new Date(today.getTime() + 4*24*60*60*1000).toISOString().split('T')[0], end_date: new Date(today.getTime() + 8*24*60*60*1000).toISOString().split('T')[0] });
         await api.post('/stops', { trip_id: tripId, city_name: 'Osaka', country: 'Japan', order_index: 2, start_date: new Date(today.getTime() + 8*24*60*60*1000).toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] });
      } else {
         await api.post('/stops', { trip_id: tripId, city_name: 'Paris', country: 'France', order_index: 0, start_date: today.toISOString().split('T')[0], end_date: new Date(today.getTime() + 4*24*60*60*1000).toISOString().split('T')[0] });
         await api.post('/stops', { trip_id: tripId, city_name: 'Rome', country: 'Italy', order_index: 1, start_date: new Date(today.getTime() + 4*24*60*60*1000).toISOString().split('T')[0], end_date: new Date(today.getTime() + 8*24*60*60*1000).toISOString().split('T')[0] });
         await api.post('/stops', { trip_id: tripId, city_name: 'Venice', country: 'Italy', order_index: 2, start_date: new Date(today.getTime() + 8*24*60*60*1000).toISOString().split('T')[0], end_date: end.toISOString().split('T')[0] });
      }
      
      navigate(`/trips/${tripId}`);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      } else {
        alert("Failed to clone trip. Please try again.");
      }
    } finally {
      setCloning('');
    }
  };

  return (
    <div className="page-container py-10 animate-enter">
      
      {/* ── Header & Search ── */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">Discover the World</h1>
        <p className="text-muted text-lg mb-8">Find inspiration for your next multi-city journey.</p>
        
        <div className="relative flex items-center bg-surface border border-border rounded-2xl p-2 shadow-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
          <Search className="w-6 h-6 text-muted ml-3" />
          <input 
            type="text" 
            placeholder="Where do you want to go?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-muted py-3 px-4 text-lg"
          />
          <button onClick={handleSearch} className="btn-primary py-3 px-6 rounded-xl hidden sm:flex">
            Explore
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide snap-x">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface border border-border text-white hover:bg-surface-hover shrink-0 snap-start">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="w-px h-6 bg-border mx-1 shrink-0" />
        
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 snap-start
              ${activeFilter === filter 
                ? 'bg-primary text-white shadow-glow-primary border border-primary' 
                : 'bg-surface border border-border text-muted hover:text-white hover:bg-surface-hover'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Masonry/Grid Feed ── */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {destinations
          .filter(dest => activeFilter === 'All' || dest.tags.includes(activeFilter))
          .map((dest, idx) => (
            <div key={idx} className="break-inside-avoid">
              <DestinationCard dest={dest} />
            </div>
        ))}
      </div>

      {/* ── Public Itineraries Section ── */}
      <div className="mt-24 mb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Compass className="text-primary" /> Trending Itineraries
            </h2>
            <p className="text-muted mt-1">Copy and customize trips created by other travelers.</p>
          </div>
          <button className="btn-ghost hidden sm:flex">View all</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Public Trip Card 1 */}
          <div className="gt-card flex flex-col sm:flex-row overflow-hidden group">
            <div className="sm:w-2/5 h-48 sm:h-auto relative">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" alt="Europe" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute top-3 left-3 gt-badge-primary bg-black/60 backdrop-blur-md">14 Days</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Classic Europe Summer</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">Paris, Rome, Florence, and Venice. The perfect introductory route to Western Europe.</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">A</div>
                  <span className="text-xs text-muted">by Alex</span>
                </div>
                <button 
                  onClick={() => handleCloneTrip('Classic Europe Summer', 14)}
                  disabled={cloning === 'Classic Europe Summer'}
                  className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {cloning === 'Classic Europe Summer' ? <Loader2 size={12} className="animate-spin" /> : null}
                  Clone Trip
                </button>
              </div>
            </div>
          </div>
          
          {/* Sample Public Trip Card 2 */}
          <div className="gt-card flex flex-col sm:flex-row overflow-hidden group">
            <div className="sm:w-2/5 h-48 sm:h-auto relative">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80" alt="Japan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute top-3 left-3 gt-badge-primary bg-black/60 backdrop-blur-md">10 Days</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Japan Golden Route</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">Tokyo, Kyoto, and Osaka. Experience the perfect blend of neon cityscapes and ancient temples.</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-400">S</div>
                  <span className="text-xs text-muted">by Sarah</span>
                </div>
                <button 
                  onClick={() => handleCloneTrip('Japan Golden Route', 10)}
                  disabled={cloning === 'Japan Golden Route'}
                  className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {cloning === 'Japan Golden Route' ? <Loader2 size={12} className="animate-spin" /> : null}
                  Clone Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
