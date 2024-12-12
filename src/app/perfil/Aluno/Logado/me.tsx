import { api } from "@/utils/page";

export const fetchUserMe = async () => {
  try {
    const response = await api.get("/users/me"); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário logado:", error);
    throw error;
  }
};