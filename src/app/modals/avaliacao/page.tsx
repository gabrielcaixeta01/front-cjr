"use client";
import {useState} from "react"
export default function Avaliacao() {
  const [mostrarProfs, setMostrarProfs] = useState(false);
  return ( 
  <>
    <div className="flex flex-col h-screen bg-gray-100 justify-center">
        <div className="h-screen  w-1/2 max-h-[58%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
            <div className="flex bg-white h-[2rem] w-[90%] justify-between items-center hover:cursor-pointer rounded-md mt-6" onClick={()=>setMostrarProfs(!mostrarProfs)}> 
                <span className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2" /*onClick={()=>{lista.map(profs)}=>}*/> Nome do professor </span> 
            </div>
            <div className="flex bg-white h-[2rem] w-[90%] justify-between items-center hover:cursor-pointer rounded-md mt-4"> 
                <span className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2"> Disciplina </span> 
            </div>
            <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[1.5rem] rounded-md">
              <div className="border-b-[1.5px] border-b-[#2B895C] pt-[0.5px] pl-4 pb-1"> 
                <p> temporario </p>
              </div>
              <input type="text" className=" text-black h-16 w-full pt-[0.5px] pl-[1rem] rounded-md bg-[#A4FED3] leading-tight focus:outline-none"/> 
            </div>
            <div className="ml-auto items-right pr-5 mt-6">
              <button
                className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
                >
                Cancelar
            </button>
            <button
                className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
                >
                Avaliar
            </button>
            </div>
        </div>
    </div>
  </>
  
)
}
