"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex  relative">
      <div className="ImgContainer h-full flex-1 relative">
        <Image
          src="/background-login.png"
          alt="Imagem de background da parte esquerda"
          layout="fill"
        />
      </div>

      <div className="absolute top-3 left-56 text-7xl font-mono font-bold text-white">
        <h1>Cadastro</h1>
        <h1 className="ml-4">Usuário</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-gray-100">
        <Image
          src="/default-profile.png"
          alt="Imagem de background da parte esquerda"
          width={150}
          height={150}
          className="mt-4 rounded-full"
        />
        <input
          id="nome"
          type="text"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-16 "
          placeholder="Nome"
        />

        <input
          id="email"
          type="text"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
          placeholder="Email"
        />

        <input
          id="senha"
          type="password"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
          placeholder="Senha"
        />

        <input
          id="curso"
          type="text"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
          placeholder="Curso"
        />

        <input
          id="departamento"
          type="text"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8"
          placeholder="Departamento"
        />

        <section className="mt-16">
          <button
            className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl"
            onClick={() => router.push("/feed/Logado")}
          >
            Criar Conta
          </button>
        </section>
      </div>
    </div>
  );
}
//616 x 750
