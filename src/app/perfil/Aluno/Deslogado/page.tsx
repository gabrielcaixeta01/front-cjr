"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function PerfilAlunoDeslogado() {
  const router = useRouter();

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
          onClick={() => router.push("/feed/Deslogado")}
        />

        <div className="flex items-center space-x-5">
          <button
            className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 ease-in-out"
            onClick={() => router.push("/feed/Deslogado")}
          >
            <HomeIcon className="h-6 w-6 text-white" />
          </button>
          <button
            className="bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={() => router.push("/login")}
          >
            Fazer Login
          </button>
        </div>
      </header>

      {/* Corpo Principal */}
      <main className="w-full max-w-[40%] h-full mx-auto bg-white rounded shadow-md my-5">
        {/* Foto e informações do perfil */}
        <section className="bg-customGreen border-b rounded-t p-5 flex items-center">
          <Image
            src="/morty.png"
            alt="Foto de perfil"
            width={120}
            height={120}
            className="w-32 h-32 rounded-full shadow-md z-10 bg-white object-cover"
          />
        </section>

        <section className="p-4 bg-white">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-black mb-2">Morty Gamer</h1>

            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/building.png"
                alt="Ícone de prédio"
                width={24}
                height={24}
                className="w-6 h-6 object-cover"
              />
              <p className="text-sm text-gray-700">
                Ciência da Computação / Dept. Ciência da Computação
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
              <p className="text-sm text-gray-500">morty.gamer-23@xyz.edu.br</p>
            </div>
          </div>
        </section>

        {/* Publicações */}
        <section className="mt-3 p-4">
          <h2 className="text-l font-semibold mb-3 text-black">Publicações</h2>

          {[1, 2].map((_, index) => (
            <article
              key={index}
              className="bg-customGreen rounded-lg shadow mb-4 flex flex-row p-3"
            >
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
                  {index === 0
                    ? "17/04/2024, às 21:42 - João Frango: Surf"
                    : "17/04/2024, às 21:52 - Felipe Luis: Introdução a Técnico de Futebol"}
                </p>
                <p className="text-gray-700 mt-2">
                  {index === 0
                    ? "O professor João Frango é conhecido por suas aulas dinâmicas e exemplos práticos, o que torna o aprendizado mais acessível e interessante para os alunos."
                    : "Meio chato, mas é um bom professor. Tem hora que me perco nas aulas, mas no geral é bom."}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {index === 0 ? "2 comentários" : "31 comentários"}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}