import axios from "axios";
import { User } from "@/types";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await api.post<User>("/users", user);
  return response.data;
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await api.put<User>(`/users/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete<void>(`/users/${id}`);
};

export const fetchUserID = async (): Promise<number> => {
  try {
    const response = await api.get<{ id: number }>("/users/me");
    return response.data.id;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário logado:", error);
    throw new Error("Erro ao buscar o ID do usuário.");
  }
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserInfo = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/${userId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar informações do usuário: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw new Error("Erro ao buscar informações do usuário.");
  }
};