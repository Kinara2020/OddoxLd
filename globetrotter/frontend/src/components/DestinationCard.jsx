import React from 'react';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DestinationCard({ dest }) {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(`/map?q=${encodeURIComponent(dest.city)}`);
  };

  return (
    <div onClick={handleExplore} className="group relative rounded-3xl overflow-hidden bg-surface border border-border shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer aspect-[3/4]">
      {/* Background Image */}
      <img
        src={dest.img}
        alt={dest.city}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

      {/* Top Action Bar */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 hover:text-rose-400 transition-colors"
        >
          <Heart size={18} className="text-white transition-colors" />
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <div className="mb-2">
          <span className="gt-badge bg-white/20 text-white backdrop-blur-md mb-3">
            <MapPin size={12} className="text-primary" /> {dest.country}
          </span>
          <h3 className="text-3xl font-extrabold text-white mb-1 drop-shadow-md">{dest.city}</h3>
          <p className="text-sm text-gray-300 font-medium line-clamp-2">
            {dest.description || 'Discover incredible experiences, local cuisine, and hidden gems in this iconic destination.'}
          </p>
        </div>

        {/* Hover Reveal Details */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pt-4 mt-4 border-t border-white/20 flex flex-wrap gap-2">
          {dest.tags?.map(tag => (
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-white bg-black/40 px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
          <button className="ml-auto flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover">
            Explore <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
