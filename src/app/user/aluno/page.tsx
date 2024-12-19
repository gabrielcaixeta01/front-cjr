"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { User } from "@/types";
import { fetchUserInfo } from "@/utils/api";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import HeaderLogado from "@/components/headers/logado/page";
import HeaderDeslogado from "@/components/headers/deslogado/page";

export default function PerfilAluno() {
  const router = useRouter();
  const { userid } = useParams(); // ID do perfil na URL
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null); // Dados do usuário do perfil
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // ID do usuário autenticado
  const [isAuth, setIsAuth] = useState(false); // Verifica se o usuário está autenticado
  const [professores, setProfessores] = useState<{ id: number; name: string }[]>([]);
  const [cursos, setCursos] = useState<{ id: number; name: string }[]>([]);
  const [openComments, setOpenComments] = useState<number | null>(null);

  // Verifica autenticação e salva o ID do usuário logado
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { sub: number } = jwtDecode(token);
          setLoggedInUserId(decoded.sub); // Salva o ID do usuário logado
          setIsAuth(true); // Define como autenticado
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          setIsAuth(false);
          router.push("/auth/login");
        }
      } else {
        setIsAuth(false);
        router.push("/auth/login");
      }
    };

    verifyAccess();
  }, [router]);

  // Busca as informações do perfil (do ID da URL ou do usuário logado)
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userIdToFetch = userid ? Number(userid) : loggedInUserId;
        if (!userIdToFetch) return; // Se não há ID (usuário não logado ou problema), para aqui
        const userData = await fetchUserInfo(userIdToFetch);
        setUserInfo(userData);
      } catch (error) {
        console.error("Erro ao carregar as informações do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    // Só carrega as informações se o usuário está autenticado
    if (isAuth) {
      loadUserInfo();
    }
  }, [userid, loggedInUserId, isAuth]);

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
      } catch (error) {
        console.error("Erro ao buscar professores ou cursos:", error);
      }
    };

    fetchProfessoresECursos();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!userInfo) return <div>Perfil não encontrado.</div>;

  return (
    <div className="flex flex-col h-screen min-h-fit bg-gray-100">
      {/* Header */}
      {isAuth && userInfo && (
        <HeaderLogado {...(userInfo as User)} />
      )}
      {!isAuth && (
        <HeaderDeslogado />
      )}

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
                <p className="text-sm text-gray-700">
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
            {isAuth && loggedInUserId === Number(userid) && (
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
                      className="bg-customGreen rounded-lg shadow mb-4 flex flex-row p-3"
                    >
                      <div className="flex items-start justify-center w-16 h-16 mr-2">
                        <Image
                          src={userInfo.profilepic || "/default-profile.png"}
                          alt="Autor"
                          width={64}
                          height={64}
                          className="w-12 h-12 object-cover rounded-full bg-white"
                        />
                      </div>
                      <div className="max-w-[550px]">
                        <p className="font-bold text-gray-800">{userInfo.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(avaliacao.createdAt || "").toLocaleDateString()} -{" "}
                          {professores.find((prof) => prof.id === avaliacao.professorId)?.name ||
                            "Professor não encontrado"}{" "}
                          -{" "}
                          {cursos.find((curso) => curso.id === avaliacao.courseId)?.name ||
                            "Curso não encontrado"}
                        </p>
                        <p className="text-gray-700 mt-2">{avaliacao.text}</p>
      
                        {/* Botão para abrir/fechar comentários */}
                        {avaliacao.comments && avaliacao.comments.length > 0 && (
                          <div className="mt-2">
                            <button
                              className="text-gray-500 text-sm font-medium cursor-pointer mb-2"
                              onClick={() =>
                                setOpenComments((prev) =>
                                  prev === avaliacao.id ? null : avaliacao.id
                                )
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
                                  className="bg-gray-100 rounded-[50px] text-sm p-3 mt-1"
                                >
                                  <div className="flex items-center">
                                    <div className="flex  mr-2 mb-1">
                                      <Image
                                        src={comment.user?.profilepic || "/default-profile.png"}
                                        alt="Foto do autor do comentário"
                                        width={64}
                                        height={64}
                                        className="w-8 h-8 object-cover cursor-pointer rounded-full bg-white"
                                        onClick={() => router.push(`/user/aluno/${comment.user?.id}`)}
                                      />
                                    </div>
                                    <p className="font-semibold cursor-pointer text-gray-700" onClick={() => router.push(`/user/aluno/deslogado/${comment.user?.id}`)}>
                                      {comment.user?.name || "Usuário desconhecido"}
                                    </p>
                                  </div>
                                  <p className="text-gray-600 text-sm ml-2">{comment.text}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma avaliação publicada.</p>
                )}
              </section>
            </main>
          </div>
        );
      }