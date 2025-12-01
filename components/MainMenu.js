import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";

export default function MainMenu({ onSelect }) {
  return (
    <ImageBackground source={require("../assets/fondo.jpeg")} style={styles.bg}>
      <Text style={styles.title}>SafeOps</Text>
      <View style={styles.box}>
        <Button title="Usuarios" onPress={() => onSelect("usuarios")} />
        <View style={{ height: 15 }} />
        <Button title="Incidencias" onPress={() => onSelect("incidencias")} />
        <View style={{ height: 15 }} />
        <Button title="Ver mapa oficina" onPress={() => onSelect("mapa")} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 20, color: "#fff" },
  box: { width: "80%", alignItems: "center" },
});