"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchUserInfo, createAval, fetchProfessorInfo } from "@/utils/api";
import { User, Professor, Avaliacao, Course } from "@/types";
import { jwtDecode } from "jwt-decode";
import HeaderDeslogado from "@/components/headers/deslogado/page";
import HeaderLogado from "@/components/headers/logado/page";
import telaCarregamento from "@/components/telas_carregamento/feed/tela_carregamento_feed"

export default function FeedLogado() {
  const router = useRouter();
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [texto, setTexto] = useState("");
  const [idProfSelected, setIdProfSelected] = useState("-1");
  const [courseSelected, setCourseSelected] = useState("-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [profSelected, setProfSelected] = useState<Professor|null> (null);

  // Função para alternar o pop-up
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Verifica autenticação e carrega informações do usuário
  useEffect(() => {
    const verifyAccess = async () => {
      setIsLoading(true); // Define como carregando
      const token = localStorage.getItem("authToken");
  
      if (token) {
        try {
          const decoded: { sub: number } = jwtDecode(token);
          const userData = await fetchUserInfo(decoded.sub);
          setUserInfo(userData);
          setIsAuth(true);
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          setIsAuth(false);
          toast.error("Sessão expirada. Faça login novamente.");
        }
      } else {
        setIsAuth(false); // Usuário deslogado
      }
      setIsLoading(false); // Carregamento concluído
    };
  
    verifyAccess();
  }, []);

  // Busca professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/professors");
        setProfessores(response.data as Professor[]);
        setFilteredProfessores(response.data as Professor[]);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
        toast.error("Erro ao buscar professores.");
      }
    };

    fetchProfessores();
  }, []);

  // Busca cursos
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/courses");
        setCourses(response.data as Course[]);
      } catch (error) {
        console.error("Erro ao buscar disciplinas.", error);
        toast.error("Erro ao buscar disciplinas.");
      }
    };

    fetchCourses();
  }, []);

  // Função de busca de professores
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setFilteredProfessores(
      query
        ? professores.filter((prof) => prof.name.toLowerCase().includes(query))
        : professores
    );
  };

  // Função de ordenação
  const handleSort = (criteria: "name" | "department" | "recent" | "oldest") => {
    const sortedProfessores = [...filteredProfessores];
    switch (criteria) {
      case "name":
        sortedProfessores.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "department":
        sortedProfessores.sort((a, b) =>
          (a.department?.name ?? "").localeCompare(b.department?.name ?? "")
        );
        break;
      case "recent":
        sortedProfessores.sort(
          (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        break;
      case "oldest":
        sortedProfessores.sort(
          (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        );
        break;
    }
    setFilteredProfessores(sortedProfessores);
    setIsPopupOpen(false);
  };

  const findProfSelected = async (id : number) => {
    try {
      if (id>0){
      const profFound = await fetchProfessorInfo(id);
      setProfSelected(profFound);
      }
    }
    catch (error){
      toast.error ("Erro ao procurar professor");
    }
  }

  // Função para criar avaliação
  const creatingAval = async (aval: Partial<Avaliacao>) => {
    try {
      if (!aval.text || aval.professorId === -1 || aval.courseId === -1) {
        toast.error("Preencha todos os campos!");
        return;
      }
      await createAval(aval); 
      toast.success("Avaliação criada com sucesso!",{autoClose:2200}); 
      resetModalFields(); 
      setTimeout(() => {
        toggleModal();
      }, 500); 
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      toast.error("Erro ao criar avaliação. Por favor, tente novamente.");
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const resetModalFields = () => {
    setTexto("");
    setIdProfSelected("-1");
    setCourseSelected("-1");
  };

  


  // Modal de avaliação
  const modalAvaliacao = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="h-screen text-black w-[60%] max-h-[60%] flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
        <select
          value={idProfSelected}
          className="bg-white h-[2rem] w-[90%] pl-[0.325rem] mt-5 rounded-md"
          onChange={(event) => {
            setIdProfSelected(event.target.value);
            findProfSelected(Number(event.target.value));
            setCourseSelected("-1");
          }}
        >
          <option value="-1" disabled>Nome do professor</option>
          {professores.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.name}
            </option>
          ))}
        </select>

        {Number(idProfSelected)>0 && profSelected && profSelected.courses?.length===0 && (
          <select> 
            <select
              disabled
              value={courseSelected}
              className="bg-white h-[2rem] w-[90%] pl-[0.325rem] mt-5 rounded-md"
              onChange={(event) => {
                setCourseSelected(event.target.value);
              }}
           >
          <option value="-1" disabled>Disciplina</option>
        </select>
          </select>
        )}

      {Number(idProfSelected)>0 && profSelected && profSelected.courses && profSelected.courses?.length>0 && (
         <select
         value={courseSelected}
         className="bg-white h-[2rem] w-[90%] pl-[0.325rem] mt-5 rounded-md"
         onChange={(event) => {
           setCourseSelected(event.target.value);
         }}
       >
         <option value="-1" disabled>Disciplina</option>
         {profSelected.courses.map((course) => (
           <option key={course.id} value={course.id}>
             {course.name}
           </option>
         ))}
       </select>
        )}

        {Number(idProfSelected)<=0 && (
            <select
              disabled
              value={courseSelected}
              className="bg-white h-[2rem] w-[90%] pl-[0.325rem] mt-5 rounded-md"
              onChange={(event) => {
                setCourseSelected(event.target.value);
              }}
           >
          <option value="-1" disabled>Disciplina</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        )}

        <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
        <textarea
          value={texto}
          maxLength={500}
          placeholder="Digite sua avaliação"
          onChange={(event) => setTexto(event.target.value)}
          className="text-black h-full  shadow-sm placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"
        />
        </div>
        
        <div className="flex justify-between items-center w-[90%] mt-6">
          <span className="text-white text-base pl-1">
            {texto.length}/500
            </span>
          <div className="flex mr-6 items-center justify-center">
            <button
              onClick={() => { resetModalFields(); toggleModal(); }}
              className="bg-transparent text-white rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9 flex items-center justify-center"
            >
              Cancelar
            </button>
            <button
              className="bg-[#A4FED3] text-[#2B895C] ml-1 font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px] flex items-center justify-center"
              onClick={() => {
                if (!texto.trim() || idProfSelected === "-1" || courseSelected === "-1") {
                  toast.error("Preencha todos os campos!");
                } else {
                  creatingAval({
                    text: texto,
                    professorId: parseInt(idProfSelected, 10),
                    courseId: parseInt(courseSelected, 10),
                    userId: Number(userInfo?.id),
                  });
                }
              }}
            >
              Avaliar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return telaCarregamento;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      {isAuth && userInfo ? (
        <HeaderLogado {...(userInfo as User)} />
      ) : (
        <HeaderDeslogado />
      )}

      {isModalOpen && isAuth && modalAvaliacao()}
      
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

            <div className="flex  mx-auto w-[20%] max-w-[30%] max-h-[2%] mt-2 mb-2">
              <button
                className={`${
                  isAuth ? "bg-azulCjr text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } w-[11rem] h-[3.5rem] mx-auto rounded-lg shadow-md hover:shadow-lg transition duration-500`}
                onClick={() => {
                    toggleModal();
                }}
                disabled={!isAuth}
              >
                Criar nova avaliação
              </button>

            </div>
      
            {/* Grid de Professores */}
            <section className="p-4 grid w-[70%] min-h-fit mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProfessores.map((professor) => (
                <div
                  key={professor.id}
                  className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
                  onClick={() => router.push(`/user/professor/${professor.id}`)}
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