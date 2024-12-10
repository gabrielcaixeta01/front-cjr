import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
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