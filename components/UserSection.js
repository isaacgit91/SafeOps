import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { getUsers, addUser, deleteUser, getIncidents } from "../services/supabaseApi";

export default function UserSection() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [incidencias, setIncidencias] = useState([]);

    // Función flecha asincrónica (equivalente a function loadUsers() {}).
    // Se usa async porque solo dentro de funciones asincrónicas se puede usar await, que espera a que getUsers() y getIncidents() devuelvan datos.
    // Sin await, el código continuaría ejecutándose y setUsuarios/setIncidencias recibirían promesas en lugar de los datos reales, causando errores.
  const loadUsers = async () => {
    const users = await getUsers();  // Llama a la API para obtener los usuarios y espera la respuesta
    setUsuarios(Array.isArray(users) ? users : []);  // Si es un array lo guarda en estado, si no guarda array vacío
    const incidents = await getIncidents();  // Llama a la API para obtener las incidencias y espera la respuesta
    setIncidencias(Array.isArray(incidents) ? incidents : []);  // Si es un array lo guarda en estado, si no guarda array vacío
  };

  useEffect(() => { loadUsers(); }, []);  // Hook que carga los datos al montar el componente

  const handleAddUser = async () => {  // Función para agregar un usuario
    if (!nombre || !apellido) return Alert.alert("Rellena todos los campos");  // Valida inputs
    const newUser = await addUser({ nombre, apellido });  // Llama a la API para agregar usuario
    if (newUser) loadUsers();  // Recarga usuarios si se creó correctamente
    setNombre(""); setApellido("");  // Limpia inputs
  };

  const handleDelete = (id) => {  // Función para eliminar un usuario
    Alert.alert("Confirmar", "¿Eliminar usuario?", [
      { text: "Cancelar" },
      { text: "Eliminar", onPress: async () => { await deleteUser(id); loadUsers(); } }  // Elimina y recarga usuarios
    ]);
  };

  return (
    <View>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth:1, margin:5, padding:5 }}
      />
      <TextInput
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        style={{ borderWidth:1, margin:5, padding:5 }}
      />
      <Button title="Agregar Usuario" onPress={handleAddUser} />
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Lista usuarios</Text>
      {usuarios.length === 0 ? (
        <Text>No hay usuarios</Text>
      ) : (
        usuarios.map(u => (
          <View key={u.id} style={{ marginVertical:5 }}>
            <Text>{u.nombre} {u.apellido}</Text>
            <Text>Incidencias: {incidencias.filter(i => i.usuario_id === u.id).length}</Text>
            <Button title="Eliminar" onPress={() => handleDelete(u.id)} />
          </View>
        ))
      )}
    </View>
  );
}
