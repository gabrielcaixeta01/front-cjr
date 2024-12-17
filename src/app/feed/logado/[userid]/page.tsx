"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Importação corrigida
import { toast } from "react-toastify";
import { fetchUserInfo } from "@/utils/api";
import { User, Professor } from "@/types";
import { BellIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";


export default function FeedLogado() {
  const router = useRouter();
  const { userid } = useParams();
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Carrega as informações do usuário
  useEffect(() => {
    if (!userid) return;
    const loadUserInfo = async () => {
      try {
        const userData = await fetchUserInfo(Number(userid));
        setUserInfo(userData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    loadUserInfo();
  }, [userid]);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Função para buscar professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/professors"); // URL corrigida
        setProfessores(response.data as Professor[]);
        setFilteredProfessores(response.data as Professor[]);
      } catch (error) {
        toast.error("Erro ao buscar professores.");
        console.error("Erro ao buscar professores:", error);
      }
    };
    fetchProfessores();
  }, []);

  // Função de busca
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const query = event.target.value.toLowerCase();
    setFilteredProfessores(
      query
        ? professores.filter((prof) =>
            prof.name.toLowerCase().includes(query)
          )
        : professores
    );
  };

  // Função de ordenação
  const handleSort = (criteria: "name" | "department" | "recent" | "oldest") => {
    const sortedProfessores = [...filteredProfessores];
    if (criteria === "name") {
      sortedProfessores.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "department") {
      sortedProfessores.sort((a, b) =>
        (a.department?.name ?? "").localeCompare(b.department?.name ?? "")
      );
    } else if (criteria === "recent") {
      sortedProfessores.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    } else if (criteria === "oldest") {
      sortedProfessores.sort(
        (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
      );
    }
    setFilteredProfessores(sortedProfessores);
    setIsPopupOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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
              onClick={() => router.push(`/feed/logado/${userid}`)}
            />
            <div className="flex items-center space-x-5 mr-10">
              <button
                className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
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
                onClick={() => router.push(`/user/aluno/${userid}`)}
              />
              <button
                className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                onClick={() => router.push("/feed/deslogado")}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Buscar Professores */}
      <div className="flex justify-center my-5">
        <input
          type="text"
          placeholder="Buscar professor"
          onChange={handleSearch}
          className="p-3 rounded-lg shadow w-1/2"
        />
        <button
          className="ml-3 px-4 py-2 bg-azulCjr text-white rounded hover:bg-blue-600"
          onClick={togglePopup}
        >
          Ordenar
        </button>
      </div>

      {/* Pop-up de Ordenação */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="font-semibold mb-4">Ordenar por:</h3>
            <button onClick={() => handleSort("name")} className="block mb-2">
              Nome
            </button>
            <button onClick={() => handleSort("department")} className="block mb-2">
              Departamento
            </button>
            <button onClick={() => handleSort("recent")} className="block mb-2">
              Mais Recentes
            </button>
            <button onClick={() => handleSort("oldest")} className="block mb-2">
              Mais Antigos
            </button>
            <button onClick={togglePopup} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Grid de Professores */}
      <section className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProfessores.map((professor) => (
          <div
            key={professor.id}
            className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
            onClick={() => router.push(`/user/professor/${professor.id}`)}
          >
            <Image
              src={professor.profilepic || "/default-profile.png"}
              alt={professor.name}
              width={80}
              height={80}
              className="rounded-full mx-auto"
            />
            <h3 className="text-center font-semibold mt-2">{professor.name}</h3>
            <p className="text-center text-gray-500 text-sm">
              {professor.department?.name || "Departamento não informado"}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}