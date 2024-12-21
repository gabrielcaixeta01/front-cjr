"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { Avaliacao, User } from "@/types";
import { fetchUserInfo } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import HeaderLogado from "@/components/headers/logado/page";
import HeaderDeslogado from "@/components/headers/deslogado/page";
import telaCarregamento from "@/components/telas_carregamento/aluno/tela_carregamento_aluno"
import { toast } from "react-toastify";
import {updateAval, deleteAval} from "@/utils/api";

export default function PerfilAluno() {
  const router = useRouter();
  const { id } = useParams(); // ID do perfil na URL
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null); // Dados do usuário do perfil
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // ID do usuário autenticado
  const [isAuth, setIsAuth] = useState(false); // Verifica se o usuário está autenticado
  const [professores, setProfessores] = useState<{ id: number; name: string }[]>([]);
  const [cursos, setCursos] = useState<{ id: number; name: string }[]>([]);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [textoEdit, setTextoEdit] = useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteAvalOpen, setIsToggleDeleteAvalOpen] = useState(false);
  const [idAvalEdited, setIdAvalEdited] = useState(0);
  const [idAvalDeleted, setIdAvalDeleted] = useState(0);


  // Verifica autenticação e salva o ID do usuário logado
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { sub: number } = jwtDecode(token);
          setLoggedInUserId(decoded.sub); // Salva o ID do usuário logado
          setIsAuth(true); // Define como autenticado
        } catch {
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
    };

    verifyAccess();
  }, []);

  // Busca as informações do perfil (do ID da URL ou do usuário logado)
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userIdToFetch = id ? Number(id) : loggedInUserId;
        if (!userIdToFetch) return; // Se não há ID, para aqui
        const userData = await fetchUserInfo(userIdToFetch);
        setUserInfo(userData);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [id, loggedInUserId]);

  // Busca os professores e cursos
  useEffect(() => {
    const fetchProfessoresECursos = async () => {
      try {
        const [professoresResponse, cursosResponse] = await Promise.all([
          axios.get("http://localhost:4000/professors"),
          axios.get("http://localhost:4000/courses"),
        ]);
        setProfessores(professoresResponse.data as { id: number; name: string }[]);
        setCursos(cursosResponse.data as { id: number; name: string }[]);
      } catch {
      }
    };

    fetchProfessoresECursos();
  }, []);

  //toggle dos modais
  const toggleModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  }

  const toggleDeleteAval = () => {
    setIsToggleDeleteAvalOpen(!isModalDeleteAvalOpen);
  }

  //modais para editar/excluir
  const modalEditAval = () => {
    const modal = 
    <div className="fixed w-full h-screen bg-black bg-opacity-30 flex items-center justify-center z-50">
     <div className="h-screen  w-1/2 max-h-[45%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
      <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
        <textarea value={textoEdit} maxLength={500} onChange={(event)=> setTextoEdit(event.target.value)} className="text-black h-full placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"> </textarea>
      </div>
      <div className="flex justify-between items-center w-[90%] mt-6">
          <span className="text-white text-base pl-1">
            {textoEdit.length}/500
          </span>
          <div className="flex mr-6 items-center justify-center">
            <button onClick={()=> 
              {setTextoEdit("");
                toggleModalEdit();
              }}
              className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9 flex items-center justify-center"
              >
              Cancelar
            </button>
            <button onClick={() => {
                if (!textoEdit.trim()){
                  toast.error("O comentário não pode ser vazio");
                }
                else {
                  setTextoEdit(textoEdit);          
                  const avalEdited: Partial <Avaliacao> = {
                    text: textoEdit,
                    isEdited:true,
                  }
                  try{
                    updateAval(avalEdited,idAvalEdited);
                    toggleModalEdit(); 
                    toast.success("A avaliação foi editada com sucesso", {autoClose:1100});
                    setTimeout(() => {
                    window.location.reload();
                    }, 1600);
                  }
                  catch{
                    toast.error("Erro ao editar avaliação", {autoClose:2200})
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
    return modal;                          
  }

  const modalDeleteAval = () => {
    const modal = 
      <div className="fixed w-full h-screen bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-black pt-3 pl-6 pr-6 pb-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
          <div className="text-center mb-5 p-2">
            <p className="text-lg text-ellipsis text-white">
            Tem certeza de que deseja excluir a avaliação?
            </p>
            <p className="text-xs italic text-white"> Essa ação não poderá ser desfeita</p>
        </div>
        <div className="flex space-x-6">
          <button
            onClick={()=> {
                            toggleDeleteAval();
                            try{                                              
                              deleteAval(idAvalDeleted);
                              toast.success("Avaliação excluída com sucesso!",{autoClose:800})
                              setTimeout(() => {
                                window.location.reload();
                              }, 1100);              
                            }
                            catch {
                              toast.error("Erro ao excluir avaliação")
                            }
                          }
                        }
            className="bg-red-600 text-white font-semibold px-7 py-2 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 ease-in-out"
          >
            Sim 
          </button>
          <button
            onClick={()=> toggleDeleteAval()}
            className=" text-white font-semibold px-7 py-2 rounded-lg hover:bg-white border-[0.5px] border-gray-300 hover:text-black transition duration-300 ease-in-out"
          >
            Cancelar 
          </button>
        </div>
      </div>
    </div>
    return modal;
  }
    


  if (loading) return telaCarregamento;
  if (!userInfo) return <div>Perfil não encontrado.</div>;

  return (
    <div className="flex flex-col h-screen min-h-fit bg-gray-100">
      {/* Header */}
      {isAuth && userInfo ? (
        <HeaderLogado />
      ) : (
        <HeaderDeslogado />
      )}
      {isModalEditOpen && (
        modalEditAval()
      )}
      {isModalDeleteAvalOpen && (                      
        modalDeleteAval())
      }

      {/* Conteúdo Principal */}
      <main className="w-full max-w-[40%] min-h-fit mx-auto bg-white rounded shadow-md my-5">
        <section className="bg-customGreen border-b rounded-t p-5 flex items-center">
          <Image
            src={userInfo.profilepic || "/default-profile.png"}
            alt="Foto de perfil"
            width={120}
            height={120}
            className="w-32 h-32 rounded-full shadow-md z-10 bg-white object-cover"
          />
        </section>

        <section className="p-4 bg-white flex justify-between">
          <div className="flex justify-between w-full mx-5">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-black mb-2">
                {userInfo?.name || "Carregando..."}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/building.png"
                  alt="Ícone de prédio"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-cover"
                />
                <p className="text-sm text-gray-500">
                  {userInfo.program?.name || "Carregando..."}
                  {userInfo.department?.name && (
                    <>
                      {" "}
                      / <span className="text-gray-500">{userInfo.department.name}</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/email.png"
                  alt="Ícone de e-mail"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-cover"
                />
                <p className="text-sm text-gray-500">{userInfo?.email || "Carregando..."}</p>
              </div>
            </div>
            {isAuth && loggedInUserId === Number(id) && (
              <div className="flex flex-col">
                  <button
                    className="bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                    onClick={() => router.push(`/user/aluno/editar`)}
                  >
                    Editar Perfil
                  </button>
              </div>
            )}
          </div>
        </section>

        {/* Avaliações */}
        <section className="mt-3 p-4">
          <h2 className="text-l font-semibold mb-3 text-black">Publicações</h2>
          {userInfo.avaliacoes && userInfo.avaliacoes.length > 0 ? (
            userInfo.avaliacoes.map((avaliacao) => (
              <article
                key={avaliacao.id}
                onClick={()=> {
                  router.push(`/avaliacao/${avaliacao.id}`)
                }}
                className="bg-customGreen group shadow-md hover:bg-[#a5e8c7] transition duration-300 ease-in-out cursor-pointer rounded-lg  mb-4 flex flex-row p-3"
              >
                <div className="flex items-start justify-center w-16 h-16 mr-2">
                  <Image
                    src={userInfo.profilepic || "/default-profile.png"}
                    alt="Autor"
                    width={64}
                    height={64}
                    className="w-12 h-12 object-cover rounded-full bg-white cursor-default"
                    onClick={(event)=> event.stopPropagation()} 
                  />
                </div>
                <div className="w-full">
                  <div className="flex space-x-12 cursor-default">
                    <div className="flex flex-row justify-between w-full">
                    <p
                    onClick={(event)=> event.stopPropagation()} 
                    onSelect={(event)=>{
                      event.stopPropagation()
                    }}
                    className="font-bold text-gray-800">{userInfo.name}</p>
                    {loggedInUserId===avaliacao.userId && (
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
                        className="w-5 h-5 mx-2 p-0.5 transition duration-500 rounded object-cover hover:bg-white hover:scale-110 ease-in-out cursor-pointer"   
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
                        className="w-5 h-5 mx-2 p-0.5 transition duration-500 rounded object-cover hover:bg-white hover:scale-110 ease-in-out cursor-pointer"
                        />   
                      </div>
                    )}
                    </div>
                  </div>
                                             
                  <div className="flex space-x-1">                        
                    <p className="text-sm text-gray-500">
                      {new Date(avaliacao.createdAt || "").toLocaleDateString()} - {" "}
                    </p> 
                    <p className="text-sm text-gray-500 cursor-pointer transition-transform duration-300 hover:scale-105 ease-in-out" 
                    onClick={(event)=>{ event.stopPropagation(); router.push(`/user/professor/${avaliacao.professorId}`) }} >
                      { professores.find((prof) => prof.id === avaliacao.professorId)?.name ||
                        "Professor não encontrado"}{" "}
                      -{" "}
                      </p> 
                      <p className="text-sm text-gray-500">
                        {cursos.find((curso) => curso.id === avaliacao.courseId)?.name ||
                        "Curso não encontrado"}
                      </p>
                  </div>  
                  <p
                  onClick={(event)=> event.stopPropagation()} 
                  onSelect={(event)=> event.stopPropagation()}
                  className="text-gray-700 mt-2 whitespace-pre-wrap overflow-wrap: break-words break-word white-space: normal hover:bg-[#adeccc] transition duration-300 ease-in-out cursor-pointer"
                  >{avaliacao.text}</p>

                  {/* Botão para abrir/fechar comentários */}
                  {avaliacao.comments && avaliacao.comments.length > 0 && (
                    <div className="mt-2">
                      <button
                        className="text-gray-500 text-sm font-medium  mb-2 transition duration-300 hover:scale-110 ease-in-out cursor-pointer"
                        onClick={(event) =>{
                          event.stopPropagation();
                          setOpenComments((prev) =>
                            prev === avaliacao.id ? null : avaliacao.id
                          )
                        }
                        }
                      >
                        {openComments === avaliacao.id
                          ? "Ocultar comentários"
                          : `Ver comentários (${avaliacao.comments.length})`}
                      </button>

                      {/* Exibe os comentários caso estejam abertos */}
                      {openComments === avaliacao.id &&
                        avaliacao.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-100 rounded-[50px] w-[90%] text-sm p-3 mt-1"
                          >
                            <div className="flex items-center">
                              <div className="flex mr-2 mb-1 ml-1">
                                <Image
                                  src={comment.user?.profilepic || "/default-profile.png"}
                                  alt="Foto do autor do comentário"
                                  width={64}
                                  height={64}
                                  className="w-8 h-8 object-cover rounded-full bg-white transition-transform duration-300 ease-in-out cursor-pointer"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    router.push(`/user/aluno/${comment.user?.id}`)
                                  }}
                                />
                              </div>
                              <p
                                className="font-semibold text-gray-700 bg-transparent transition-transform duration-300 ease-in-out cursor-pointer"
                                onClick={(event) =>{
                                  event.stopPropagation();
                                  router.push(`/user/aluno/${comment.user?.id}`)
                                }}
                                onSelect={(event)=>{
                                  event.stopPropagation()
                                }}
                              >
                                {comment.user?.name || "Usuário desconhecido"}
                              </p>
                            </div>
                            <p className="text-gray-600 text-sm ml-[2.8rem] whitespace-pre-wrap overflow-wrap: break-words break-word white-space: normal">{comment.text}</p>                            
                          </div>
                          
                        ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500 ml-[0.2rem]">Nenhuma avaliação publicada.</p>
          )}
        </section>
      </main>
    </div>
  );
}