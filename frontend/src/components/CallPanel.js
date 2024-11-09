import React, { useState, useEffect, useRef } from "react";
import { collaborationSocket } from "../config/socket";



const CallPanel = ({ id }) => {
  const [isRecording, setIsRecording] = useState(false);
  const localVideoRef = useRef(null); // Reference for the local video element
  const remoteVideoRef = useRef(null); // Reference for the incoming video element
  const [peerConnection, setPeerConnection] = useState(null);

//   useEffect(() => {
//     const rtcConfig = {
//         iceServers: [
//           {
//             urls: 'stun:stun.1.google.com:19302'
//           },
//         ],
//       };
//     const pc = new RTCPeerConnection(rtcConfig);
//     setPeerConnection(pc);

//     // Handle ICE candidate events
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         console.log("New ICE candidate", event.candidate);
//         // Send ICE candidate to the remote peer (e.g., via WebSocket)
//       }
//     };

//     return () => {
//         if (pc) {
//           pc.close();
//         }
//       };
//     }, []);

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        // Set the local video stream to the local video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        // const offer = peerConnection.createOffer();
        // peerConnection.setLocalDescription(offer);

        // collaborationSocket.emit("videoStream", { id, stream });

        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", function () {
          const audioBlob = new Blob(audioChunks);
        // const audioBlob = new Blob(audioChunks, { type: 'video/webm' });

          const fileReader = new FileReader();
        //   fileReader.readAsDataURL(audioBlob);
        //   fileReader.onloadend = function () {
        //     const base64String = fileReader.result;
        //     collaborationSocket.emit("audioStream", { id, audioData: base64String });
        //   };
        
        const videoBlob = new Blob(audioChunks, { type: 'video/webm' });
          const fileReaderVideo = new FileReader();
          fileReader.readAsDataURL(videoBlob);
          fileReader.onloadend = function () {
            const base64String = fileReader.result;
            collaborationSocket.emit("videoStream", { id, audioData: base64String });
          };
        //   fileReader.readAsDataURL(videoBlob); 
            
          
        });

        mediaRecorder.start();
        setTimeout(function () {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error capturing audio.', error);
        setIsRecording(false);
      });
  };

  useEffect(() => {
    collaborationSocket.on('audioStream', (audioData) => {
      const newData = audioData.split(";");
      newData[0] = "data:audio/ogg;";
      const audioSrc = newData[0] + newData[1];

      const audio = new Audio(audioSrc);
      if (!audio || document.hidden) {
        return;
      }
      audio.play();
    });

    // collaborationSocket.on('videoStream', (videoData) => {
    //   // Assuming videoData is a MediaStream object or a URL to the video stream
    //   if (remoteVideoRef.current) {
    //     remoteVideoRef.current.srcObject = videoData; // Set the incoming video stream
    //   }
    // });
    collaborationSocket.on('videoStream', (base64String) => {
        const videoElement = remoteVideoRef.current;
        videoElement.src = base64String;
        videoElement.play();
      });

    return () => {
      collaborationSocket.off('audioStream');
      collaborationSocket.off('videoStream');
    };
  }, [id]);

  return (
    <div>
      <p>Call Panel</p>
      <p>Connected to ID: {id}</p>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Recording..." : "Start Recording"}
      </button>
      <div>
        <h3>Your Video</h3>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: 'auto', border: '1px solid black' }}
        />
      </div>
      <div>
        <h3>Incoming Video</h3>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: 'auto', border: '1px solid black' }}
        />
      </div>
    </div>
  );
}

export default CallPanel;