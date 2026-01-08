import React from "react";
import { StyleSheet } from "react-native";
import { RTCView, MediaStream } from "react-native-webrtc";

type Props = {
  stream: MediaStream | null;
  small?: boolean;
};

const VideoView: React.FC<Props> = ({ stream, small }) => {
  if (!stream) return null;

  return (
    <RTCView
      streamURL={stream.toURL()}
      style={small ? styles.small : styles.full}
      objectFit="cover"
    />
  );
};

export default VideoView;

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: "black",
  },
  small: {
    width: 120,
    height: 160,
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "black",
  },
});
