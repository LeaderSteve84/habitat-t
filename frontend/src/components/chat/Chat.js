import { useState } from 'react';
import useChat from "./useChat";

const Chat = () => {

    const { messages, sendMessage } = useChat();

    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
      sendMessage(message);
      setMessage('');
    };

    return (
        <div>
            <div>
                <h3 className="text center">Chat</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
            <div className="d-flex justify-conter-inbetween item-align-center">
                <input
                    type="text"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button classname="btn btn-primary"onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
