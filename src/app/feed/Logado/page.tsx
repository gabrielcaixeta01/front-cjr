"use client";

"use client";
import 'react-toastify/dist/ReactToastify.css';
import { getAllProfs } from "@/utils/api";
import { getAllCourses } from "@/utils/api";
import { useParams } from 'next/navigation';
import { Avaliacao } from "@/types";
import { createAval } from "@/utils/api";
import { create } from "domain";
import { Avaliacao } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Professor } from "@/types";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

export default function FeedLogado() {
    const [mostrarProfs, setMostrarProfs] = useState(false);
    const [mostrarDisciplinas, setMostrarDisciplinas] = useState(false);
    const [texto, setTexto] = useState("");
    const [textoAval, setTextoAval]= useState("");
    const [listaProfs, setListaProfs] = useState <any[]>([]);
    const [listaCourses, setListaCourses] = useState <any[]> ([]);
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


  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [profilePic, setProfilePic] = useState("/default-profile.png");

  // Busca apenas o ID e a foto de perfil do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users/me"); // Substitua pela URL correta
        const userData = response.data as { profilepic?: string };
        setProfilePic(userData.profilepic || "/default-profile.png");
      } catch (error) {
        toast.error("Erro ao carregar informações do usuário.");
        console.error("Erro ao carregar informações do usuário:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const toggleModal= () => {
    setIsModalOpen(!isModalOpen);
  };

  // Função para buscar professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/professors"); // Substitua pela URL correta
        setProfessores(response.data as Professor[]);
        setFilteredProfessores(response.data as Professor[]);
      } catch (error) {
        toast.error("Erro ao buscar professores.");
        console.error("Erro ao buscar professores:", error);
      }
    };
    fetchProfessores();
  }, []);

  // Função de busca
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = event.target.value;
    if (query.trim() === "") {
      setFilteredProfessores(professores); // Reseta a lista se vazio
      return;
    }
    const filtered = professores.filter((professor) =>
      professor.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProfessores(filtered);
  };

  // Função de ordenação
  const handleSort = (criteria: "name" | "department" | "recent" | "oldest") => {
    const sortedProfessores = [...filteredProfessores];
    if (criteria === "name") {
      sortedProfessores.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "department") {
      sortedProfessores.sort((a, b) =>
        a.department.name.localeCompare(b.department.name)
      );
    } else if (criteria === "recent") {
      sortedProfessores.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (criteria === "oldest") {
      sortedProfessores.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    setFilteredProfessores(sortedProfessores);
    setIsPopupOpen(false);
  };




  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex justify-between bg-customGreen pb-1 items-center mb-5">
        <div className="flex bg-azulUnb pb-1">
          <div className="flex justify-between w-screen bg-white py-3 items-center">
            <Image
              src="/logounb.png"
              alt="Logo da UnB"
              width={80}
              height={80}
              className="w-20 h-10 cursor-pointer ml-5 shadow-md"
              onClick={() => router.push("/feed/Deslogado")}
            />
            <div className="flex items-center space-x-5 mr-10">
              <button
                className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
                onClick={() => toast.info("Sem notificações novas.")}
              >
                <BellIcon className="h-6 w-6 text-white" />
              </button>
              <Image
                src={profilePic}
                alt="Foto de perfil"
                width={48}
                height={48}
                className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
                onClick={() => router.push("/perfil/Aluno/Logado")}
              />
              <button
                className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                onClick={() => router.push("/feed/Deslogado")}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Buscar Professores */}
      <div className="flex items-center my-10 justify-center">
        <div className="flex items-center justify-center px-5 py-2 w-[40%] rounded-lg shadow-lg bg-customGreen">
          <div className="flex items-center bg-white p-2 rounded-[60px] w-full justify-center">
            <input
              type="text"
              placeholder="Nome do Professor"
              className="border-0 border-b-2 border-green-50 focus:outline-none focus:border-blue-400 transition duration-400 w-full text-black"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div>
          <button
            className="bg-azulCjr text-white px-6 py-4 ml-2 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition duration-500"
            onClick={togglePopup}
          >
            Ordenar
          </button>
        </div>
        
        {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-bold mb-4 text-azulCjr">Ordenar por:</h3>
            <ul className="space-y-2 text-azulCjr">
              <li>
                <button
                  onClick={() => handleSort("name")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Nome
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSort("department")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Departamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSort("recent")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Recentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSort("oldest")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Antigos
                </button>
              </li>
            </ul>
            <button
              className="w-full mt-4 bg-customGreen text-white px-4 py-2 rounded hover:bg-hoverGreen transition duration-300"
              onClick={togglePopup}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    
      </div>
      <div className="flex  mx-auto w-[20%] max-w-[30%] max-h-[2%]">
        <button
            className="bg-azulCjr text-white px-6 py-4 ml-2 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition duration-500"
            onClick={toggleModal}>
            Criar nova avaliação
        </button>
        
        {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ">
                    <div className="h-screen  w-[60%] max-h-[62%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
            
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
                            toggleModal();
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
                                toggleModal();
                              }
                            }}
                              className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-12 ml-2"
                              >
                              Avaliar
                          </button>
                        </div>
            
                    </div>
                </div>
              
              
            )
            }                        
                            
                          
        
      </div>

      {/* Grid de Professores */}
      <section className="p-4 mx-auto max-w-screen-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
          {filteredProfessores.map((professor) => (
            <div
              key={professor.id}
              className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg h-60 transform transition duration-300 hover:translate-y-[-5px] hover:shadow-xl"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-4">
                <Image
                  src={professor.profilepic || "/default-profile.png"}
                  alt={`Foto de ${professor.name}`} // Corrigida a interpolação de string
                  className="w-full h-full rounded-full object-cover"
                  width={80} // Adicione largura para Next.js Image
                  height={80} // Adicione altura para Next.js Image
                />
              </div>
              <h2 className="font-semibold text-lg text-center text-azulCjr">
                {professor.name}
              </h2>
              <h3 className="text-black text-sm text-center">
                {professor.department.name}
              </h3>
              <p className="text-gray-500 text-xs text-center truncate max-w-[12rem]">
                {professor.courses.map((course) => course.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}