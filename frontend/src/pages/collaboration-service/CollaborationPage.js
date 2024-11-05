import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ContentEditor from "../../components/ContentEditor";
import CodeEditor from "../../components/CodeEditor";
import "./styles/CollaborationPage.css";

import NavBar from "../../components/NavBar";
import QuestionPanel from "../../components/QuestionPanel";
import useSessionStorage from "../../hook/useSessionStorage";
import { collaborationSocket } from "../../config/socket";

const CollaborationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.data;
  const { id, questionData } = data;
  const [activeTab, setActiveTab] = useState("code");
  const [email,] = useSessionStorage("", "email");
  const [roomId,] = useSessionStorage("", "roomId");

  // for calling
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection());
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'pass' }
    ]
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (email === undefined) {
      navigate("/");
    } else if (roomId) {
      console.log(`email ${email}`);
      collaborationSocket.emit("reconnecting", { id: roomId, currentUser: id })
    }
   
    
    const pc = peerConnection || new RTCPeerConnection(configuration);

    setPeerConnection(pc);

    console.log(" HELP ", pc.connectionState);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        collaborationSocket.emit('signal', { signal: event.candidate });
      }
    };


    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
    
      switch (pc.connectionState) {
        case "connected":
          console.log("The WebRTC connection is successfully established!");
          // Trigger any post-connection actions here
          break;
        case "disconnected":
        case "failed":
          console.log("The WebRTC connection has failed or disconnected.");
          // Handle reconnection or error here
          break;
        case "closed":
          console.log("The WebRTC connection has been closed.");
          break;
        default:
          console.log("WebRTC connection state is:", pc.connectionState);
      }
    };
    
    

    pc.ontrack = (event) => {
      console.log("Track received:", event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const handleMedia = async () => {
      if (pc.signalingState !== "closed") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          stream.getTracks().forEach(track => pc.addTrack(track, stream));
          setStream(stream);
        } catch (error) {
          console.error('Error accessing media devices.', error);
        }
      }
    };

    handleMedia(); // Call to handle media when the component mounts or peerConnection changes

    const handleSignal = async (data) => {
      if (data.signal) {
        if (data.signal.candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.signal));
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        } else {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
            if (pc.remoteDescription.type === "offer") {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              collaborationSocket.emit("signal", { target: data.sender, signal: answer });
            }
          } catch (error) {
            console.error("Error handling remote description:", error);
          }
        }
      }
    };

    collaborationSocket.on("signal", handleSignal);

    return () => {
      pc.close();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;
      collaborationSocket.off("signal", handleSignal);
    };
  }, [email, navigate, roomId, collaborationSocket, peerConnection]);

  const callUser = () => {
    if (peerConnection) {
      peerConnection.createOffer()
        .then((offer) => {
          return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
          collaborationSocket.emit("signal", { signal: peerConnection.localDescription });
        })
        .catch((error) => {
          console.error("Error during call setup:", error);
        });
    } else {
      console.error("Peer connection is not initialized.");
    }
  };

  return (
    <div>
      <NavBar />
      <QuestionPanel questionData={questionData} />
      <h2>Video Call</h2>
      <button onClick={callUser}>Call User</button>
      <video ref={remoteVideoRef} autoPlay />
      <video ref={localVideoRef} autoPlay muted />
      <div id="tabs">
        <button onClick={() => handleTabChange("code")} autoFocus>Code</button>
        <button onClick={() => handleTabChange("content")}>Text</button>
      </div>
      <div id="tab-content">
        <div style={{ display: activeTab === "code" ? "block" : "none" }}>
          <CodeEditor id={id} />
        </div>
        <div style={{ display: activeTab === "content" ? "block" : "none" }}>
          <ContentEditor id={id} />
        </div>
      </div>
      
    </div>
  );
};

export default CollaborationPage;
