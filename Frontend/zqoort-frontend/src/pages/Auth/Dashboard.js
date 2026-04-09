import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/map/MapView';
import ChatWindow from '../components/chat/ChatWindow';
import NotificationBell from '../components/notifications/NotificationBell';
import { requestAPI } from '../api/requests';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      urgency: formData.get('urgency'),
      location: [parseFloat(formData.get('lng')), parseFloat(formData.get('lat'))]
    };

    try {
      await requestAPI.create(data);
      toast.success('✅ تم إنشاء طلب المساعدة بنجاح');
      setShowCreateModal(false);
      // Refresh map data here if needed
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إنشاء الطلب');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">🗺️ ZQOORT</h1>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 hidden sm:block">
                مرحباً، {user.name}
              </span>
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            ➕ طلب مساعدة جديد
          </button>
          
          {user.role === 'helper' && (
            <button className="px-6 py-3 bg-success text-white rounded-xl font-medium hover:bg-green-700 transition">
              🔍 عرض طلباتي المقبولة
            </button>
          )}
        </div>

        {/* Map */}
        <MapView 
          onRequestSelect={(req) => { setSelectedRequest(req); setShowChat(true); }}
        />

        {/* Request Details Panel */}
        {selectedRequest && !showChat && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-primary">{selectedRequest.title}</h2>
                <p className="text-gray-700 mt-2">{selectedRequest.description}</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {selectedRequest.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedRequest.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                    selectedRequest.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedRequest.urgency}
                  </span>
                </div>
              </div>
              
              {user.role === 'helper' && selectedRequest.status === 'pending' && (
                <button 
                  onClick={async () => {
                    try {
                      await requestAPI.accept(selectedRequest._id);
                      toast.success('✅ تم قبول الطلب');
                      setSelectedRequest({ ...selectedRequest, status: 'accepted' });
                    } catch (err) {
                      toast.error(err.response?.data?.message);
                    }
                  }}
                  className="px-6 py-3 bg-success text-white rounded-xl font-medium hover:bg-green-700 transition"
                >
                  👍 قبول الطلب
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowChat(true)}
              className="mt-4 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 transition"
            >
              💬 فتح المحادثة
            </button>
          </div>
        )}
      </main>

      {/* Chat Window */}
      {showChat && selectedRequest && (
        <ChatWindow 
          requestId={selectedRequest._id} 
          onClose={() => setShowChat(false)} 
        />
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">➕ طلب مساعدة جديد</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان</label>
                <input name="title" required className="w-full px-4 py-2 border rounded-lg" placeholder="عنوان الطلب" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea name="description" required rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder="وصف تفصيلي للمساعدة المطلوبة" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">التصنيف</label>
                  <select name="category" required className="w-full px-4 py-2 border rounded-lg">
                    <option value="medical">🏥 طبي</option>
                    <option value="food">🍽️ غذائي</option>
                    <option value="transport">🚗 نقل</option>
                    <option value="evacuation">🚨 إخلاء</option>
                    <option value="other">📍 آخر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الأولوية</label>
                  <select name="urgency" className="w-full px-4 py-2 border rounded-lg">
                    <option value="low">منخفضة</option>
                    <option value="medium" selected>متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="critical">حرجة</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">📍 سيتم استخدام موقعك الحالي تلقائياً</p>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" name="lat" step="any" placeholder="خط العرض" className="px-3 py-2 border rounded" />
                  <input type="number" name="lng" step="any" placeholder="خط الطول" className="px-3 py-2 border rounded" />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                إنشاء الطلب
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}