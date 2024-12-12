"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { getUserDetails } from "@/utils/api"; // Use o nome correto da função já implementada

export default function PerfilAlunoLogado() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    name: "",
    email: "",
    password: "",
    program: { id: 0, name: "Carregando..." },
    profilepic: "/default-profile.png",
    avaliacoes: [],
  });

  const fixedUserId = 2;
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await getUserDetails(fixedUserId) as User;
        setUserInfo({
          id: userData.id || 0,
          name: userData.name || "",
          email: userData.email || "",
          password: userData.password || "",
          program: userData.program || { id: 0, name: "Carregando..." },
          profilepic: userData.profilepic || "/default-profile.png",
          avaliacoes: userData.avaliacoes || [],
        });
      } catch (error) {
        console.error("Erro ao carregar as informações do usuário:", error);
      }
    };

    loadUserInfo();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="flex justify-between bg-blue-200 p-2 items-center">
        <Image
          src="/logounb.png"
          alt="Logo da UnB"
          width={80}
          height={80}
          className="w-20 h-10 cursor-pointer"
          onClick={() => router.push("/feed/Logado")}
        />

        <div className="flex items-center space-x-5">
          <Image
            src={userInfo.profilepic || "/default-profile.png"}
            alt="Foto de perfil"
            width={48}
            height={48}
            className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
            onClick={() => router.push("/perfil/Aluno/Logado")}
          />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="w-full max-w-[40%] h-full mx-auto bg-white rounded shadow-md my-5">
        {/* Perfil */}
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
              <p className="text-sm text-gray-500">
                {userInfo?.email || "Carregando..."}
              </p>
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
                <div className="flex items-start justify-center w-16 h-46 mr-2 overflow-hidden">
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
                    {new Date(avaliacao.date || "").toLocaleDateString()} -{" "}
                    Professor ID: {avaliacao.professorId} -{" "}
                    {avaliacao.courseId || "Curso não encontrado"}
                  </p>
                  <p className="text-gray-700 mt-2">{avaliacao.text}</p>

                  {avaliacao.comments && avaliacao.comments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700">
                        Comentários:
                      </p>
                      {avaliacao.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="text-sm text-gray-500 bg-gray-100 rounded p-2 mt-2"
                        >
                          <p className="font-semibold text-gray-700">
                            {comment.user?.name || "Usuário desconhecido"}:
                          </p>
                          <p>{comment.text}</p>
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