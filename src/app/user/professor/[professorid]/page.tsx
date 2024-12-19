"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Professor, User } from "@/types";
import HeaderLogado from "@/components/headers/logado/page";
import HeaderDeslogado from "@/components/headers/deslogado/page";
import { jwtDecode } from "jwt-decode";

export default function ProfessorPerfil() {
  const { professorid } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [professorInfo, setProfessorInfo] = useState<Professor | null>(null);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [isAuth, setIsAuth] = useState(false); // Identifica se o usuário está logado
  const [userInfo, setUserInfo] = useState<User | null>(null); // Dados do usuário logado

  // Verifica a autenticação e pega informações do usuário logado
  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decoded: { sub: number } = jwtDecode(token);
          const userResponse = await axios.get(`http://localhost:4000/user/${decoded.sub}`);
          setUserInfo(userResponse.data as User);
          setIsAuth(true);
        } catch (error) {
          console.error("Erro ao decodificar token ou buscar informações do usuário:", error);
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
        const response = await axios.get(`http://localhost:4000/professors/${professorid}`);
        setProfessorInfo(response.data as Professor);
      } catch (error) {
        console.error("Erro ao carregar informações do professor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessor();
  }, [professorid]);

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  if (!professorInfo) return <div className="flex justify-center items-center h-screen">Professor não encontrado.</div>;

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

        <section className="p-4 bg-white flex justify-between">
          <div className="flex justify-between w-full mx-5">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-black mb-2">{professorInfo.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/building.png"
                  alt="Ícone de departamento"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <p className="text-sm text-gray-700">
                  {professorInfo.department?.name || "Departamento não encontrado"}
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
                  Cursos:{" "}
                  {professorInfo.courses
                    ? professorInfo.courses.map((course) => course.name).join(", ")
                    : "Nenhum curso associado"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Avaliações */}
        <section className="mt-3 p-4">
          <h2 className="text-l font-semibold mb-3 text-black">Avaliações</h2>

          {professorInfo.avaliacoes && professorInfo.avaliacoes.length > 0 ? (
            professorInfo.avaliacoes.map((avaliacao) => (
              <article
                key={avaliacao.id}
                className="bg-customGreen rounded-lg shadow mb-4 flex flex-row p-3"
              >
                <div className="flex items-start justify-center w-16 h-16 mr-2">
                  <Image
                    src={avaliacao.user?.profilepic || "/default-profile.png"}
                    alt="Foto do autor"
                    width={64}
                    height={64}
                    className="w-12 h-12 object-cover rounded-full cursor-pointer bg-white"
                    onClick={() => router.push(`/user/aluno/${avaliacao.user?.id || ""}`)}
                  />
                </div>

                <div className="max-w-[550px]">
                  <p
                    className="font-bold text-gray-800 cursor-pointer"
                    onClick={() => router.push(`/user/aluno/${avaliacao.user?.id || ""}`)}
                  >
                    {avaliacao.user?.name || "Usuário desconhecido"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(avaliacao.createdAt || "").toLocaleDateString()} -{" "}
                    {avaliacao.course?.name || "Curso desconhecido"}
                  </p>
                  <p className="text-gray-700 mt-2">{avaliacao.text}</p>

                  {avaliacao.comments && avaliacao.comments.length > 0 && (
                    <div className="mt-2">
                      <button
                        className="text-gray-500 text-sm font-medium cursor-pointer mb-2"
                        onClick={() =>
                          setOpenComments((prev) => (prev === avaliacao.id ? null : avaliacao.id))
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
                            <p className="font-semibold text-gray-700 flex items-center">
                              <Image
                                src={comment.user?.profilepic || "/default-profile.png"}
                                alt="Foto do autor do comentário"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-cover rounded-full bg-white mr-2"
                              />
                              {comment.user?.name || "Usuário desconhecido"}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">{comment.text}</p>
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