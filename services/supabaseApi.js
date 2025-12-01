const API_URL = "https://kocslivaclflmnenllfp.supabase.co/rest/v1";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvY3NsaXZhY2xmbG1uZW5sbGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDA0MDgsImV4cCI6MjA3OTkxNjQwOH0.pz_y9j2vJzJLqyp-gpHP99w7_-ql9PBJkw4_Xhd1Kig";

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/usuario`, {
      headers: { apiKey: API_KEY, Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) throw new Error("Error al obtener usuarios: " + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Agregar un usuario
export const addUser = async ({ nombre, apellido }) => {
  try {
    const res = await fetch(`${API_URL}/usuario`, {
      method: "POST",
      headers: { apiKey: API_KEY, Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ nombre, apellido }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("Error al agregar usuario: " + text);
    }
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Eliminar usuario por id
export const deleteUser = async (id) => {
  try {
    const res = await fetch(`${API_URL}/usuario?id=eq.${id}`, {
      method: "DELETE",
      headers: { apiKey: API_KEY, Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("Error al eliminar usuario: " + text);
    }
  } catch (error) {
    console.error(error);
  }
};

// Obtener todos los incidentes junto al usuario relacionado
export const getIncidents = async () => {
  try {
    const res = await fetch(`${API_URL}/incidencias?select=*,usuario(*)`, {
      headers: { apiKey: API_KEY, Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) throw new Error("Error al obtener incidentes: " + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Agregar un incidente
export const addIncident = async ({ descripcion, usuario_id }) => {
  try {
    const res = await fetch(`${API_URL}/incidencias`, {
      method: "POST",
      headers: { apiKey: API_KEY, Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ descripcion, usuario_id }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("Error al agregar incidencia: " + text);
    }
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Actualizar una incidencia
export const updateIncident = async (id, { descripcion }) => {
  try {
    const res = await fetch(`${API_URL}/incidencias?id=eq.${id}`, {
      method: "PATCH",
      headers: { apiKey: API_KEY, Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ descripcion }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("Error al actualizar incidencia: " + text);
    }
    const data = await res.json();
    return !!data[0];
  } catch (error) {
    console.error(error);
    return false;
  }
};
