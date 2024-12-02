"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

export default function PerfilAlunoDeslogado() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex justify-between bg-blue-200 p-2 items-center">
        <div>
          <Image
            src="/logounb.png"
            alt="Logo da UnB"
            width={80}
            height={80}
            className="w-20 h-10"
          />
        </div>

        <div className="flex items-center p-2">
          <div>
            <button
              className="bg-azulCjr hover:bg-blue-600 mx-5 p-2 rounded-[60px] transition duration-300 ease-in-out"
              onClick={() => alert("Sem notificações novas.")}
            >
              <BellIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="rounded-full">
            <Image
              src="/morty.png"
              alt="Foto de perfil"
              width={48}
              height={48}
              className="w-10 h-10 rounded-full shadow-md bg-white object-cover"
              onClick={() => router.push("/perfil/Aluno/Logado")}
            />
          </div>

          <div>
            <button
              className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out mx-5"
              onClick={() => router.push("/feed/Deslogado")}
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-screen max-w-[40%] mx-auto bg-white rounded shadow-md">
        <div className="bg-customGreen border-b">
          <div className="flex items-center p-5">
            <Image
              src="/morty.png"
              alt="Foto de perfil"
              width={120}
              height={120}
              className="w-32 h-32 rounded-full shadow-md z-10 bg-white object-cover"
            />
          </div>

          <div className="flex justify-between items-center bg-white">
              <div className="w-full h-40 p-4">
                <div className="flex flex-col">
                  <div className="flex flex-col w-full p-4 ml-4">
                    <h1 className="text-xl font-bold text-black mb-1.5">Morty Gamer</h1>

                    <div className="flex items-center gap-2">
                      <div className="flex items-start justify-center w-7 h-7">
                        <Image
                          src="/building.png"
                          alt="Ícone de prédio"
                          width={24}
                          height={24}
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 mb-1.5">
                          Ciência da Computação / Dept. Ciência da Computação
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-start justify-center w-7 h-7">
                        <Image
                          src="/email.png"
                          alt="Ícone de e-mail"
                          width={24}
                          height={24}
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">morty.gamer-23@xyz.edu.br</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="flex flex-col space-y-2 mr-10 text-black text-xs whitespace-nowrap">
              <button
                className="bg-red-400 border border-black rounded-[60px] px-4 py-2 hover:bg-red-500 transition duration-300 ease-in-out shadow-md"
                onClick={async () => {
                  const confirmacao = confirm("Tem certeza que deseja excluir o perfil?");
                  if (confirmacao) {
                    try {
                      const response = await fetch("/api/perfil", {
                        method: "DELETE",
                      });
              
                      if (response.ok) {
                        alert("Perfil excluído com sucesso.");
                      } else {
                        alert("Erro ao excluir o perfil. Tente novamente.");
                      }
                    } catch (error) {
                      console.error("Erro na exclusão do perfil:", error);
                      alert("Erro ao conectar com o servidor.");
                    }
                  }
                }}
              >
                Excluir Perfil
              </button>

              <button
                className="bg-green-300 border border-black rounded-[60px] px-4 py-2 hover:bg-green-400 transition duration-300 ease-in-out shadow-md"
                onClick={() => router.push("/perfil/Aluno/Logado/Editar")}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 p-4">
          <h2 className="text-l font-semibold mb-3 text-black">Publicações</h2>

          <div className="bg-customGreen rounded-lg shadow mb-4 flex flex-row p-3 ">
            <div className="flex items-start justify-center w-16 h-46 mr-2  overflow-hidden">
              <Image
                src="/morty.png"
                alt="Autor"
                width={64} 
                height={64}
                className="w-12 h-12 object-cover rounded-full bg-white"
              />
            </div>
            <div className="max-w-[550px]">
              <p className="font-bold text-gray-800">Morty Gamer</p>
              <p className="text-sm text-gray-500">
                17/04/2024, às 21:42 - João Frango: Surf
              </p>
              <p className="text-gray-700 mt-2">
                O professor João Frango é conhecido por suas aulas dinâmicas e exemplos práticos,
                o que torna o aprendizado mais acessível e interessante para os alunos.
              </p>
              <p className="text-sm text-gray-500 mt-2">2 comentários</p>
            </div>
          </div>

          <div className="bg-customGreen rounded-lg shadow mb-4 flex p-3 ">
            <div className="flex items-start justify-center w-16 h-46 mr-2 overflow-hidden">
              <Image
                src="/morty.png"
                alt="Autor"
                width={64} 
                height={64}
                className="w-12 h-12 object-cover rounded-full bg-white"
              />
            </div>
            <div className="max-w-[550px]">
              <p className="font-bold text-gray-800">Morty Gamer</p>
              <p className="text-sm text-gray-500">
                17/04/2024, às 21:52 - Felipe Luis: Introdução a Técnico de Futebol
              </p>
              <p className="text-gray-700 mt-2">
                Meio chato, mas é um bom professor. Tem hora que me perco nas aulas, mas no geral é bom.
              </p>
              <p className="text-sm text-gray-500 mt-2">31 comentários</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}