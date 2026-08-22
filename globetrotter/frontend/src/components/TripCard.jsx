import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Globe, Clock } from 'lucide-react';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=800&q=80',
];

export default function TripCard({ trip, index = 0, actions }) {
  const coverImg = trip.cover_photo_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const cityCount = trip.trip_stops?.length || 0;
  
  // Calculate completion or duration if possible
  const startDate = trip.start_date ? new Date(trip.start_date) : null;
  const endDate = trip.end_date ? new Date(trip.end_date) : null;
  let duration = 'Flexible Dates';
  if (startDate && endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    duration = `${diffDays} Days`;
  }

  return (
    <Link to={`/trips/${trip.id}`} className="group block h-full">
      <div className="gt-card gt-card-hover h-full flex flex-col overflow-hidden bg-surface relative">
        
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden shrink-0">
          <img
            src={coverImg}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {trip.is_public && (
              <span className="gt-badge bg-primary/90 text-white backdrop-blur-md">
                <Globe size={12} className="mr-1" /> Public
              </span>
            )}
          </div>
          
          <div className="absolute top-4 right-4 gt-badge bg-black/60 text-white backdrop-blur-md">
            <MapPin size={12} className="mr-1 text-primary" /> {cityCount} {cityCount === 1 ? 'City' : 'Cities'}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-1 relative z-10 -mt-6">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">{trip.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-muted mb-4 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              {startDate ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-accent" />
              {duration}
            </span>
          </div>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-6 flex-1">
            {trip.description || 'No description provided for this itinerary. Click to add details, destinations, and activities.'}
          </p>
          
          {/* Progress / Status Footer */}
          <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary flex items-center justify-center text-xs font-bold text-white">
                {trip.title?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {actions ? (
                actions
              ) : (
                <>
                  <span className="text-xs font-semibold text-muted group-hover:text-white transition-colors">
                    View Itinerary
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center group-hover:bg-primary transition-colors">
                    <MapPin size={14} className="text-white" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}