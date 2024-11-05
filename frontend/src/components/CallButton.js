import React from 'react';
import axios from 'axios';

function CallButton({ recipientId }) {
    const startCall = async () => {
        try {
            // Using Communciation using PORT 5005
            console.log('Call about to start:');

            const response = await axios.post('http://localhost:5005/api/calls/startCall', { recipientId });
            console.log('Call started:', response.data);
            // alert("Call started successfully!"); // User feedback
        } catch (error) {
            console.error('Failed to start call:', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
            }
        }
    };

    return (
        <button onClick={() => { console.log('Button clicked'); startCall(); }}>
        Start Call
        </button>
    );
}

export default CallButton;
