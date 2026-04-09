import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../api/notifications';
import { getSocket, socketEvents } from '../../socket';
import { toast } from 'react-toastify';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const [notifsRes, countRes] = await Promise.all([
        notificationAPI.getAll(1, 10),
        notificationAPI.getUnreadCount()
      ]);
      setNotifications(notifsRes.data.notifications || []);
      setUnreadCount(countRes.data.count || 0);
    } catch (err) {
      console.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  // Socket: real-time notifications
  useEffect(() => {
    if (!user?.token) return;
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
      toast.info(notif.title, { icon: '🔔' });
    };

    socket.on(socketEvents.NEW_NOTIFICATION, handleNewNotification);
    return () => socket.off(socketEvents.NEW_NOTIFICATION, handleNewNotification);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('فشل تحديد كمقروء');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('✅ تم تحديد الكل كمقروء');
    } catch (err) {
      toast.error('فشل العملية');
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => { setOpen(!open); if (!open) loadNotifications(); }}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-danger text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50 max-h-96 overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center bg-gray-50">
            <h4 className="font-bold">🔔 الإشعارات</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">جارٍ التحميل...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif._id}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition ${
                    !notif.isRead ? 'bg-blue-50 border-r-4 border-primary' : ''
                  }`}
                >
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}