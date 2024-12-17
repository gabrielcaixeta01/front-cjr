"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Professor } from "@/types";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function ProfessorLogado() {
  const { professorid } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [professorInfo, setProfessorInfo] = useState<Professor | null>(null);
  const [openComments, setOpenComments] = useState<number | null>(null);

  // Busca ID do usuário logado (simulação)
  

  // Busca informações do professor
  useEffect(() => {
    const loadProfessor = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/professors/${professorid}`);
        setProfessorInfo(response.data as Professor);
      } catch (error) {
        console.error("Erro ao carregar informações do professor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (professorid) loadProfessor();
  }, [professorid]);

  if (loading) return <div>Carregando...</div>;
  if (!professorInfo) return <div>Professor não encontrado.</div>;

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
              onClick={() => router.push("/feed/Logado")} // Redireciona para o feed
            />
            <div className="flex items-center space-x-5 mr-10">
              <button
                className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                onClick={() => router.push("/login")}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

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

        <section className="p-4 bg-white">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-black mb-2">
              {professorInfo.name}
            </h1>
            <p className="text-sm text-gray-700">
              Departamento: {professorInfo.department?.name || "Não informado"}
            </p>
            <p className="text-sm text-gray-700">
              Cursos:{" "}
              {professorInfo.courses
                ? professorInfo.courses.map((c) => c.name).join(", ")
                : "Nenhum curso associado"}
            </p>
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
                       {/* Foto do Autor */}
                       <div className="flex items-start justify-center w-16 h-16 mr-2">
                         <Image
                           src={avaliacao.user?.profilepic || "/default-profile.png"}
                           alt="Foto do autor"
                           width={64}
                           height={64}
                           className="w-12 h-12 object-cover rounded-full bg-white"
                         />
                       </div>
       
                       {/* Detalhes da Avaliação */}
                       <div className="max-w-[550px]">
                         {/* Nome do Autor */}
                         <p className="font-bold text-gray-800">
                           {avaliacao.user?.name || "Usuário desconhecido"}
                         </p>
       
                         {/* Data e Curso */}
                         <p className="text-sm text-gray-500">
                           {new Date(avaliacao.createdAt || "").toLocaleDateString()} -{" "}
                           {avaliacao.course?.name || "Curso desconhecido"}
                         </p>
       
                         {/* Texto da Avaliação */}
                         <p className="text-gray-700 mt-2">{avaliacao.text}</p>
       
                         {/* Comentários */}
                         {avaliacao.comments && avaliacao.comments.length > 0 && (
                           <div className="mt-2">
                             {/* Botão para mostrar/ocultar comentários */}
                             <button
                               className="text-gray-500 text-sm font-medium cursor-pointer mb-2"
                               onClick={() =>
                                 setOpenComments((prev) =>
                                   prev === avaliacao.id ? null : avaliacao.id
                                 )
                               }
                             >
                               {openComments === avaliacao.id
                                 ? "Ocultar comentários"
                                 : `Ver comentários (${avaliacao.comments.length})`}
                             </button>
       
                             {/* Lista de Comentários */}
                             {openComments === avaliacao.id &&
                               avaliacao.comments.map((comment) => (
                                 <div
                                   key={comment.id}
                                   className="bg-gray-100 rounded-[50px] text-sm p-4 mt-1"
                                 >
                                   {/* Nome e Foto do Usuário do Comentário */}
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
                                   <p className="text-gray-600 text-sm mt-1">
                                     {comment.text}
                                   </p>
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