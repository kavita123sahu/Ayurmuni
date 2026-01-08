import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { MediaStream } from "react-native-webrtc";

import VideoView from "../component/VideoView";
import CallControls from "../component/CallControls";
import { getLocalStream } from "../webrtc/mediaDevices";
import { peerConnection } from "../webrtc/peerConnection";

const CallScreen: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startCall();

    return () => {
      peerConnection.close();
    };
  }, []);

  const startCall = async () => {
    const stream = await getLocalStream();
    setLocalStream(stream);

    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // ✅ TS-safe way (FIX)
    peerConnection.addEventListener("track", (event: any) => {
      setRemoteStream(event.streams[0]);
    });
  };

  const endCall = () => {
    peerConnection.close();
  };

  return (
    <View style={styles.container}>
      <VideoView stream={remoteStream} />
      <VideoView stream={localStream} small />
      <CallControls onEndCall={endCall} />
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
