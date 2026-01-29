import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import io from "socket.io-client";
import haversine from "haversine";

const SOCKET_SERVER_URL = "http://YOUR_SERVER_IP:4000"; // replace with server IP

export default function OrderTrackingScreen({ route }) {
  // route.params.orderId could be passed
  const orderId = route?.params?.orderId || "order_123";
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverPath, setDriverPath] = useState([]); // history to draw polyline
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  // permission request for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "App needs access to your location for live order tracking.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      const hasPerm = await requestLocationPermission();
      if (!hasPerm) {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      // get current user location once
      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });
          // center map
          mapRef.current?.animateToRegion(
            { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
            1000
          );
        },
        (err) => {
          console.error(err);
          Alert.alert("Error", "Unable to get current location.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    })();

    // connect socket
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketRef.current.on("connect", () => {
      console.log("socket connected", socketRef.current.id);
      setSocketConnected(true);
      // subscribe to order
      socketRef.current.emit("subscribeOrder", orderId);
    });

    socketRef.current.on("driverLocation", (payload) => {
      if (!payload) return;
      const { lat, lng } = payload;
      const newLoc = { latitude: lat, longitude: lng };
      setDriverLocation(newLoc);
      setDriverPath((prev) => [...prev, newLoc]);
      // optionally center map to include both user and driver
      if (mapRef.current && userLocation) {
        // animate camera to fit both points
        const latitudes = [userLocation.latitude, lat];
        const longitudes = [userLocation.longitude, lng];
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);
        const midLat = (minLat + maxLat) / 2;
        const midLng = (minLng + maxLng) / 2;
        const latDelta = Math.max(0.005, Math.abs(maxLat - minLat) * 1.5);
        const lngDelta = Math.max(0.005, Math.abs(maxLng - minLng) * 1.5);
        mapRef.current.animateToRegion(
          { latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta },
          800
        );
      }
    });

    socketRef.current.on("disconnect", () => {
      setSocketConnected(false);
      console.log("socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
    
  }, [orderId, userLocation]);

  const computeDistanceAndETA = () => {
    if (!userLocation || !driverLocation) return null;
    const start = { latitude: driverLocation.latitude, longitude: driverLocation.longitude };
    const end = { latitude: userLocation.latitude, longitude: userLocation.longitude };
    const meters = haversine(start, end, { unit: "meter" });
    const distanceKm = (meters / 1000).toFixed(2);
    // rough ETA assuming driver speed ~30 km/h => 0.5 km/min
    const speedKmh = 30;
    const etaMin = Math.round((meters / 1000) / (speedKmh / 60));
    return { meters: Math.round(meters), distanceKm, etaMin };
  };

  const status = computeDistanceAndETA();

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={true}
      >
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title={"Driver"}
            description={"Live location"}
          />
        )}

        {driverPath.length > 1 && (
          <Polyline
            coordinates={driverPath}
            strokeWidth={4}
            lineJoin={"round"}
          />
        )}
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Socket: {socketConnected ? "Connected" : "Disconnected"}</Text>
        <Text style={styles.infoText}>Order ID: {orderId}</Text>
        {driverLocation ? (
          <>
            <Text style={styles.infoText}>Driver: {driverLocation.latitude.toFixed(5)}, {driverLocation.longitude.toFixed(5)}</Text>
            <Text style={styles.infoText}>Distance: {status ? `${status.distanceKm} km (${status.meters} m)` : "-"}</Text>
            <Text style={styles.infoText}>ETA: {status ? `${status.etaMin} min` : "-"}</Text>
          </>
        ) : (
          <Text style={styles.infoText}>Waiting for driver location...</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.centerBtn}
        onPress={() => {
          if (userLocation) mapRef.current?.animateToRegion({ ...userLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 500);
        }}
      >
        <Text style={{ color: "#fff" }}>Center to Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  infoBox: {
    position: "absolute",
    bottom: 20,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  centerBtn: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 8,
  },
});
