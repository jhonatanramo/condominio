// src/services/userService.js
import api from "../api";

export async function crearUsuario(data) {
  try {
    const response = await api.post("/usuarios/", data);
    return response.data;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
}
