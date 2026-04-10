import { useSocket as useSocketContext } from '../context/SocketContext';

export { useSocketContext as useSocket };

// Hook for room-based communication
export function useRoom(roomId) {
  const socket = useSocketContext();
  
  const join = () => socket.joinRoom(roomId);
  const leave = () => socket.leaveRoom(roomId);
  const send = (message) => socket.sendMessage(roomId, message);
  
  return { join, leave, send, ...socket };
}