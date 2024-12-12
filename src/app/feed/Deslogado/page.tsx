"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Professor } from "@/types";

export default function FeedDeslogado() {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);

  // Função para buscar os professores do backend
  const fetchProfessores = async () => {
    try {
      const response = await axios.get("http://localhost:4000/professors"); // Substitua pela URL correta da sua API
      setProfessores(response.data as Professor[]); // Armazena todos os professores
      setFilteredProfessores(response.data as Professor[]); // Inicializa com todos os professores
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredProfessores(professores); // Exibe todos os professores se o campo estiver vazio
      return;
    }

    const filtered = professores.filter((professor) =>
      professor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProfessores(filtered);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  interface SortCriteria {
    criteria: "name" | "department" | "recent" | "oldest";
  }

  const handleSort = (criteria: SortCriteria["criteria"]) => {
    const sortedProfessores = [...filteredProfessores];
    if (criteria === "name") {
      sortedProfessores.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "department") {
      sortedProfessores.sort((a, b) =>
        a.department.name.localeCompare(b.department.name)
      );
    } else if (criteria === "recent") {
      sortedProfessores.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (criteria === "oldest") {
      sortedProfessores.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
              onClick={() => router.push("/feed/Deslogado")}
            />
            <div className="flex items-center space-x-5 mr-10">
              <button
                className="bg-azulCjr text-white rounded px-5 py-2 shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
                </div>
          </div>
        </div>
      </header>

      {/* Buscar e Ordenar */}
      <div className="p-4 flex items-center mb-10 justify-center">
        <div className="flex items-center bg-white p-4 rounded-[60px] w-[40%] justify-around">
          <input
            type="text"
            placeholder="Nome do Professor"
            className="border-0 border-b-2 border-green-50 focus:outline-none focus:border-blue-400 transition duration-400 px-2 py-2 w-full max-w-sm text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress} // Detecta a tecla Enter
          />
          <button
            className="bg-azulCjr text-white px-6 py-2 rounded ml-1 hover:bg-blue-600 transition duration-500"
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Todos os Professores */}
      <section className="p-4 mx-auto max-w-screen-lg">
        {/* Header */}
        <div className="flex w-full justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold text-azulUnb text-left">Professores</h2>
          <button
            className="bg-azulCjr text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-500"
            onClick={togglePopup}
          >
            Ordenar
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
          {filteredProfessores.map((professor) => (
            <div
              key={professor.id}
              className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg h-60 transform transition duration-300 hover:translate-y-[-5px] hover:shadow-xl"
            >
              <div className="w-20 h-20 bg-gray-200 border-2 border-customGreen rounded-full mb-4">
                <Image
                  src={professor.profilepic || "/default-profile.png"}
                  alt={`Foto de ${professor.name}`} // Corrigida a interpolação de string
                  className="w-full h-full rounded-full object-cover"
                  width={80} // Adicione largura para Next.js Image
                  height={80} // Adicione altura para Next.js Image
                />
              </div>
              <h2 className="font-semibold text-lg text-center text-azulCjr">
                {professor.name}
              </h2>
              <h3 className="text-black text-sm text-center">
                {professor.department.name}
              </h3>
              <p className="text-gray-500 text-xs text-center truncate max-w-[12rem]">
                {professor.courses.map((course) => course.name).join(", ")}
              </p>
            </div>
          ))}
        </div>

        {/* Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-80">
              <h3 className="text-lg font-bold mb-4 text-azulCjr">Ordenar por:</h3>
              <ul className="space-y-2 text-azulCjr">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    Nome
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => handleSort("department")}
                  >
                    Departamento
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => handleSort("recent")}
                  >
                    Mais Recentes
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => handleSort("oldest")}
                  >
                    Mais Antigos
                  </button>
                </li>
              </ul>
              <button
                className="w-full mt-4 bg-customGreen text-azulCjr px-4 py-2 rounded hover:bg-hoverGreen hover:text-white transition duration-500"
                onClick={togglePopup}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
)}
