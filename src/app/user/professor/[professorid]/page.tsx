"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Avaliacao, Professor, User } from "@/types";
import HeaderLogado from "@/components/headers/logado/page";
import HeaderDeslogado from "@/components/headers/deslogado/page";
import { jwtDecode } from "jwt-decode";
import {
  updateAval,
  deleteAval,
  createAval,
  fetchProfessorInfo,
} from "@/utils/api";
import telaCarregamento from "@/components/telas_carregamento/professor/tela_carregamento_professor";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function ProfessorPerfil() {
  const { professorid } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [professorInfo, setProfessorInfo] = useState<Professor | null>(null);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [isAuth, setIsAuth] = useState(false); // Identifica se o usuário está logado
  const [userInfo, setUserInfo] = useState<User | null>(null); // Dados do usuário logado
  const [textoEdit, setTextoEdit] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteAvalOpen, setIsToggleDeleteAvalOpen] = useState(false);
  const [idAvalEdited, setIdAvalEdited] = useState(0);
  const [idAvalDeleted, setIdAvalDeleted] = useState(0);
  const [texto, setTexto] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseSelected, setCourseSelected] = useState("-1");
  const [profSelected, setProfSelected] = useState<Professor | null>(null);

  // Verifica a autenticação e pega informações do usuário logado
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { sub: number } = jwtDecode(token);
          const userResponse = await axios.get(
            `http://localhost:4000/user/${decoded.sub}`
          );
          setUserInfo(userResponse.data as User);
          setIsAuth(true);
        } catch {
          setIsAuth(false);
        }
      }
    };

    verifyAccess();
  }, []);

  // Busca informações do professor
  useEffect(() => {
    const loadProfessor = async () => {
      try {
        if (!professorid) return;
        const response = await axios.get(
          `http://localhost:4000/professors/${professorid}`
        );
        setProfessorInfo(response.data as Professor);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadProfessor();
  }, [professorid]);

  const toggleModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  };

  const toggleDeleteAval = () => {
    setIsToggleDeleteAvalOpen(!isModalDeleteAvalOpen);
  };

  // Função para criar avaliação
  const creatingAval = async (aval: Partial<Avaliacao>) => {
    try {
      if (!aval.text || aval.professorId === -1 || aval.courseId === -1) {
        toast.error("Preencha todos os campos!");
        return;
      }
      await createAval(aval);
      toggleModal();
      toast.success("Avaliação criada com sucesso!", { autoClose: 900 });
      resetModalFields();
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch {
      toast.error("Erro ao criar avaliação. Por favor, tente novamente.");
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const resetModalFields = () => {
    setTexto("");
    setCourseSelected("-1");
  };

  const findProfSelected = async (id: number) => {
    try {
      if (id > 0) {
        const profFound = await fetchProfessorInfo(id);
        setProfSelected(profFound);
      }
    } catch {
      toast.error("Erro ao procurar professor");
    }
  };

  useEffect(()=> {
    if (professorInfo){
      findProfSelected(professorInfo?.id)
    }
  },[professorInfo])

  // Modal de avaliação
  const modalAvaliacao = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="h-screen text-black w-[60%] max-h-[53%] flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
        {Number(profSelected?.id) > 0 && profSelected && profSelected.courses && profSelected.courses?.length > 0 && (
            <select
              value={courseSelected}
              className="bg-white h-[2rem] w-[90%] pl-[0.325rem] mt-5 rounded-md"
              onChange={(event) => {
                setCourseSelected(event.target.value);
              }}
            >
              <option value="-1" disabled>
                Disciplina
              </option>
              {profSelected.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          )}

        <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[1.5rem] rounded-md">
          <textarea
            value={texto}
            maxLength={500}
            placeholder="Digite sua avaliação"
            onChange={(event) => setTexto(event.target.value)}
            className="text-black h-full  shadow-sm placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"
          />
        </div>

        <div className="flex justify-between items-center w-[90%] mt-6">
          <span className="text-white text-base pl-1">{texto.length}/500</span>
          <div className="flex mr-6 items-center justify-center">
            <button
              onClick={() => {
                resetModalFields();
                toggleModal();
              }}
              className="bg-transparent text-white rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9 flex items-center justify-center"
            >
              Cancelar
            </button>
            <button
              className="bg-[#A4FED3] text-[#2B895C] ml-1 font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px] flex items-center justify-center"
              onClick={() => {
                if (
                  !texto.trim() ||
                  courseSelected === "-1"
                ) {
                  toast.error("Preencha todos os campos!");
                } else {
                  creatingAval({
                    text: texto,
                    professorId: professorInfo?.id,
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

  //modais para editar/excluir
  const modalEditAval = () => {
    const modal = (
      <div className="fixed w-screen h-screen min-h-fit overflow-y-scroll bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="h-screen  w-1/2 max-h-[45%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
          <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
            <textarea
              value={textoEdit}
              maxLength={500}
              onChange={(event) => setTextoEdit(event.target.value)}
              className="text-black h-full placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"
            >
              {" "}
            </textarea>
          </div>
          <div className="flex justify-between items-center w-[90%] mt-6">
            <span className="text-white text-base pl-1">
              {textoEdit.length}/500
            </span>
            <div className="flex mr-6 items-center justify-center">
              <button
                onClick={() => {
                  setTextoEdit("");
                  toggleModalEdit();
                }}
                className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9 flex items-center justify-center"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!textoEdit.trim()) {
                    toast.error("O comentário não pode ser vazio");
                  } else {
                    setTextoEdit(textoEdit);
                    const avalEdited: Partial<Avaliacao> = {
                      text: textoEdit,
                      isEdited: true,
                    };
                    try {
                      updateAval(avalEdited, idAvalEdited);
                      toggleModalEdit();
                      toast.success("A avaliação foi editada com sucesso", {
                        autoClose: 1100,
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 1600);
                    } catch {
                      toast.error("Erro ao editar avaliação", {
                        autoClose: 2200,
                      });
                    }
                  }
                }}
                className="bg-[#A4FED3] text-[#2B895C] ml-1 font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px] flex items-center justify-center"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
    return modal;
  };

  const modalDeleteAval = () => {
    const modal = (
      <div className="fixed w-full h-screen bg-black bg-opacity-30 flex items-center justify-center outline ml-0 z-50 overflow-hidden">
        <div className="bg-black pt-3 pl-6 pr-6 pb-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
          <div className="text-center mb-5 p-2">
            <p className="text-lg text-ellipsis text-white">
              Tem certeza de que deseja excluir a avaliação?
            </p>
            <p className="text-xs italic text-white">
              {" "}
              Essa ação não poderá ser desfeita
            </p>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={() => {
                toggleDeleteAval();
                try {
                  deleteAval(idAvalDeleted);
                  toast.success("Avaliação excluída com sucesso!", {
                    autoClose: 800,
                  });
                  setTimeout(() => {
                    window.location.reload();
                  }, 1100);
                } catch {
                  toast.error("Erro ao excluir avaliação");
                }
              }}
              className="bg-red-600 text-white font-semibold px-7 py-2 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 ease-in-out"
            >
              Sim
            </button>
            <button
              onClick={() => toggleDeleteAval()}
              className=" text-white font-semibold px-7 py-2 rounded-lg hover:bg-white border-[0.5px] border-gray-300 hover:text-black transition duration-300 ease-in-out"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
    return modal;
  };

  if (loading) return telaCarregamento;
  if (!professorInfo)
    return (
      <div className="flex justify-center items-center h-screen">
        Professor não encontrado.
      </div>
    );

  return (
    <div className="flex flex-col h-screen min-h-fit bg-gray-100">
      {isModalEditOpen && modalEditAval()}
      {isModalDeleteAvalOpen && modalDeleteAval()}
      {isModalOpen && isAuth && modalAvaliacao()}
      {/* Header */}
      {isAuth && userInfo && <HeaderLogado/>}
      {!isAuth && <HeaderDeslogado />}

      {/* Conteúdo Principal */}
      <main className="w-full max-w-[40%] min-h-fit mx-auto bg-white rounded shadow-md my-5">
        {/* Perfil */}
        <section className="bg-customGreen border-b rounded-t p-5 flex items-center">
          <Image
            src={professorInfo.profilepic || "/default-profile.png"}
            alt="Foto de perfil"
            width={120}
            height={120}
            className="w-32 h-32 rounded-full shadow-md bg-white object-cover"
          />
        </section>

        <section className="p-4 bg-white flex justify-between relative">
          <div className="flex justify-between w-full mx-5">
            <div className="flex flex-col w-full">
              {" "}
              {/* Adicionado w-full para garantir que o conteúdo ocupe a largura correta */}
              <div className="flex items-center justify-between mb-2 ">
                <h1 className="text-xl font-bold text-black">
                  {professorInfo.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/building.png"
                  alt="Ícone de departamento"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <p className="text-sm text-gray-700">
                  {professorInfo.department?.name ||
                    "Departamento não encontrado"}
                </p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/livro.png"
                  alt="Ícone de curso"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <p className="text-sm text-gray-700">
                  Disciplinas:{" "}
                  {professorInfo.courses
                    ? professorInfo.courses
                        .map((course) => course.name)
                        .join(", ")
                    : "Nenhum curso associado"}
                </p>
              </div>
            </div>
          </div>
          <button
            className={`${
              isAuth
                ? "bg-azulCjr text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } w-[9rem] h-[3rem] mx-auto rounded-lg shadow-md hover:shadow-lg  transition duration-500`}
            
            onClick={() => {
              if (profSelected && profSelected.courses?.length === 0) {
                toast.warning('Não há nenhuma disciplina cadastrada para este professor', {autoClose:1700});
              } else if (profSelected && profSelected.courses && profSelected.courses?.length > 0) {
                toggleModal();
              }
            }}

            disabled={!isAuth}
          >
            Avaliar
          </button>
        </section>

        {/* Avaliações */}
        <section className="mt-3 p-4">
          <h2 className="text-l font-semibold mb-3 text-black">Avaliações</h2>

          {professorInfo.avaliacoes && professorInfo.avaliacoes.length > 0 ? (
            professorInfo.avaliacoes.map((avaliacao) => (
              <article
                key={avaliacao.id}
                onClick={()=> {
                  router.push(`/avaliacao/${avaliacao.id}`)
                }}
                className="bg-customGreen group shadow-md hover:bg-[#a5e8c7] transition duration-300 ease-in-out cursor-pointer rounded-lg  mb-4 flex flex-row p-3"
              >
                <div className="flex items-start justify-center w-16 h-16 mr-2">
                  <Image
                    src={avaliacao.user?.profilepic || "/default-profile.png"}
                    alt="Foto do autor"
                    width={64}
                    height={64}
                    className="w-12 h-12 object-cover rounded-full cursor-pointer bg-white shadow-md transition duration-300 ease-in-out"
                    onClick={(event) =>{
                      event.stopPropagation();
                      router.push(`/user/aluno/${avaliacao.user?.id || ""}`)}
                    }
                  />
                </div>

                <div className="w-full ">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-row items-center">
                      <p
                        className="font-bold text-gray-800 cursor-pointer mr-2 transition duration-300 hover:scale-105 ease-in-out"
                        onClick={(event) =>{
                          event.stopPropagation();
                          router.push(`/user/aluno/${avaliacao.user?.id || ""}`)}
                        }
                        onSelect={(event)=>{
                          event.stopPropagation()
                        }}
                      >
                        {avaliacao.user?.name || "Usuário desconhecido"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(avaliacao.createdAt || "").toLocaleDateString()} -{" "}
                        {avaliacao.course?.name || "Curso desconhecido"}
                      </p>
                    </div>
                    {userInfo?.id === avaliacao.userId && (
                      <div className="flex flex-row">
                        <Image
                          src="/editar.png"
                          alt="Editar avaliação"
                          width={64}
                          height={64}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleModalEdit();
                            setTextoEdit(avaliacao.text);
                            setIdAvalEdited(avaliacao.id);
                          }}
                          className="w-5 h-5 mx-2 p-0.5 transition duration-300 rounded object-cover hover:bg-white hover:scale-110 ease-in-out cursor-pointer"
                        />
                        <Image
                          src="/lixeira.png"
                          alt="Excluir avaliação"
                          width={64}
                          height={64}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleDeleteAval();
                            setIdAvalDeleted(avaliacao.id);
                          }}
                          className="w-5 h-5 mx-2 p-0.5 transition duration-300 rounded object-cover hover:bg-white hover:scale-110 ease-in-out cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <p
                    onClick={(event)=> event.stopPropagation()}
                    onSelect={(event)=> event.stopPropagation()}
                    className="text-gray-700 mt-2 whitespace-pre-wrap overflow-wrap: break-words break-word white-space: normal transition duration-300 ease-in-out cursor-pointer"
                  >
                    {avaliacao.text}
                  </p>
                  {avaliacao.comments && avaliacao.comments.length > 0 && (
                    <div className="mt-2 ">
                      <button
                        className="text-gray-500 text-sm font-medium cursor-pointer mb-2 transition duration-300 ease-in-out"
                        onClick={(event) =>{
                          event.stopPropagation();
                          setOpenComments((prev) =>
                            prev === avaliacao.id ? null : avaliacao.id
                          )}
                        }
                      >
                        {openComments === avaliacao.id
                          ? "Ocultar comentários"
                          : `Ver comentários (${avaliacao.comments.length})`}
                      </button>

                      {openComments === avaliacao.id &&
                        avaliacao.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-100 rounded-[50px] text-sm p-4 mt-1"
                          >
                            <p
                              className="font-semibold text-gray-700 flex items-center cursor-pointer origin-center transition-transform duration-300 ease-in-out"
                              onClick={(event) =>{
                                event.stopPropagation();
                                router.push(
                                  `/user/aluno/${comment.user?.id || ""}`
                                )
                              }
                              }
                            >
                              <Image
                                src={
                                  comment.user?.profilepic ||
                                  "/default-profile.png"
                                }
                                alt="Foto do autor do comentário"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-cover rounded-full bg-white mr-2 transition-transform origin-center duration-300 ease-in-out"
                                onClick={(event) =>{
                                  event.stopPropagation();
                                  router.push(
                                    `/user/aluno/${comment.user?.id || ""}`
                                  )
                                }}
                              />
                              {comment.user?.name || "Usuário desconhecido"}
                            </p>
                            <p
                            onSelect={(event)=> event.stopPropagation()}  
                            onClick={(event)=> event.stopPropagation()}         
                            className="text-gray-600 text-sm ml-[2rem] mt-1 whitespace-pre-wrap overflow-wrap:break-words break-word white-space: normal">
                              {comment.text}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500  ml-[0.2rem]">
              Nenhuma avaliação publicada.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
