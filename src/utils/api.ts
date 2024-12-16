import axios from "axios";
import { User, Avaliacao, Comment, Professor } from "@/types";

// Configuração do Axios com a base URL correta
export const api = axios.create({
  baseURL: "http://localhost:4000", // Ajuste a porta para 4000
  withCredentials: true,
});

// ** Funções relacionadas a usuários **
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/user");
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/user/${id}`);
  return response.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const response = await api.post<User>("/user", user);
  return response.data;
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await api.patch<User>(`/user/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete<void>(`/user/${id}`);
};

export const fetchUserID = async (): Promise<number> => {
  try {
    const response = await api.get<{ id: number }>("/user/me");
    return response.data.id;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário logado:", error);
    throw new Error("Erro ao buscar o ID do usuário.");
  }
};

export const fetchUserInfo = async (userId: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw new Error("Erro ao buscar informações do usuário.");
  }
};

// ** Funções relacionadas a avaliações **
export const findAval = async (id: number) => {
  const response = await api.get(`/avaliacao/${id}`);
  return response.data;
};

export const getAllAval = async () => {
  const response = await api.get("/avaliacao");
  return response.data;
};

export const createAval = async (aval: Partial<Avaliacao>) => {
    const response = await api.post("/avaliacao", {
      text: aval.text,              // Texto da avaliação
      userId: aval.userId,          // ID do usuário
      professorId: aval.professorId,// ID do professor
      courseId: aval.courseId,      // ID do curso
    });
    return response.data;
};

export const updateAval = async (aval: Partial<Avaliacao>, id: number) => {
  const response = await api.patch(`/avaliacao/${id}`, {
    text: aval.text,
    isEdited: true,
  });
  return response.data;
};

export const deleteAval = async (id: number) => {
  const response = await api.delete(`/avaliacao/${id}`);
  return response.data;
};

// ** Funções relacionadas a comentários **
export const createComment = async (comment: Partial<Comment>) => {
  const response = await api.post("/comment", {
    text: comment.text,
    userId: comment.userId,
    avaliacaoId: comment.avaliacaoId,
  });
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await api.delete(`/comment/${id}`);
  return response.data;
};

export const updateComment = async (comment: Partial<Comment>, id: number) => {
  const response = await api.patch(`/comment/${id}`, {
    text: comment.text,
  });
  return response.data;
};

// ** Funções relacionadas a professores, cursos e departamentos **
export const getAllProfs = async () => {
  const response = await api.get("/professors");
  return response.data;
};

export const fetchProfessorInfo = async (professorId: number): Promise<Professor> => {
  try {
    const response = await api.get<Professor>(`/professors/${professorId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informações do professor:", error);
    throw new Error("Erro ao buscar informações do professor.");
  }
};

export const getAllCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getOneCourse = async (id: number) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const getAllDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const getAllPrograms = async () => {
  const response = await api.get("/programs");
  return response.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await api.get(`/user/email/${email}`);
  return response.data;
};