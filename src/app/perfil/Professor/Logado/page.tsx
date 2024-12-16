"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Professor } from "@/types";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import axios from "axios";

export default function PerfilProfessorDeslogado() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [professorInfo, setProfessorInfo] = useState<Professor | null>(null);

  const fixedProfessorId = 1; 

  // Busca informações do professor
  useEffect(() => {
    const loadProfessorInfo = async () => {
      try {
        const response = await axios.get<Professor>(
          `http://localhost:4000/professors/${fixedProfessorId}`
        );
        setProfessorInfo(response.data);
      } catch (error) {
        console.error("Erro ao carregar informações do professor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessorInfo();
  }, []);

  if (loading || !professorInfo) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
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
                src={professorInfo.profilepic || "/default-profile.png"}
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

      {/* Conteúdo Principal */}
      <main className="w-full max-w-[40%] min-h-fit mx-auto bg-white rounded shadow-md my-5">
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
              <h1 className="text-xl font-bold text-black mb-2">
                {professorInfo.name}
              </h1>
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
                    .map((course) => course.name)
                    .join(", ") || "Nenhum curso associado"}
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
                    src="/default-profile.png"
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="w-12 h-12 object-cover rounded-full bg-white"
                  />
                </div>
                <div className="max-w-[550px]">
                  <p className="font-bold text-gray-800">
                    {avaliacao.user?.name || "Usuário desconhecido"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(avaliacao.createdAt || "").toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-2">{avaliacao.text}</p>
                  {avaliacao.isEdited && (
                    <p className="text-sm text-gray-500 italic mt-1">* Editado</p>
                  )}

                  {avaliacao.comments && avaliacao.comments.length > 0 && (
                    <div className="mt-2">
                      <button
                        className="text-gray-500 text-sm font-medium cursor-pointer mb-2"
                        onClick={() =>
                          setOpenComments((prev) => 
                            prev === avaliacao.id ? null : avaliacao.id as number | null
                          )
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
                            <p className="font-semibold text-gray-700">
                              {comment.user?.name || "Usuário desconhecido"}:
                            </p>
                            <p className="text-gray-600 text-sm">{comment.text}</p>
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