import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSocket, socketActions, socketEvents } from '../../socket';
import { toast } from 'react-toastify';

export default function ChatWindow({ requestId, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (!user?.token || !requestId) return;
    
    const socket = getSocket() || socketActions.initSocket(user.token);
    socketRef.current = socket;
    
    socket.emit(socketEvents.JOIN_REQUEST, requestId);

    const handleNewMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
      scrollToBottom();
    };

    socket.on(socketEvents.NEW_MESSAGE, handleNewMessage);
    return () => socket.off(socketEvents.NEW_MESSAGE, handleNewMessage);
  }, [user, requestId]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !requestId) return;
    socketActions.sendMessage(requestId, newMessage.trim());
    setNewMessage('');
  };

  const shareLocation = () => {
    if (!navigator.geolocation || !requestId) {
      toast.error('لا يمكن الوصول للموقع');
      return;
    }
    setIsSharingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        socketActions.shareLocation(requestId, latitude, longitude);
        toast.success('📍 تم مشاركة موقعك');
        setIsSharingLocation(false);
      },
      () => {
        toast.error('فشل الحصول على الموقع');
        setIsSharingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="fixed bottom-0 left-4 w-96 h-[500px] bg-white rounded-t-xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-xl">
        <h3 className="font-bold">💬 المحادثة</h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender?._id === user?._id ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.sender?._id === user?._id 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white border rounded-bl-none shadow'
            }`}>
              {msg.type === 'location' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="text-sm">تم مشاركة موقع</span>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              <span className="text-xs opacity-70 block mt-1">
                {new Date(msg.createdAt).toLocaleTimeString('ar-EG')}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex gap-2">
        <button 
          onClick={shareLocation}
          disabled={isSharingLocation}
          className="p-2 text-primary hover:bg-blue-50 rounded disabled:opacity-50"
          title="مشاركة الموقع"
        >
          {isSharingLocation ? '⏳' : '📍'}
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="اكتب رسالة..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button 
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-primary text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}