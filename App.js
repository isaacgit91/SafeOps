import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import MainMenu from "./components/MainMenu";
import UserSection from "./components/UserSection";
import IncidentSection from "./components/IncidentSection";
import OfficeMap from "./components/OfficeMap";

export default function App() {
  const [section, setSection] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MainMenu onSelect={setSection} />

        {section === "usuarios" && <UserSection />}
        {section === "incidencias" && <IncidentSection />}
        {section === "mapa" && <OfficeMap />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, flexGrow: 1, justifyContent: "center", alignItems: "center" },
});
