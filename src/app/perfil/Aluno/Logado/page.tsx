"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal";
import { deleteUser, fetchUserInfo } from "@/utils/page";
import { User, Avaliacao } from "@/types"; // Importando tipos do arquivo centralizado
import "react-toastify/dist/ReactToastify.css";

export default function PerfilAlunoLogado() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState<User & { avaliacoes: Avaliacao[] }>({
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
        const userData = await fetchUserInfo(fixedUserId);
        console.log("Dados do usuário:", userData); // Verifique aqui as avaliações
        setUserInfo({
          id: userData.id || 0,
          name: userData.name || "",
          email: userData.email || "",
          password: userData.password || "",
          program: userData.program || { id: 0, name: "Carregando..." },
          profilepic:
            typeof userData.profilepic === "string"
              ? userData.profilepic
              : "/default-profile.png",
          avaliacoes: userData.avaliacoes || [], // Verifique se isso está retornando corretamente
        });
      } catch (error) {
        console.error("Erro ao carregar as informações do usuário:", error);
      }
    };
  
    loadUserInfo();
  }, []);

  const handleDeleteProfile = async () => {
    setIsModalOpen(false);

    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsDeleting(true);
        try {
          await deleteUser(fixedUserId);
          resolve("Perfil excluído com sucesso.");
          router.push("/feed/Deslogado");
        } catch (error) {
          console.error("Erro ao excluir o perfil:", error);
          reject("Erro ao excluir o perfil. Tente novamente.");
        } finally {
          setIsDeleting(false);
        }
      }),
      {
        pending: "Processando exclusão do perfil...",
        success: "Perfil excluído com sucesso.",
        error: "Erro ao excluir o perfil.",
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {isModalOpen && (
        <ConfirmModal
          message="Tem certeza que deseja excluir o perfil?"
          onConfirm={handleDeleteProfile}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

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
          <button
            className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 ease-in-out"
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
            onClick={() => router.push("/perfil/Aluno/Logado")}
          />

          <button
            className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={() => router.push("/feed/Deslogado")}
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-[40%] h-full mx-auto bg-white rounded shadow-md my-5">
        <section className="bg-customGreen border-b rounded-t p-5 flex items-center">
          <Image
            src={userInfo?.profilepic || "/default-profile.png"}
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

          <div className="flex flex-col text-black text-sm space-y-2 p-4">
            <button
              className="bg-red-400 border border-black rounded-[60px] px-4 py-2 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out shadow-md"
              onClick={() => setIsModalOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir Perfil"}
            </button>

            <button
              className="bg-green-300 border border-black rounded-[60px] px-4 py-2 hover:bg-customGreen hover:text-white transition duration-300 ease-in-out shadow-md"
              onClick={() => router.push("/perfil/Aluno/Logado/Editar")}
            >
              Editar Perfil
            </button>
          </div>
        </section>

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
                    {new Date(avaliacao.date).toLocaleDateString()} -{" "}
                    {avaliacao.professor.name} - {avaliacao.course?.name || "Curso não encontrado"}
                  </p>
                  <p className="text-gray-700 mt-2">{avaliacao.text}</p>

                  {avaliacao.comments && avaliacao.comments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700">Comentários:</p>
                      {avaliacao.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="text-sm text-gray-500 bg-gray-100 rounded p-2 mt-2"
                        >
                          <p className="font-semibold text-gray-700">{comment.user?.name || "Usuário desconhecido"}:</p>
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
