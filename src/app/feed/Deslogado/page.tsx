"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Professor } from "@/types";

export default function FeedDeslogado() {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [filteredProfessores, setFilteredProfessores] = useState<Professor[]>([]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Função para buscar professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://localhost:4000/professors"); // Substitua pela URL correta
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
    const query = event.target.value;
    if (query.trim() === "") {
      setFilteredProfessores(professores); // Reseta a lista se vazio
      return;
    }
    const filtered = professores.filter((professor) =>
      professor.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProfessores(filtered);
  };

  // Função de ordenação
  const handleSort = (criteria: "name" | "department" | "recent" | "oldest") => {
    const sortedProfessores = [...filteredProfessores];
    if (criteria === "name") {
      sortedProfessores.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "department") {
      sortedProfessores.sort((a, b) =>
        a.department.name.localeCompare(b.department.name)
      );
    } else if (criteria === "recent") {
      sortedProfessores.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (criteria === "oldest") {
      sortedProfessores.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

      {/* Buscar Professores */}
      <div className="flex items-center my-10 justify-center">
        <div className="flex items-center justify-center px-5 py-2 w-[40%] rounded-lg shadow-lg bg-customGreen">
          <div className="flex items-center bg-white p-2 rounded-[60px] w-full justify-center">
            <input
              type="text"
              placeholder="Nome do Professor"
              className="border-0 border-b-2 border-green-50 focus:outline-none focus:border-blue-400 transition duration-400 w-full text-black"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div>
          <button
            className="bg-azulCjr text-white px-6 py-4 ml-2 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition duration-500"
            onClick={togglePopup}
          >
            Ordenar
          </button>
        </div>
        {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-bold mb-4 text-azulCjr">Ordenar por:</h3>
            <ul className="space-y-2 text-azulCjr">
              <li>
                <button
                  onClick={() => handleSort("name")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Nome
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSort("department")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Departamento
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSort("recent")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Recentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSort("oldest")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Antigos
                </button>
              </li>
            </ul>
            <button
              className="w-full mt-4 bg-customGreen text-white px-4 py-2 rounded hover:bg-hoverGreen transition duration-300"
              onClick={togglePopup}
            >
              Fechar
            </button>
          </div>
          
        </div>
      )}
      </div>

      <div className="flex  mx-auto w-[20%] max-w-[30%] max-h-[2%]">
        <button
            className="bg-azulCjr text-white px-6 py-4 ml-2 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-600 transition duration-500"
            onClick={()=>router.push("/login")}>
            Criar nova avaliação
        </button>
      </div>
      {/* Grid de Professores */}
      <section className="p-4 mx-auto max-w-screen-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
          {filteredProfessores.map((professor) => (
            <div
              key={professor.id}
              className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg cursor-pointer h-60 transform transition duration-300 hover:translate-y-[-5px] hover:shadow-xl"
              onClick={() => router.push(`/perfil/Professor/Deslogado`)}
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-4">
                <Image
                  src={professor.profilepic || "/default-profile.png"}
                  alt={`Foto de ${professor.name}`}
                  className="w-full h-full rounded-full object-cover"
                  width={80}
                  height={80}
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
      </section>
    </div>
  );
}