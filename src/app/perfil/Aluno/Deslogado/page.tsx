"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HomeIcon } from '@heroicons/react/24/solid';

export default function PerfilAlunoDeslogado() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-4">
        <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 mx-5">
          <HomeIcon className="h-6 w-6 text-black" onClick={() => router.push('/feed/Deslogado')}/>
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-5"
          onClick={() => router.push('/login')}
        >
          Fazer Login
        </button>
      </div>

      <div className="w-[50%] mx-auto bg-white p-2 rounded-lg">
        <div className="flex flex-col bg-green-100 p-4 rounded-lg mb-4">
          <Image
            src="/default-profile.png"
            alt="Foto de perfil padrão"
            width={96}
            height={96}
            className="w-60 h-60 rounded-full border-4 border-green-500"
          />
          <div className="flex-1 pl-10 w-full p-5">
            <h1 className="text-2xl font-bold text-green-600 mb-0.5">Morty Gamer</h1>
            <p className="text-sm text-gray-700 mb-0.5">Ciência da Computação / Dept. Ciência da Computação</p>
            <p className="text-sm text-gray-500 mb-0.5">morty.gamer-23@xyz.edu.br</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-5 text-black">Publicações</h2>

          {/* Publicação 1 */}
          <div className="bg-customGreen p-4 rounded-lg shadow mb-4">
            <div className="flex items-center mb-3">
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
              </div>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-2">
                O professor João Frango é conhecido por suas aulas dinâmicas e exemplos práticos, 
                o que torna o aprendizado mais acessível e interessante para os alunos.
              </p>
              <p className="text-sm text-gray-500">2 comentários</p>
            </div>
          </div>

          {/* Publicação 2 */}
          <div className="bg-customGreen p-4 rounded-lg shadow mb-4">
            <div className="flex items-center mb-3">
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
              </div>
            </div>
            <div className="ml-11">
              <p className="text-gray-700 mb-2">
                Durante suas aulas, o professor João Frango incentiva os alunos a participarem ativamente, 
                promovendo discussões ricas e esclarecedoras sobre temas complexos.
              </p>
              <p className="text-sm text-gray-500">2 comentários</p>
            </div>
          </div>
        </div>

      </div>

      
    </div>
  );
}