"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PerfilAlunoLogado() {
  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    foto: '',
    departamento: '',
    curso: '',
  });

  useEffect(() => {
    // Função para buscar os dados do perfil
    async function fetchPerfil() {
      try {
        const response = await fetch('/api/perfil'); // URL da API
        const data = await response.json();
        setPerfil(data); // Atualiza o estado com os dados do perfil
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    }

    fetchPerfil();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Header do perfil */}
      <div className="flex items-center bg-green-100 p-4 rounded-lg mb-6">
        <Image
          src={perfil.foto || '/default-profile.png'} // Foto de perfil ou uma padrão
          alt="Foto de perfil"
          width={96} // Tamanho da imagem (96px)
          height={96}
          className="w-24 h-24 rounded-full border-4 border-green-500"
        />
        <div className="flex-1 ml-4">
          <h1 className="text-2xl font-bold text-green-600">{perfil.nome || 'Carregando...'}</h1>
          <p className="text-sm text-gray-700">{perfil.curso}</p>
          <p className="text-sm text-gray-500">{perfil.departamento}</p>
          <p className="text-sm text-gray-500">{perfil.email}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Editar Perfil
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Excluir Perfil
          </button>
        </div>
      </div>

      {/* Placeholder para publicações */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Publicações</h2>
        <p className="text-gray-500">Carregar publicações...</p>
      </div>
    </div>
  );
}