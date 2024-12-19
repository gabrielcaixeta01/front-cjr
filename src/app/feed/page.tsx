"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchUserInfo, createAval } from "@/utils/api";
import { User, Professor, Avaliacao, Course } from "@/types";
import { jwtDecode } from "jwt-decode";
import HeaderDeslogado from "@/components/headers/deslogado/page";
import HeaderLogado from "@/components/headers/logado/page";

export default function FeedLogado() {
  const router = useRouter();
  const { userid } = useParams();
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [profSelected, setProfSelected] = useState("-1");
  const [courseSelected, setCourseSelected] = useState("-1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // Função para alternar o pop-up
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Verifica autenticação e carrega informações do usuário
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { sub: number } = jwtDecode(token);
          setIsAuth(true);
          const userData = await fetchUserInfo(decoded.sub);
          setUserInfo(userData);
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          setIsAuth(false);
          toast.error("Sessão expirada. Faça login novamente.");
          router.push("/auth/login");
        }
      } else {
        setIsAuth(false);
        router.push("/auth/login");
      }
    };

    verifyAccess();
  }, [router]);

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

  // Função para criar avaliação
  const creatingAval = async (aval: Partial<Avaliacao>) => {
    try {
      if (!aval.text || aval.professorId === -1 || aval.courseId === -1) {
        toast.error("Preencha todos os campos!");
        return;
      }
  
      const result = await createAval(aval);
      toast.success("Avaliação criada com sucesso!");
      // Atualiza estado ou executa outra lógica
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      toast.error("Erro ao criar avaliação.");
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const resetModalFields = () => {
    setTexto("");
    setProfSelected("-1");
    setCourseSelected("-1");
  };

  // Modal de avaliação
  const modalAvaliacao = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="h-screen text-black w-[60%] max-h-[62%] flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
        <select
          value={profSelected}
          className="bg-white h-[2rem] w-[90%] pl-[0.325rem] mt-5 rounded-md"
          onChange={(event) => {
            setProfSelected(event.target.value);
          }}
        >
          <option value="-1" disabled>Nome do professor</option>
          {professores.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.name}
            </option>
          ))}
        </select>

        <select
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

        <textarea
          value={texto}
          placeholder="Digite sua avaliação"
          onChange={(event) => setTexto(event.target.value)}
          className="bg-[#A4FED3] w-[90%] h-[12rem] mt-5 rounded-md p-2 resize-none"
        />

        <div className="mt-6 flex justify-end w-[90%]">
          <button
            onClick={() => { resetModalFields(); toggleModal(); }}
            className="bg-transparent text-xl mr-4"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (texto === "" || profSelected === "-1" || courseSelected === "-1") {
                toast.error("Preencha todos os campos!");
              } else {
                creatingAval({
                  text: texto,
                  professorId: parseInt(profSelected, 10),
                  courseId: parseInt(courseSelected, 10),
                  userId: Number(userid),
                });
                resetModalFields();
                toggleModal();
              }
            }}
            className="bg-[#A4FED3] text-[#2B895C] px-4 py-2 rounded-lg"
          >
            Avaliar
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAuth) {
    return <div className="text-center mt-20">Verificando autenticação...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      {isAuth && userInfo && (
        <HeaderLogado {...(userInfo as User)} />
      )}
      {!isAuth && (
        <HeaderDeslogado />
      )}

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
            {isModalOpen && isAuth && 
              modalAvaliacao()
            }                              
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