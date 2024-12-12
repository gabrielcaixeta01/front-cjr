import axios from "axios";
import { Aval } from "../types/Aval";
const api = axios.create({
    baseURL: "http://localhost:4000",
    baseURL: "http://localhost:4000",
})
export const getAval = async (idAval:number)=> {
    const response = await api.get("/avaliacao/",{
        params: {
            id:idAval
        }
    })
    return response.data;
}

export const getAllAval = async ()=>{
    const response = await api.get("/avaliacao");
    return response.data;
}

export const getAllProfs = async () => {
    const response = await api.get("/professors");
    return response.data;
}

export const getAllCourses = async ()=> {
  const response = await api.get("/courses");
  return response.data;
}

export const createUser = async (formData: FormData) => {
  const response = await api.post("/user", formData, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
};