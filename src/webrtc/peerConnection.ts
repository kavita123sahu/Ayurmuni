import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";

// ✅ Cast as any to bypass broken typings
export const peerConnection: any = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});

// Signaling ke time use hoga
export { RTCIceCandidate, RTCSessionDescription };
