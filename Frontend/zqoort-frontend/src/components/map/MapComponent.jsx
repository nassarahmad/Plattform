import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png' });

function MapUpdater({ center, zoom }) { const map = useMap(); useEffect(() => { if (center) map.setView(center, zoom); }, [center, zoom, map]); return null; }

export default function MapComponent({ locations = [], onLocationClick, onMapClick, userLocation }) {
  const mapRef = useRef(null);
  const handleMapClick = (e) => onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <MapContainer center={userLocation || [31.9497, 35.9327]} zoom={userLocation ? 12 : 8} scrollWheelZoom className="w-full h-full" whenCreated={(m) => { mapRef.current = m; m.on('click', handleMapClick); }}>
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userLocation && <Marker position={userLocation}><Popup><div className="p-2 font-semibold text-blue-600">📍 موقعك</div></Popup></Marker>}
        {locations.map(loc => <Marker key={loc.id} position={loc.position} eventHandlers={{ click: () => onLocationClick?.(loc) }}><Popup><div className="p-2 min-w-[200px] space-y-2"><h3 className="font-semibold">{loc.title}</h3><p className="text-sm text-gray-600">{loc.description}</p><p className="text-xs bg-blue-100 text-blue-700 inline-block px-2 py-0.5 rounded-full">{loc.distanceText}</p><button onClick={() => onLocationClick?.(loc)} className="w-full mt-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">عرض التفاصيل</button></div></Popup></Marker>)}
        <MapUpdater center={userLocation} zoom={userLocation ? 12 : 8} />
      </MapContainer>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[400]">
        <button onClick={() => mapRef.current?.zoomIn()} className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center text-xl font-bold hover:bg-gray-50">+</button>
        <button onClick={() => mapRef.current?.zoomOut()} className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center text-xl font-bold hover:bg-gray-50">−</button>
      </div>
    </div>
  );
}