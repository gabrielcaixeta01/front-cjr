import axios from "axios";
import { Aval } from "../types/Aval";
const api = axios.create({
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

export const postAval = async (aval: Partial<Aval>) => {
    const response = await api.post("/avaliacao",{
        text: aval.text,
        userId: aval.courseId,
        nota: aval.nota,
        isEdited: false,
        professorId: aval.professorId,
        courseId: aval.courseId
    });
    return response.data;
}