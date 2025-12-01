import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function OfficeMap() {
  const region = {
    latitude: 28.1107, // Latitud aproximada IES El Rincón
    longitude: -15.4316, // Longitud aproximada IES El Rincón
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 5 }}>IES El Rincón, Gran Canaria</Text>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="IES El Rincón" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: 250, marginVertical: 20 },
  map: { flex: 1 },
});
