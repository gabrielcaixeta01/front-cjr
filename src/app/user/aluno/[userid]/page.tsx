"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { User } from "@/types";
import { fetchUserInfo } from "@/utils/api";
import { BellIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export default function PerfilAlunoLogado() {
  const router = useRouter();
  const { userid } = useParams(); // Captura o ID da URL
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [professores, setProfessores] = useState<{ id: number; name: string }[]>([]);
  const [cursos, setCursos] = useState<{ id: number; name: string }[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Busca informações do usuário dinamicamente
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await fetchUserInfo(Number(userid)); // Converte o ID para número
        setUserInfo(userData);
      } catch (error) {
        console.error("Erro ao carregar as informações do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userid) loadUserInfo();
  }, [userid]);

  // Busca professores e cursos
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

  if (loading || !userInfo) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col h-screen min-h-fit bg-gray-100">
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
              onClick={() => router.push("/feed/Logado")}
            />
            <div className="flex items-center space-x-5 mr-10">
              <button
                className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
                onClick={() => toast.info("Sem notificações novas.")}
              >
                <BellIcon className="h-6 w-6 text-white" />
              </button>
              <Image
                src={userInfo.profilepic || "/default-profile.png"}
                alt="Foto de perfil"
                width={48}
                height={48}
                className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
                onClick={() => router.push(`/user/aluno/${userInfo.id}`)}
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
            <div className="flex flex-col">
              <button
                className="bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                onClick={() => router.push(`/user/aluno/${userInfo.id}/editar`)}
              >
                Editar Perfil
              </button>
            </div>
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
                              <p className="font-semibold cursor-pointer text-gray-700" onClick={() => router.push(`/user/aluno/${comment.user?.id}`)}>
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