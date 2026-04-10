import { io } from 'socket.io-client';

class SocketService {
  constructor() { this.socket = null; }
  connect(url, opts) {
    this.socket = io(url, { autoConnect: true, reconnection: true, reconnectionAttempts: 5, reconnectionDelay: 1000, withCredentials: true, ...opts });
    this.socket.on('connect', () => console.log('✅ Socket connected'));
    this.socket.on('disconnect', () => console.log('❌ Socket disconnected'));
    return this.socket;
  }
  emit(event, data, cb) { if (this.socket?.connected) this.socket.emit(event, data, cb); return !!this.socket?.connected; }
  on(event, cb) { if (this.socket) this.socket.on(event, cb); return () => this.socket?.off(event, cb); }
  off(event, cb) { this.socket?.off(event, cb); }
  disconnect() { this.socket?.disconnect(); this.socket = null; }
  isConnected() { return this.socket?.connected || false; }
  getSocket() { return this.socket; }
}

export const socketService = new SocketService();
export default socketService;