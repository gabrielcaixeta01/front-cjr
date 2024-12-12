"use client";
import {useEffect, useState} from "react"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAllProfs } from "@/app/page";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { profile } from "console";

export default function Avaliacao() {
  const [texto, setTexto] = useState("");
  const [textoComment, setTextoComment]= useState("");

  
  
  
  


  return ( 
  <>
    <div className="flex flex-col h-screen bg-gray-100 justify-center">
        <div className="h-screen  w-1/2 max-h-[47%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
            <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
              <input type="text" value={texto} onChange={(event)=> setTexto(event.target.value)} className=" text-black h-16 w-full pt-[0.5px] pl-[1rem] rounded-md bg-[#A4FED3] leading-tight focus:outline-none"/> 
            </div>
            <div className="ml-auto items-right pr-5 mt-6">
              <button onClick={()=> setTexto("")}
                className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
                >
                Cancelar
            </button>
            <button   onClick={() => texto == ""? toast.error("O comentário não pode ser vazio") : 
        
            (setTextoComment(texto), setTexto(""), 
            
            toast.success("O comentário foi criado com sucesso", {autoClose:2200}))}
                className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
                >
                Comentar
            </button>
            </div>
        </div>
    </div>
  </>
  
)
}
