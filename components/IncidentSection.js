import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getUsers, getIncidents, addIncident, updateIncident } from "../services/supabaseApi";

export default function IncidentSection() {
  const [usuarios, setUsuarios] = useState([]); // Estado para la lista de usuarios
  const [incidentes, setIncidentes] = useState([]); // Estado para la lista de incidencias
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción de la incidencia
  const [selectedUser, setSelectedUser] = useState(""); // Estado para el usuario seleccionado
  const [photos, setPhotos] = useState({}); // Estado para guardar fotos asociadas a incidencias
  const [editingId, setEditingId] = useState(null); // Estado para identificar si se está editando una incidencia


// Función flecha asincrónica (equivalente a function loadUsers() {}).
// Se usa async porque solo dentro de funciones asincrónicas se puede usar await, que espera a que getUsers() y getIncidents() devuelvan datos.
// Sin await, el código continuaría ejecutándose y setUsuarios/setIncidencias recibirían promesas en lugar de los datos reales, causando errores.
  const loadData = async () => {
    const u = await getUsers(); // Espera la respuesta de la API para obtener usuarios
    const i = await getIncidents(); // Espera la respuesta de la API para obtener incidencias
    setUsuarios(Array.isArray(u) ? u : []); // Si la respuesta es un array, lo guarda; si no, guarda array vacío
    setIncidentes(Array.isArray(i) ? i : []); // Lo mismo para incidencias
  };

  // Hook que ejecuta loadData al montar el componente
  useEffect(() => { loadData(); }, []);

  // Función que agrega una nueva incidencia
  const handleAddIncident = async () => {
    if (!usuarios.length) return Alert.alert("No hay usuarios", "Crea un usuario primero"); // Valida que haya usuarios
    if (!selectedUser) return Alert.alert("Selecciona un usuario"); // Valida que se haya seleccionado un usuario
    if (!descripcion) return Alert.alert("Escribe una descripción"); // Valida que haya descripción

    const newIncident = await addIncident({ descripcion, usuario_id: selectedUser }); // Llama a la API para crear la incidencia
    if (!newIncident) return; // Si no se creó, detiene la función

    setDescripcion(""); // Limpia campo de descripción
    setSelectedUser(""); // Limpia selección de usuario
    loadData(); // Recarga lista de incidencias

    // Pregunta si se quiere añadir evidencia fotográfica
    Alert.alert(
      "Añadir evidencia fotográfica",
      "¿Quieres añadir una foto a esta incidencia?",
      [
        { text: "No" },
        { text: "Sí", onPress: () => choosePhotoOption(newIncident.id) } // Llama a la función para elegir foto
      ]
    );
  };

  // Función que muestra opciones de fuente de imagen
  const choosePhotoOption = (incidentId) => {
    Alert.alert(
      "Seleccionar fuente",
      "Elige de dónde quieres la foto",
      [
        { text: "Cámara", onPress: () => pickImage("camera", incidentId) }, // Abrir cámara
        { text: "Galería", onPress: () => pickImage("gallery", incidentId) }, // Abrir galería
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  // Función para seleccionar imagen desde cámara o galería
  const pickImage = async (source, incidentId) => {
    let result;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync(); // Solicita permiso de cámara
      if (status !== "granted") return Alert.alert("Permiso denegado", "No se puede acceder a la cámara"); // Valida permiso
      result = await ImagePicker.launchCameraAsync({ quality: 0.5 }); // Lanza cámara
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Solicita permiso galería
      if (status !== "granted") return Alert.alert("Permiso denegado", "No se puede acceder a la galería"); // Valida permiso
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 }); // Abre galería
    }

    if (!result.canceled) { // Si se seleccionó imagen
      const uri = result.assets[0].uri; // Obtiene la URI de la imagen
      setPhotos(prev => ({ ...prev, [incidentId]: [...(prev[incidentId] || []), uri] })); // Guarda la foto en el estado
    }
  };

  // Función que inicia la edición de una incidencia
  const handleStartEdit = (incidencia) => {
    setEditingId(incidencia.id); // Guarda el ID de la incidencia que se editará
    setDescripcion(incidencia.descripcion); // Muestra la descripción actual
  };

  // Función que actualiza la incidencia editada
  const handleUpdateIncident = async () => {
    if (!descripcion) return Alert.alert("Escribe una descripción"); // Valida que haya descripción
    const success = await updateIncident(editingId, { descripcion }); // Llama a la API para actualizar
    if (success) {
      setEditingId(null); // Resetea edición
      setDescripcion(""); // Limpia input
      loadData(); // Recarga lista de incidencias
    } else {
      Alert.alert("Error", "No se pudo actualizar la incidencia"); // Alerta si falla
    }
  };

  return (
    <ScrollView style={{ width: "100%", padding: 10 }}>
      <Text style={styles.header}>{editingId ? "Actualizar incidencia:" : "Agregar incidencia:"}</Text>

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />

      {!editingId && (
        <Picker
          selectedValue={selectedUser}
          onValueChange={setSelectedUser}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona usuario" value="" />
          {usuarios.map(u => (
            <Picker.Item key={u.id} label={`${u.nombre} ${u.apellido}`} value={u.id} />
          ))}
        </Picker>
      )}

      <Button
        title={editingId ? "Actualizar incidencia" : "Agregar incidencia"}
        onPress={editingId ? handleUpdateIncident : handleAddIncident}
      />

      <Text style={[styles.header, { marginTop: 20 }]}>Incidencias existentes:</Text>
      {incidentes.length === 0 ? (
        <Text>No hay incidencias</Text>
      ) : (
        incidentes.map(i => (
          <View key={i.id} style={styles.incidentCard}>
            <Text>{i.descripcion} (Usuario: {i.usuario?.nombre || "?"} {i.usuario?.apellido || "?"})</Text>
            <ScrollView horizontal>
              {(photos[i.id] || []).map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.photo} />
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.updateButton} onPress={() => handleStartEdit(i)}>
              <Text style={{ color: "#fff", textAlign: "center" }}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, marginVertical: 5, padding: 5, borderRadius: 5 },
  picker: { marginVertical: 5, borderWidth: 1, borderRadius: 5 },
  incidentCard: { marginVertical: 10, borderBottomWidth: 1, paddingBottom: 5 },
  photo: { width: 50, height: 50, marginRight: 5, borderWidth: 1 },
  updateButton: { backgroundColor: "#007bff", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, width: 100, marginTop: 5 }
});
