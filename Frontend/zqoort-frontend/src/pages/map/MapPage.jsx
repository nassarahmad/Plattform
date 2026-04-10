import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Map, List } from 'lucide-react';
import Header from '../../components/layout/Header';
import MapComponent from '../../components/map/MapComponent';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { apiService } from '../../api/axios';
import { toLeafletCoords, toGeoJsonCoords, formatDistance } from '../../utils/geoHelpers';

export default function MapPage() {
  const { userRole } = useAuth();
  const { isConnected, joinRequestRoom, sendMessage, shareLocation } = useSocket();
  const { addNotification } = useApp();
  const [locations, setLocations] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('map');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(p => setUserPos([p.coords.latitude, p.coords.longitude]), () => setUserPos([31.9497, 35.9327]), { enableHighAccuracy: true });
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!userPos) return;
    setLoading(true);
    try {
      const res = await apiService.get('/requests/nearby', { params: { lat: userPos[0], lng: userPos[1], radius: 5000 } });
      if (res.success) setLocations(res.data.map(r => ({ ...r, position: toLeafletCoords(r.location.coordinates), distanceText: formatDistance(r.distance) })));
    } catch (e) { addNotification({ type: 'error', message: 'فشل جلب الطلبات' }); }
    finally { setLoading(false); }
  }, [userPos, addNotification]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleMapClick = ({ lat, lng }) => {
    if (userRole !== 'help_seeker' && userRole !== 'organization') return addNotification({ type: 'warning', message: 'غير مسموح بإنشاء طلبات' });
    (async () => {
      try {
        const res = await apiService.post('/requests', { title: 'طلب جديد', description: 'وصف الطلب', category: 'other', location: { type: 'Point', coordinates: toGeoJsonCoords([lat, lng]) } });
        if (res.success) { addNotification({ type: 'success', message: 'تم إنشاء الطلب' }); fetchRequests(); }
      } catch { addNotification({ type: 'error', message: 'فشل الإنشاء' }); }
    })();
  };

  const filtered = locations.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="px-4 py-3 bg-white border-b flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input placeholder="ابحث عن موقع..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12" /></div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setView('map')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view === 'map' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}><Map className="w-4 h-4 inline" /> خريطة</button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${view === 'list' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}><List className="w-4 h-4 inline" /> قائمة</button>
          </div>
          <Button size="sm" icon={Plus} onClick={() => addNotification({ type: 'info', message: 'انقر على الخريطة لإضافة طلب' })}>إضافة</Button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {view === 'map' ? <MapComponent locations={filtered} userLocation={userPos} onMapClick={handleMapClick} /> : (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? <p className="text-center py-12 text-gray-500">لا توجد نتائج</p> : filtered.map(l => <div key={l.id} className="card cursor-pointer"><h3 className="font-semibold">{l.title}</h3><p className="text-sm text-gray-600">{l.description}</p><span className="text-xs text-blue-600">{l.distanceText}</span></div>)}
          </div>
        )}
        {!isConnected && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm shadow"><span className="w-2 h-2 bg-yellow-500 rounded-full inline-block mr-2 animate-pulse" />جاري إعادة الاتصال...</div>}
      </div>
    </div>
  );
}