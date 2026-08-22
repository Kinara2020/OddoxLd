import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icon assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CITY_COORDS = {
  paris: [48.8566, 2.3522],
  rome: [41.9028, 12.4964],
  tokyo: [35.6762, 139.6503],
  kyoto: [35.0116, 135.7681],
  barcelona: [41.3851, 2.1734],
  amsterdam: [52.3676, 4.9041],
  london: [51.5074, -0.1278],
  'new york': [40.7128, -74.0060],
  berlin: [52.5200, 13.4050],
  vienna: [48.2082, 16.3738],
  prague: [50.0755, 14.4378],
  bangkok: [13.7563, 100.5018],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  dubai: [25.2048, 55.2708],
  zurich: [47.3769, 8.5417]
};

function ChangeView({ center, zoom, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map]);
  return null;
}

export default function TripMap({ stops = [] }) {
  // Extract coordinates for each stop
  const points = stops.map((stop, idx) => {
    const cityName = (stop.cities?.name || '').toLowerCase();
    let coords = CITY_COORDS[cityName];
    if (!coords) {
      let hash = 0;
      for (let i = 0; i < cityName.length; i++) hash = (hash * 31 + cityName.charCodeAt(i)) % 1000;
      coords = [35 + (hash % 20), 10 + ((hash * 7) % 40)];
    }
    return {
      stop,
      coords,
      cityName: stop.cities?.name || `Stop ${idx + 1}`,
      country: stop.cities?.country || '',
      index: idx + 1
    };
  });

  const polylineCoords = points.map((p) => p.coords);
  const defaultCenter = points.length > 0 ? points[0].coords : [48.8566, 2.3522];
  const bounds = points.map((p) => p.coords);

  const createCustomIcon = (index) => {
    return L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #10b981);
          color: white;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
        ">
          ${index}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      <MapContainer
        center={defaultCenter}
        zoom={points.length > 1 ? 4 : 5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <ChangeView
          center={defaultCenter}
          zoom={points.length > 1 ? 4 : 5}
          bounds={bounds.length > 1 ? bounds : null}
        />

        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />

        {/* Connecting route polyline */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color="#6366f1"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />
        )}

        {/* Markers */}
        {points.map((p) => (
          <Marker key={p.stop.id || p.index} position={p.coords} icon={createCustomIcon(p.index)}>
            <Popup>
              <div className="p-1 min-w-[160px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {p.index}
                  </span>
                  <p className="font-bold text-sm text-white">{p.cityName}</p>
                </div>
                <p className="text-xs text-slate-400">{p.country}</p>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                  {p.stop.trip_activities?.length || 0} activities scheduled
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute top-4 right-4 z-[500] glass-panel px-3 py-2 rounded-xl text-xs flex items-center gap-3 border border-slate-700/60 shadow-lg pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-glow" />
          <span className="text-slate-300 font-medium">{stops.length} Cities</span>
        </div>
        <span className="text-slate-600">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-0.5 bg-indigo-400 border border-dashed" />
          <span className="text-slate-300 font-medium">Route</span>
        </div>
      </div>
    </div>
  );
}
