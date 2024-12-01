import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const useChat = () => {

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const newSocket = io("http://localhost:5000/chat");
      setSocket(newSocket);
      
      newSocket.on('sent_message', (resMessage) => {
        console.log('received message: ', resMessage);
        setMessages([ ...messages, resMessage]);
      });
      console.log('Array: ', messages);
      return () => newSocket.disconnect();
    }, [messages]);
        
    // function that handle send messages
    function sendMessage(message) {
      console.log('Sending:', message);
      socket.emit('receive_message', message);
    };

    return { messages, sendMessage };
};

export default useChat;
