import axios from "axios";
import { Avaliacao, User } from "@/types";
import { Comment } from "@/types";

const api = axios.create({
  /*baseURL: process.env.NEXT_PUBLIC_API_URL,*/
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const getAval = async (idAval: number) => {
  const response = await api.get("/avaliacao/", {
    params: {
      id: idAval,
    },
  });
  return response.data;
};

export const getAllAval = async () => {
  const response = await api.get("/avaliacao");
  return response.data;
};

export const getAllProfs = async () => {
  const response = await api.get("/professors");
  return response.data;
};

export const createUser = async (user: Partial<User>) => {
  const response= await api.post("/user",{
  name: user.name,
  email: user.email,
  password: user.password,
  departmentId: user.department?.id,
  programId: user.program?.id,
  profilepic: user.profilepic,
  })
  return response.data;
}


export const getAllDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
}

export const getAllPrograms = async () => {
  const response = await api.get("/programs");
  return response.data;
}


export const createComment = async (comment: Partial<Comment>) => {
  const response = await api.post("/comment", {
    text: comment.text,
    userId: comment.userId,
    avaliacaoId: comment.avaliacaoId,
  });
  return response.data;
};

export const createAval = async (aval: Partial<Avaliacao>) => {
  const response = await api.post("/avaliacao", {
    text: aval.text,
    userId: aval.userId,
    professorId: aval.professorId,
    courseId: aval.courseId,
    nota: 5,
  });
  return response.data;
};

export const getUserDetails = async (userId: number) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};