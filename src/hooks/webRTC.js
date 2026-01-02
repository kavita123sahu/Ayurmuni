import { useRef, useEffect, useState, useCallback } from "react";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import { io } from "socket.io-client";

const SOCKET_URL = "https://vcxtv1pq-5000.inc1.devtunnels.ms";

export const useWebRTC = (roomId, userId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localRef = useRef(null);

  // STUN SERVER
  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  /** 📌 Local Camera & Mic initialize */ 
  const setupLocalStream = async () => {
    const stream = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    localRef.current = stream;
  };

  /** 📌 Create PeerConnection */
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(rtcConfig);

    // Add tracks
    localRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localRef.current);
    });

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    peerRef.current = pc;
    return pc;
  };

  const createOffer = async () => {
    const pc = createPeerConnection();
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit("offer", { roomId, offer });
  };

  /** 📌 Handle Offer */
  const handleOffer = async (offer) => {
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit("answer", { roomId, answer });
  };

  const handleAnswer = async (answer) => {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = async (candidate) => {
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.log("ICE error:", e);
    }
  };

  /** 📌 SOCKET INITIALIZATION */
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    socketRef.current.emit("join-room", { roomId, userId });

    socketRef.current.on("room-joined", () => createOffer());
    socketRef.current.on("offer", (data) => handleOffer(data.offer));
    socketRef.current.on("answer", (data) => handleAnswer(data.answer));
    socketRef.current.on("ice-candidate", (data) => handleCandidate(data.candidate));

    setIsConnected(true);
    setupLocalStream();

    return () => {
      socketRef.current.disconnect();
      peerRef.current?.close();
    };
  }, []);

  return {
    localStream,
    remoteStream,
    isConnected,
  };
};
