import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { requestAPI } from '../../api/requests';
import { useAuth } from '../../context/AuthContext';
import { getSocket, socketActions, socketEvents } from '../../socket';
import { toast } from 'react-toastify';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center, map]);
  return null;
}

const categoryIcons = {
  medical: '🏥', food: '🍽️', transport: '🚗', evacuation: '🚨', other: '📍'
};

export default function MapView({ onRequestSelect, showControls = true }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultCenter = [31.9454, 35.9283]; // فلسطين
  const center = userLocation || defaultCenter;

  const loadNearbyRequests = useCallback(async (lat, lng, radius = 15000) => {
    try {
      const { data } = await requestAPI.getNearby(lng, lat, radius);
      setRequests(data.requests || []);
    } catch (err) {
      toast.error('فشل تحميل الطلبات القريبة');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        loadNearbyRequests(latitude, longitude);
      },
      () => {
        loadNearbyRequests(defaultCenter[0], defaultCenter[1]);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [loadNearbyRequests]);

  // Socket: listen for new messages/locations
  useEffect(() => {
    if (!user?.token) return;
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.type === 'location') {
        const loc = JSON.parse(msg.content);
        toast.info(`📍 موقع جديد من ${msg.sender?.name || 'مستخدم'}`);
      }
    };

    socket.on(socketEvents.NEW_MESSAGE, handleNewMessage);
    return () => socket.off(socketEvents.NEW_MESSAGE, handleNewMessage);
  }, [user]);

  const handleMarkerClick = (request) => {
    if (onRequestSelect) onRequestSelect(request);
  };

  if (loading) {
    return <div className="h-96 flex items-center justify-center">جارٍ تحميل الخريطة... 🗺️</div>;
  }

  return (
    <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>📍 موقعك الحالي</Popup>
          </Marker>
        )}

        {/* Request markers */}
        {requests.map((req) => {
          const [lng, lat] = req.location.coordinates;
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="text-2xl bg-white rounded-full p-2 shadow-lg border-2 border-primary">${categoryIcons[req.category] || '📍'}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
          return (
            <Marker key={req._id} position={[lat, lng]} icon={icon} eventHandlers={{ click: () => handleMarkerClick(req) }}>
              <Popup>
                <div className="min-w-[200px]">
                  <h4 className="font-bold text-primary">{req.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{req.category}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      req.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                      req.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>{req.urgency}</span>
                  </div>
                  <button 
                    onClick={() => handleMarkerClick(req)}
                    className="mt-2 w-full bg-primary text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Location button */}
      {showControls && userLocation && (
        <button
          onClick={() => navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude])
          )}
          className="absolute bottom-4 left-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition z-[1000]"
          title="موقعي الحالي"
        >
          📍
        </button>
      )}
    </div>
  );
}