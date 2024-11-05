import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function CallStatus() {
  const [status, setStatus] = useState('Disconnected');
  console.log('Call Status:');
  useEffect(() => {
     // Using Communciation using PORT 5005
    const socket = io('http://localhost:5005', {withCredentials: true,});

    socket.on('callStatus', (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Call Status: {status}</div>;
}

export default CallStatus;
