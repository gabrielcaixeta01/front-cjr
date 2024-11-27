"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function PerfilAlunoDeslogado() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-4">
        <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 mx-5">
          <HomeIcon
            className="h-6 w-6 text-black"
            onClick={() => router.push("/feed/Deslogado")}
          />
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-5"
          onClick={() => router.push("/login")}
        >
          Fazer Login
        </button>
      </div>

      <div className="w-full h-screen max-w-[40%] mx-auto bg-white rounded shadow-md">
        <div className="bg-customGreen border-b rounded-t">
          <div className="flex items-center p-5">
            <Image
              src="/default-profile.png"
              alt="Foto de perfil padrão"
              width={120}
              height={120}
              className=" w-32 h-32 rounded-full shadow-md z-10"
            />
          </div>
          
          <div className=" w-full h-40 bg-white p-4">
            <div className="flex flex-col">
              <div className="items-center w-full p-4 ml-4">
                <h1 className="text-xl font-bold text-black mb-1.5">Morty Gamer</h1>
                <div className="flex items-center gap-3">
                  <Image
                    src="/building.png"
                    alt="Ícone de prédio"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <p className="text-sm text-gray-700 mb-1.5">
                    Ciência da Computação / Dept. Ciência da Computação
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/email.png"
                    alt="Ícone de e-mail"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <p className="text-sm text-gray-500">morty.gamer-23@xyz.edu.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div className="mt-3 p-4">
          <h2 className="text-l font-semibold mb-3 text-black">Publicações</h2>

          {/* Publicação 1 */}
          <div className="bg-customGreen p-4 rounded-lg shadow mb-4">
            <div className="flex items-start mb-3">
              <Image
                src="/default-profile.png"
                alt="Autor"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-bold text-gray-800">Morty Gamer</p>
                <p className="text-sm text-gray-500">
                  17/04/2024, às 21:42 - João Frango: Surf
                </p>
                <p className="text-gray-700 mt-2">
                  O professor João Frango é conhecido por suas aulas dinâmicas
                  e exemplos práticos, o que torna o aprendizado mais acessível
                  e interessante para os alunos.
                </p>
                <p className="text-sm text-gray-500 mt-2">2 comentários</p>
              </div>
            </div>
          </div>

          {/* Publicação 2 */}
          <div className="bg-customGreen p-4 rounded-lg shadow mb-4">
            <div className="flex items-start mb-3">
              <Image
                src="/default-profile.png"
                alt="Autor"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="font-bold text-gray-800">Morty Gamer</p>
                <p className="text-sm text-gray-500">
                  17/04/2024, às 21:52 - João Frango: Surf
                </p>
                <p className="text-gray-700 mt-2">
                  Durante suas aulas, o professor João Frango incentiva os
                  alunos a participarem ativamente, promovendo discussões ricas
                  e esclarecedoras sobre temas complexos.
                </p>
                <p className="text-sm text-gray-500 mt-2">2 comentários</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}