"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
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
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-100">
        <div className="text-5xl font-mono font-bold text-black">
          <h1>Avaliação de</h1>
          <h1>Professores</h1>
        </div>

        <input
          id="email"
          type="text"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-20 text-black"
          placeholder="Email"
        />

        <input
          id="senha"
          type="password"
          className="w-3/4 h-12 p-2 border-[0.125rem] border-gray-300 rounded-lg focus:border-gray-500 mt-8 text-black"
          placeholder="Senha"
        />

        <section className="mt-20 flex space-x-6">
          <button
            className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
            onClick={() => router.push("/feed/Logado")}
          >
            Entrar
          </button>

          <button
            className="bg-green-300 border-[0.125rem] border-gray-500 p-2 rounded-lg hover:scale-110 duration-200 w-40 h-12 text-xl text-black"
            onClick={() => router.push("/cadastro")}
          >
            Criar Conta
          </button>
        </section>
      </div>
    </div>
  );
}
