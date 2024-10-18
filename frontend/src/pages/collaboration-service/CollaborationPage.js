// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./styles/Collaboration.css"; 

function CollaborationPage() {
    const [text, setText] = useState(''); // State to hold the text content
    const [socket, setSocket] = useState(null);

  // Fetch collaboration data from API when the component mounts
  useEffect(() => {
    // Connect to the WebSocket server when the component mounts
    const socket = new WebSocket('ws://localhost:8080');
    setSocket(socket);

    // Listen for messages from the server
    socket.addEventListener('message', (event) => {
        setText(event.data); // Update the text state with the received data
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
        socket.close();
    };
}, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleChange = (event) => {
    setText(event.target.value); 
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(event.target.value); 
    }
};

return (
    <div style={{ padding: '20px' }}>
        <h1>Collaborative Textbox</h1>
        <textarea
            value={text} 
            onChange={handleChange} 
            style={{ width: '100%', height: '200px', fontSize: '16px' }}
            placeholder="Type something..."
        />
    </div>
);
};

export default CollaborationPage;
