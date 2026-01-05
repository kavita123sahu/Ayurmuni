// import React, { useEffect, useState, useRef } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { RTCView, mediaDevices } from "react-native-webrtc";

// const VideoCall = ({ route, navigation }) => {
//   const { roomId, userId } = route.params; // yaha tum value bhejoge
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);

//   const pcRef = useRef(null); // PeerConnection



//   // 1️⃣ Camera/Mic Access
//   const startLocalStream = async () => {
//     const stream = await mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//     });
//     setLocalStream(stream);
//   };

//   // 2️⃣ WebRTC Setup
//   const initWebRTC = async () => {
//     pcRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     // apna stream add karo
//     localStream.getTracks().forEach(track => {
//       pcRef.current.addTrack(track, localStream);
//     });

//     // remote stream mile
//     pcRef.current.ontrack = (event) => {
//       setRemoteStream(event.streams[0]);
//     };
//   };

//   // 3️⃣ Start Call
//   const startCall = async () => {
//     await initWebRTC();
//     const offer = await pcRef.current.createOffer();
//     await pcRef.current.setLocalDescription(offer);

//     // 👉 tumhara socket or backend yaha lagega
//     // server.emit("offer", { roomId, offer });
//   };

//   // 4️⃣ End Call
//   const endCall = () => {
//     if (pcRef.current) pcRef.current.close();
//     if (localStream) localStream.getTracks().forEach(t => t.stop());
//     navigation.goBack();
//   };

//   // 5️⃣ Mute/Unmute
//   const toggleMute = () => {
//     localStream.getAudioTracks().forEach(t => (t.enabled = !isMuted));
//     setIsMuted(!isMuted);
//   };

//   // 6️⃣ Camera On/Off
//   const toggleCamera = () => {
//     localStream.getVideoTracks().forEach(t => (t.enabled = !isVideoEnabled));
//     setIsVideoEnabled(!isVideoEnabled);
//   };

//   // Auto Start
//   useEffect(() => {
//     startLocalStream();

//     console.log("VideoCall-------->", roomId, userId);

//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Room: {roomId}</Text>

//       {/* Remote Video */}
//       {remoteStream ? (
//         <RTCView
//           streamURL={remoteStream.toURL()}
//           style={styles.remoteVideo}
//           objectFit="cover"
//         />
//       ) : (
//         <Text style={styles.waiting}>Waiting for other user...</Text>
//       )}

//       {/* Local Video */}
//       {localStream && (
//         <RTCView
//           streamURL={localStream.toURL()}
//           style={styles.localVideo}
//           objectFit="cover"
//         />
//       )}

//       {/* Controls */}
//       <View style={styles.controls}>
//         <TouchableOpacity onPress={toggleMute} style={styles.btn}>
//           <Text>{isMuted ? "Unmute" : "Mute"}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={toggleCamera} style={styles.btn}>
//           <Text>{isVideoEnabled ? "Camera Off" : "Camera On"}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={endCall} style={[styles.btn, { backgroundColor: "red" }]}>
//           <Text style={{ color: "#fff" }}>End Call</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default VideoCall;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   header: { color: "#fff", fontSize: 20, padding: 10, textAlign: "center" },
//   waiting: { color: "#888", marginTop: 40, textAlign: "center" },
//   remoteVideo: { flex: 1 },
//   localVideo: {
//     width: 120,
//     height: 160,
//     position: "absolute",
//     top: 20,
//     right: 20,
//     backgroundColor: "#333",
//   },
//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     padding: 20,
//     backgroundColor: "#111",
//   },
//   btn: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//   },
// });




import React from 'react';
import { View } from 'react-native';
import ZegoUIKitPrebuiltCall, {
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

// const APP_ID = 123456789; // Zego AppID
// const APP_SIGN = 'YOUR_APP_SIGN';

const APP_ID = 712416091; // Replace with your actual aApp ID
const APP_SIGN = 'c6de6e9ebf00826ca6a1834aaf6db203e722d67f5976cb9ede3f023db73232e8'; // Replace with your actual App Sign


export default function VideoCallScreen({ route }) {
  const { userId, userName, roomId } = route.params;
  

  console.log("userdetailssss--->", userId, userName, roomId);
  

  return (
    <View style={{ flex: 1 }}>
      <ZegoUIKitPrebuiltCall
        appID={APP_ID}
        appSign={APP_SIGN}
        userID={userId}
        userName={userName}
        callID={roomId}
        config={{
          ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
          onCallEnd: () => console.log('Call Ended'),
        }}
      />
    </View>
  );
}
