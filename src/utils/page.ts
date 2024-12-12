import { User } from '@/types';
import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:3000", // Ajuste conforme necessário
});

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};

export const getUser = async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
};

export const createUser = async (user: User): Promise<User> => {
    const response = await api.post<User>('/users', user);
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

export const fetchUserInfo = async (userId: number): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      const user = response.data;
  
      return {
        ...user,
        profilepic: user.profilepic || Buffer.from("/default-profile.png").toString(),
      };
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
      throw new Error("Erro ao buscar informações do usuário.");
    }
  };