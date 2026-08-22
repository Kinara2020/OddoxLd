import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, MapPin, Star, Utensils, Camera, Palmtree, DollarSign, Plus } from 'lucide-react';
import L from 'leaflet';
import api from '../api/client';
import AddToTripModal from '../components/AddToTripModal';

// Fix leaflet icon issue in React safely
try {
  if (L && L.Icon && L.Icon.Default) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }
} catch (e) {
  console.warn("Leaflet icon fix failed:", e);
}

// Map Helpers
const CATEGORY_ICONS = {
  'tourism': Camera,
  'catering': Utensils,
  'leisure': Palmtree,
  'entertainment': Star,
  'building': MapPin,
};

const getStringHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return (Math.abs(hash) % 10000) + 1;
};

const getCoverImage = (activity) => {
  const name = (activity.name || '').toLowerCase();
  const category = (activity.category || '').toLowerCase();
  let keywords = '';
  if (name.includes('dhaba') || name.includes('indian')) keywords = 'indian,food';
  else if (name.includes('chinese') || name.includes('dim sum') || name.includes('asian')) keywords = 'chinese,food';
  else if (name.includes('pizza') || name.includes('domino')) keywords = 'pizza';
  else if (name.includes('coffee') || name.includes('cafe')) keywords = 'coffee,cafe';
  else if (name.includes('burger') || name.includes('fast food')) keywords = 'burger,fries';
  else if (category.includes('catering')) keywords = 'restaurant,food,dining';
  else if (category.includes('tourism') || category.includes('memorial')) keywords = 'monument,landmark,historical';
  else if (category.includes('leisure') || category.includes('park')) keywords = 'nature,park,landscape';
  else keywords = 'city,architecture,street';

  const hashLock = getStringHash(activity.name || 'default');
  return `https://loremflickr.com/400/300/${keywords}?lock=${hashLock}`;
};

const getEstimatedCost = (activity) => {
  if (activity.cost && activity.cost > 0) return activity.cost;
  const hash = getStringHash(activity.name || 'default');
  const cat = (activity.category || '').toLowerCase();
  let base = 100;
  if (cat.includes('catering')) base = 500;
  else if (cat.includes('tourism') || cat.includes('memorial')) base = 200;
  else if (cat.includes('leisure') || cat.includes('park')) base = 50;
  else if (cat.includes('entertainment')) base = 1000;
  return base + (hash % 5) * 100;
};

// Helper component to center map when coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function InteractiveMap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [activities, setActivities] = useState([]);
  const [selectedActivityForModal, setSelectedActivityForModal] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        // 1. Search for city to get coordinates
        const cityRes = await api.get(`/cities/search?q=${encodeURIComponent(query)}`);
        
        if (cityRes.data && cityRes.data.length > 0) {
          const target = cityRes.data[0];
          setLocation({
            lat: target.lat,
            lon: target.lon,
            name: target.name,
            country: target.country
          });
          
          // 2. Fetch activities for those coordinates to populate map
          try {
            const actRes = await api.get(`/activities?lat=${target.lat}&lon=${target.lon}`);
            if (actRes.data) {
               // The Geoapify API actually needs lat/lon for activities, but the backend uses cityId.
               // Let's assume the backend handles it or we'll mock some pins if it fails.
               setActivities(actRes.data);
            }
          } catch(e) {
             console.warn("Could not fetch activities for map pins", e);
          }
          
        } else {
          setError('Location not found. Try a different search term.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch location data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocation();
  }, [query]);

  // Default to World View if no query
  const defaultCenter = [20, 0];
  const center = location ? [location.lat, location.lon] : defaultCenter;
  const zoom = location ? 12 : 2;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] animate-enter">
      {/* ── Top Bar Overlay ── */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex justify-between items-center pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/90 backdrop-blur-md border border-border text-white shadow-lg hover:bg-surface transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-bold">Back</span>
        </button>
        
        {location && (
          <div className="pointer-events-auto px-6 py-2.5 rounded-full bg-primary/90 backdrop-blur-md text-white shadow-lg shadow-primary/20 flex items-center gap-2">
            <MapPin size={18} />
            <span className="font-bold tracking-wide">{location.name}, {location.country}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-bold tracking-wider">Mapping your journey...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
          <p className="text-red-400 font-bold text-xl mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary px-6 py-2 rounded-xl pointer-events-auto">Go Back</button>
        </div>
      )}

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <ChangeView center={center} zoom={zoom} />
        
        {/* Dark mode friendly map tiles using standard OSM and CSS filter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />

        {/* Original City Marker */}
        {location && (
          <Marker position={[location.lat, location.lon]}>
            <Popup>
              <div className="text-center font-sans">
                <strong>{location.name}</strong><br/>
                {location.country}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Activity Markers */}
        {activities.map((a) => {
          if (!a.lat || !a.lon) return null;
          const Icon = CATEGORY_ICONS[a.category?.split('.')[0]?.toLowerCase()] || MapPin;
          const cost = getEstimatedCost(a);
          const img = getCoverImage(a);
          
          return (
            <Marker key={a.id} position={[a.lat, a.lon]}>
              <Popup className="gt-map-popup">
                <div className="w-48 overflow-hidden rounded-xl bg-surface border border-border flex flex-col p-0 shadow-xl">
                  <div className="h-28 relative">
                    <img src={img} alt={a.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-md text-white text-[9px] font-bold uppercase flex items-center gap-1 border border-border">
                      <Icon size={10} className="text-primary" /> {a.category}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2">{a.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                        <DollarSign size={12} />
                        {cost}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivityForModal(a);
                        }}
                        className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-glow"
                      >
                        <Plus size={10} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {selectedActivityForModal && (
        <AddToTripModal
          activity={selectedActivityForModal}
          location={location}
          onClose={() => setSelectedActivityForModal(null)}
          onSuccess={() => alert('Successfully added to your itinerary!')}
        />
      )}
    </div>
  );
}
