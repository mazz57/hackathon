import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface Marker {
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
}

interface LeafletMapProps {
  markers?: Marker[];
  polyline?: { latitude: number; longitude: number }[];
  polylineColor?: string;
  center?: { latitude: number; longitude: number };
  zoom?: number;
  showUserLocation?: boolean;
  onMapReady?: () => void;
}

export default function LeafletMap({
  markers = [],
  polyline = [],
  polylineColor = "#4A90E2",
  center = { latitude: 37.78825, longitude: -122.4324 },
  zoom = 13,
  showUserLocation = true,
}: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    // Update markers when they change
    if (webViewRef.current && markers.length > 0) {
      const markersJS = JSON.stringify(markers);
      webViewRef.current.injectJavaScript(`
        updateMarkers(${markersJS});
        true;
      `);
    }
  }, [markers]);

  useEffect(() => {
    // Update polyline when it changes
    if (webViewRef.current && polyline.length > 0) {
      const polylineJS = JSON.stringify(polyline);
      webViewRef.current.injectJavaScript(`
        updatePolyline(${polylineJS}, '${polylineColor}');
        true;
      `);
    }
  }, [polyline, polylineColor]);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${center.latitude}, ${center.longitude}], ${zoom});
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    var markersLayer = L.layerGroup().addTo(map);
    var polylineLayer = L.layerGroup().addTo(map);
    var userMarker = null;

    ${
      showUserLocation
        ? `
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        
        if (userMarker) {
          userMarker.setLatLng([lat, lng]);
        } else {
          userMarker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: '#4285F4',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);
        }
      });
    }
    `
        : ""
    }

    function updateMarkers(markers) {
      markersLayer.clearLayers();
      markers.forEach(function(marker) {
        var color = marker.color || 'blue';
        var m = L.marker([marker.latitude, marker.longitude], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + color + '.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        });
        if (marker.title) {
          m.bindPopup(marker.title);
        }
        m.addTo(markersLayer);
      });
      
      if (markers.length > 0) {
        var bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    function updatePolyline(coords, color) {
      polylineLayer.clearLayers();
      if (coords.length > 0) {
        var latlngs = coords.map(c => [c.latitude, c.longitude]);
        L.polyline(latlngs, { color: color, weight: 4 }).addTo(polylineLayer);
      }
    }

    // Initial markers and polyline
    updateMarkers(${JSON.stringify(markers)});
    updatePolyline(${JSON.stringify(polyline)}, '${polylineColor}');
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        geolocationEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
