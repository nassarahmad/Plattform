import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { socketService } from '../utils/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    const socket = socketService.connect(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
    const onConn = () => setIsConnected(true);
    const onDisconn = () => setIsConnected(false);
    socket.on('connect', onConn); socket.on('disconnect', onDisconn);
    socket.emit('auth', token, (res) => console.log('🔐 Auth:', res));
    return () => { socket.off('connect', onConn); socket.off('disconnect', onDisconn); socket.disconnect(); setIsConnected(false); };
  }, [isAuthenticated, token]);

  const joinRequestRoom = useCallback((id) => socketService.emit('request:join', id), []);
  const sendMessage = useCallback((reqId, content) => socketService.emit('message:send', { requestId: reqId, content }), []);
  const shareLocation = useCallback((reqId, lat, lng) => socketService.emit('location:share', { requestId: reqId, lat, lng }), []);

  return <SocketContext.Provider value={{ isConnected, socket: socketService.getSocket(), joinRequestRoom, sendMessage, shareLocation }}>{children}</SocketContext.Provider>;
}
export const useSocket = () => { const ctx = useContext(SocketContext); if (!ctx) throw new Error('useSocket inside Provider'); return ctx; };