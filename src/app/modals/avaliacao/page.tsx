"use client";
import {useEffect, useState} from "react"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAllProfs } from "@/utils/api";
import { getAllCourses } from "@/utils/api";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Avaliacao } from "@/types";
import { createAval } from "@/utils/api";
import { create } from "domain";
import { Avaliacao } from "@prisma/client";

export default function ModalAvaliacao() {
  const [mostrarProfs, setMostrarProfs] = useState(false);
  const [mostrarDisciplinas, setMostrarDisciplinas] = useState(false);
  const [texto, setTexto] = useState("");
  const [textoAval, setTextoAval]= useState("");
  const [listaProfs, setListaProfs] = useState <any[]>([]);
  const [listaCourses, setListaCourses] = useState <any[]> ([]);
  const router = useRouter();
  const [idProfAvaliacao, setIdProfAvaliacao] = useState("-1");
  const [idCourseAvaliacao, setIdCourseAvaliacao] = useState("-1");
  const [profSelected, setProfSelected] = useState("-1");
  const [courseSelected, setCourseSelected] = useState("-1")
  const [avalCreated, setAvalCreated] = useState(null)
  
  const getProfs = async () => {
    try {
      const professores = await getAllProfs();
      setListaProfs (professores)
    } catch (error){
      console.log(error)
    }
  }
  useEffect (()=>{
    getProfs()
  },[])

  const getCourses = async()=> {
    try {
      const courses = await getAllCourses();
      setListaCourses(courses);
    } catch (error){
      console.log(error);
    }
  }
  useEffect(()=>{
    getCourses()
  },[])

  const creatingAval = async (aval:Partial<Avaliacao>) => {
    try {
      const created = await createAval(aval);
    }
    catch (error){
      console.log(error);
    }
  }

  return ( 
  <>
    <div className="flex flex-col h-screen bg-gray-100 justify-center">
        <div className="h-screen  w-[45%] max-h-[60%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">

          <select value= {profSelected} className="flex flex-col bg-white h-[2rem] w-[90%] justify-between items-left hover:cursor-pointer rounded-md text-[#999797] font-[300] text-[18px] mt-6 leading-[3rem]" onChange={(event)=> {setIdProfAvaliacao(event.target.value); setProfSelected(event.target.value)}}>
            <option value="-1"  className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2">
              Nome do professor
            </option>
            {listaProfs.map((prof) => (
              <option key={prof.id} value={prof.id} className="text-black text-[18px] leading-[29.05px] font-[200] ">
                {prof.name}
              </option>))}
          </select>
        
          <select value={courseSelected} className="flex flex-col bg-white h-[2rem] w-[90%] justify-between items-left hover:cursor-pointer rounded-md text-[#999797] font-[300] text-[18px]  mt-6 leading-[3rem]" onChange={(event)=> {setIdCourseAvaliacao(event.target.value); setCourseSelected(event.target.value)}}>
            <option value="-1"  disabled selected className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2">
              Disciplina
            </option>
            {listaCourses.map((course) => (
              <option key={course.id} value={course.id} className="text-black text-[18px] leading-[29.05px] font-[200]">
                {course.name}
              </option>))}           
          </select>

          <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[1.5rem] rounded-md">
              <input type="text" value={texto} onChange={(event)=> setTexto(event.target.value)} className=" text-black h-16 w-full pt-[0.5px] pl-[1rem] rounded-md bg-[#A4FED3] leading-tight focus:outline-none"/> 
          </div>

            <div className="ml-auto items-right pr-5 mt-6">
              <button onClick={()=> {setTexto("");
                setProfSelected("-1");
                setCourseSelected("-1");
                }}
                className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
                >
                Cancelar
              </button>

              <button     onClick={() => {
                  if (texto === "") {
                    toast.error("A avaliação não pode ser vazia");
                  } else if (parseInt(idProfAvaliacao, 10) === -1) {
                    toast.error("Selecione um professor");
                  } else if (parseInt(idCourseAvaliacao, 10) === -1) {
                    toast.error("Selecione uma disciplina");
                  } else {
                    const newAval: Partial<Avaliacao>={
                      text: texto,
                      professorId: parseInt(idProfAvaliacao, 10),
                      courseId: parseInt(idCourseAvaliacao,10),
                      userId:2
                    };
                    
                    creatingAval(newAval);
                    setTextoAval(texto);
                    setTexto("");
                    toast.success("A avaliação foi criada com sucesso", { autoClose: 2200 });
                    setIdCourseAvaliacao("-1");
                    setIdProfAvaliacao("-1");
                    setProfSelected("-1");
                    setCourseSelected("-1");
                  }
                }}
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
