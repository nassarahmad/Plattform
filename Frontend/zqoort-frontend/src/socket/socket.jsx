



import { io } from 'socket.io-client';

let socket;
export const initSocket = (token) => {
  if (socket) socket.disconnect();
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
};

export const getSocket = () => socket;

export const socketEvents = {
  JOIN_REQUEST: 'join_request',
  SEND_MESSAGE: 'send_message',
  SHARE_LOCATION: 'share_location',
  NEW_MESSAGE: 'new_message',
  NEW_NOTIFICATION: 'new_notification',
};

export const socketActions = {
  joinRequest: (requestId) => socket?.emit(socketEvents.JOIN_REQUEST, requestId),
  sendMessage: (requestId, content) => socket?.emit(socketEvents.SEND_MESSAGE, { requestId, content }),
  shareLocation: (requestId, lat, lng) => socket?.emit(socketEvents.SHARE_LOCATION, { requestId, lat, lng }),
};