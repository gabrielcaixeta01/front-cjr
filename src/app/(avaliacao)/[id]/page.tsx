"use client";
import Image from "next/image";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/compat/router";

export default function Avaliacao() {
  const router = useRouter();

  const handleNotifications = () => {
    alert("Sem notificações novas.");
  };

  const navigateToProfile = () => {
    if (router) {
      router.push("/perfil/Aluno/Logado");
    }
  };

  const navigateToLogout = () => {
    if (router) {
      router.push("/feed/Deslogado");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Cabeçalho */}
      <div className="flex justify-between w-full bg-blue-200 p-2 items-center fixed">
        <div className="pl-3">
          <Image
            src="/logounb.png"
            alt="Logo da UnB"
            width={80}
            height={80}
            className="w-20 h-10"
          />
        </div>

        <div className="flex justify-between pr-3 items-center cursor-pointer">
          <div className="pr-12">
            <button
              className="bg-azulCjr hover:bg-blue-600 mx-5 p-2 rounded-[60px] transition duration-300 ease-in-out"
              onClick={handleNotifications}
            >
              <BellIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="rounded-full">
            <Image
              src="/morty.png"
              alt="Foto de perfil"
              width={48}
              height={48}
              className="w-10 h-10 rounded-full shadow-md bg-white object-cover"
              onClick={navigateToProfile}
            />
          </div>

          <div>
            <button
              className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out mx-5"
              onClick={navigateToLogout}
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full h-screen max-w-[40%] mt-10 mx-auto bg-white rounded shadow-md">
        <div className="w-full max-w-[95%] bg-[#3EEE9A] rounded-md mt-8 flex flex-col mx-auto">
          {/* Avaliação Principal */}
          <div className="w-full max-w-[100%] flex flex-col mx-auto border-b-[1.5px] border-b-black pb-[0.7rem]">
            <div className="flex mx-auto items-center p-3 pb-1">
              <Image
                src="/morty.png"
                alt="Foto do autor"
                width={48}
                height={48}
                className="w-9 h-9 rounded-full shadow-md bg-white object-cover cursor-pointer"
                onClick={navigateToProfile}
              />
              <span
                className="font-sans text-black ml-2 text-[15px] font-[500] leading-[16.94px] hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"
                onClick={navigateToProfile}
              >
                Morty Gamer
              </span>
              <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1.5 items-center">
                · 08/04/2024, ás 21:42
              </span>
              <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1 items-center">
                · Homer Simpson
              </span>
              <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1 items-center">
                · Engenharia Química
              </span>
            </div>
            <div className="pl-[6.8rem]">
              <p className="text-[#222E50] text-[15px] font-[500] leading-[18.15px] pb-2">
                Professor bacana. Adoro quando falta!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}