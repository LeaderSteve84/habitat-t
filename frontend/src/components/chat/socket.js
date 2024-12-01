import { io } from 'socket.io-client';

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000/chat';

export const socket = io('http://localhost:5000/chat', {
  autoConnect: false
});
