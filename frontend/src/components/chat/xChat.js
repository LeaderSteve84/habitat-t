import { useEffect, useState } from 'react';
import { socket } from './socket';
import { ConnectionState } from './chatComponents/ConnectionState';
import { ConnectionManager } from './chatComponents/ConnectionManager';
import { MyForm } from './chatComponents/MyForm';
import { Events } from './chatComponents/Events';

function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function handleEvent(event, value) {
      console.log(`event recieved: ${event}`, value);
      setFooEvents(prev => [...prev, `${event}: ${value}`]);
    }

    function onError(error) {
      console.error('Socket error:', error);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.onAny(handleEvent);
    socket.on('connect_error', onError);
    socket.on('error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.offAny(handleEvent);
      socket.off('connect_error', onError);
      socket.off('error', onError);
    };
  }, []);

  return (
    <>
      <div className="text-center">
        <ConnectionState isConnected={ isConnected } />
        <Events events={ fooEvents } />
        <ConnectionManager />
        <MyForm />
      </div>
    </>
  );
}

export default Chat;
