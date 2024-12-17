"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Importação corrigida
import { toast } from "react-toastify";
import { fetchUserInfo, createAval } from "@/utils/api";
import { User, Professor, Avaliacao } from "@/types";
import { BellIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";


export default function FeedLogado() {
  const router = useRouter();
  const { userid } = useParams();
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [listaProfs, setListaProfs] = useState<Professor[]>([]);
  const [listaCourses, setListaCourses] = useState<Course[]>([]);
  const [profSelected, setProfSelected] = useState("-1");
  const [courseSelected, setCourseSelected] = useState("-1");
  const [idProfAvaliacao, setIdProfAvaliacao] = useState("-1");
  const [idCourseAvaliacao, setIdCourseAvaliacao] = useState("-1");
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Carrega as informações do usuário
  useEffect(() => {
    if (!userid) return;
    const loadUserInfo = async () => {
      try {
        const userData = await fetchUserInfo(Number(userid));
        setUserInfo(userData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    loadUserInfo();
  }, [userid]);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Função para buscar professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/professors"); // URL corrigida
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
    const query = event.target.value.toLowerCase();
    setFilteredProfessores(
      query
        ? professores.filter((prof) =>
            prof.name.toLowerCase().includes(query)
          )
        : professores
    );
  };

  // Função de ordenação
  const handleSort = (criteria: "name" | "department" | "recent" | "oldest") => {
    const sortedProfessores = [...filteredProfessores];
    if (criteria === "name") {
      sortedProfessores.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "department") {
      sortedProfessores.sort((a, b) =>
        (a.department?.name ?? "").localeCompare(b.department?.name ?? "")
      );
    } else if (criteria === "recent") {
      sortedProfessores.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    } else if (criteria === "oldest") {
      sortedProfessores.sort(
        (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
      );
    }
    setFilteredProfessores(sortedProfessores);
    setIsPopupOpen(false);
  };

  //função para criar avaliação no banco de dados
  const creatingAval = async (aval: Partial<Avaliacao>) => {
    try {
      await createAval(aval); // Remova a variável 'created' se não for necessária
      console.log("Avaliação criada com sucesso.");
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
    }
  };

  //reseta campos do modal de avaliação quando é fechado
  const resetModalFields = () => {
    setTexto("");
    setProfSelected("-1");
    setCourseSelected("-1");
    setIdProfAvaliacao("-1");
    setIdCourseAvaliacao("-1");
  };

  const toggleModal= () => {
    setIsModalOpen(!isModalOpen);
  };

  //modal de avaliação usado na página
  const modalAvaliacao = () => {
    const modal = 
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ">
      <div className="h-screen  w-[60%] max-h-[62%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
        <select value= {profSelected} className="flex flex-col bg-white h-[2rem] w-[90%] justify-between items-left hover:cursor-pointer rounded-md text-[#999797] font-[300] text-[18px] mt-6 leading-[3rem] pt-1" onChange={(event)=> {setIdProfAvaliacao(event.target.value); setProfSelected(event.target.value)}}>
          <option value="-1"  disabled className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2">
            Nome do professor
          </option>
          {listaProfs.map((prof) => (
            <option key={prof.id} value={prof.id} className="text-black text-[18px] leading-[29.05px] font-[200] ">
              {prof.name}
            </option>))}
        </select>
    
        <select value={courseSelected} className="flex flex-col bg-white h-[2rem] w-[90%] justify-between items-left hover:cursor-pointer rounded-md text-[#999797] font-[300] text-[18px]  mt-6 leading-[3rem] pt-1" onChange={(event)=> {setIdCourseAvaliacao(event.target.value); setCourseSelected(event.target.value)}}>
          <option value="-1"  disabled  className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2">
            Disciplina
          </option>
          {listaCourses.map((course) => (
            <option key={course.id} value={course.id} className="text-black text-[18px] leading-[29.05px] font-[200]">
              {course.name}
            </option>))}           
        </select>

        <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[1.5rem] rounded-md">
          <textarea value={texto} placeholder= "Digite sua avaliação" onChange={(event)=> setTexto(event.target.value)} className=" text-black placeholder-black placeholder-opacity-50 mt-2 mr-[0.3px]h-full w-full pt-[0.5px] pl-[1rem] rounded-md bg-[#A4FED3] leading-tight focus:outline-none resize-none overflow-y-auto" > </textarea>
        </div>

        <div className="ml-auto items-right pr-5 mt-6">
          <button onClick={() => { resetModalFields(); toggleModal(); }}
            className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
            >
            Cancelar
          </button>
          <button className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
             onClick={() => {
            if (texto === "") {
              toast.error("A avaliação não pode ser vazia", {autoClose:2200});
            } else if (parseInt(idProfAvaliacao, 10) === -1) {
              toast.error("Selecione um professor", {autoClose:2200});
            } else if (parseInt(idCourseAvaliacao, 10) === -1) {
              toast.error("Selecione uma disciplina", {autoClose:2200});
            } else {
              const newAval: Partial<Avaliacao> = {
                text: texto,
                professorId: parseInt(idProfAvaliacao, 10),
                courseId: parseInt(idCourseAvaliacao, 10),
                userId: Number(userid),
              };
              creatingAval(newAval);
              resetModalFields();
              toast.success("A avaliação foi criada com sucesso", { autoClose: 2200 });
              toggleModal();
            }
          }}>
            Avaliar
          </button>
        </div>
      </div>
    </div>     
  return modal;       
  }


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
              onClick={() => router.push(`/feed/logado/${userid}`)}
            />
            <div className="flex items-center space-x-5 mr-10">
              <button
                className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
                onClick={() => toast.info("Sem notificações novas.")}
              >
                <BellIcon className="h-6 w-6 text-white" />
              </button>
              <Image
                src={userInfo?.profilepic || "/default-profile.png"}
                alt="Foto de perfil"
                width={48}
                height={48}
                className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
                onClick={() => router.push(`/user/aluno/${userid}`)}
              />
              <button
                className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                onClick={() => router.push("/feed/deslogado")}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Buscar Professores */}
            <div className="flex justify-center my-5 text-black">
            <input
                type="text"
                placeholder="Buscar professor"
                onChange={handleSearch}
                className="
                  p-3 
                  rounded-lg 
                  shadow 
                  w-1/2 
                  border-0 
                  border-b-2 
                  border-customGreen 
                  focus:outline-none 
                  focus:border-blue-500 
                  transition 
                  duration-300
                "
              />
              <button
                className="ml-3 px-4 py-2 shadow-md bg-azulCjr text-white rounded hover:bg-blue-600 transition duration-300"
                onClick={togglePopup}
              >
                Ordenar
              </button>
            </div>
      
            {/* Pop-up de Ordenação */}
            {isPopupOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[20%] flex flex-col text-azulCjr justify-center items-center">
                  <h3 className="font-semibold mb-4">Ordenar por:</h3>
                  <button onClick={() => handleSort("name")} className="block mb-2">
                    Nome
                  </button>
                  <button onClick={() => handleSort("department")} className="block mb-2">
                    Departamento
                  </button>
                  <button onClick={() => handleSort("recent")} className="block mb-2">
                    Mais Recentes
                  </button>
                  <button onClick={() => handleSort("oldest")} className="block mb-2">
                    Mais Antigos
                  </button>
                  <button onClick={togglePopup} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                    Fechar
                  </button>
                </div>
              </div>
            )}

          <div className="flex  mx-auto w-[20%] max-w-[30%] max-h-[2%]">
            <button
              className="bg-azulCjr text-white w-[11rem] h-[3.5rem] mx-auto rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition duration-500"
              onClick={toggleModal}>
              Criar nova avaliação
            </button>
            {isModalOpen && (
              modalAvaliacao()
            )}                              
          </div>
      
            {/* Grid de Professores */}
            <section className="p-4 grid w-[70%] min-h-fit mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProfessores.map((professor) => (
                <div
                  key={professor.id}
                  className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
                  onClick={() => router.push(`/user/aluno/${userid}/professor/${professor.id}`)}
                >
                  <Image
                    src={professor.profilepic || "/default-profile.png"}
                    alt={professor.name}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto"
                  />
                  <h3 className="text-center text-black font-semibold mt-2">{professor.name}</h3>
                  <p className="text-center text-gray-400 text-sm mb-3 w-full truncate overflow-hidden">
                    {professor.department?.name || "Departamento não informado"}
                  </p>
                  <p className=" text-center text-azulCjr text-xs w-full truncate overflow-hidden">
                    {professor.courses?.length
                      ? professor.courses.map((course) => course.name).join(", ")
                      : "Sem matérias informadas"}
                  </p>
                </div>
              ))}
            </section>
          </div>
        );
      }