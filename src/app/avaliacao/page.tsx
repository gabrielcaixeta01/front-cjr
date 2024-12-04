"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/solid";


export default function Avaliacao() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
          <div className="flex justify-between w-full bg-customGreen p-2 items-center fixed">
            <div className= "pl-3">
            <Image
                src="/logounb.png"
                alt="Logo da UnB"
                width={80}
                height={80}
                className="w-20 h-10 "
            />
            </div>

            <div className="flex justify-between pr-3 items-center cursor-pointer"> 
              <div className="pr-12">
                <button
                className="bg-white hover:bg-blue-600 mx-5 p-2 rounded-[60px] transition duration-300 ease-in-out"
                onClick={() => alert("Sem notificações novas.")}
                >
                <BellIcon className="h-6 w-6 text-black" /> 
                </button>
              </div>

              <div className="rounded-full">
                <Image
                  src="/morty.png"
                  alt="Foto de perfil"
                  width={48}
                  height={48}
                  className="w-10 h-10 rounded-full shadow-md bg-white object-cover"
                  onClick={() => router.push("/perfil/Aluno/Logado")}
                />
              </div>

              <div> 
                <button
                className="bg-white hover:bg-blue-600 mx-5 p-2 rounded-[60px] transition duration-300 ease-in-out"
                onClick={() => router.push("/login")}
                >
                  <Image
                  src="/sair.png"
                  alt= "Aperte para sair"
                  width={40}
                  height={40}
                  className="h-6 w-6 text-white"
                  >
                  </Image>
              </button>
              </div>
            </div>
          </div>
        <div className="w-full h-screen max-w-[40%] mt-10 mx-auto bg-white rounded shadow-md ">
          <div className=" w-full max-w-[90%] bg-[#3EEE9A] rounded-md mt-8 flex flex-col mx-auto">
              <div className=" w-full max-w-[100%] flex flex-col mx-auto border-b-2 border-b-black">
                <div className="flex mx-auto items-center p-3 ">
                    <div className="pl-1 items-center">
                    <Image
                      src="/morty.png"
                      alt="Foto de perfil"
                      width={48}
                      height={48}
                      className="w-8 h-8 rounded-full shadow-md bg-white object-cover"
                      onClick={() => router.push("/perfil/Aluno/Logado")}
                    />
                    </div>
                    <span className="font-sans text-black pl-2 text-[15px] font-[500] items-center"> Morty Gamer </span>
                    <span className="font-sans text-[#71767B] text-[12px] font-[350] flex pl-1.5 items-center"> .08/04/2024, ás 21:42 </span>
                    <span className="font-sans text-[#71767B] text-[12px] font-[350] flex pl-1 items-center"> .Homer Simpson </span>
                    <span className="font-sans text-[#71767B] text-[12px] font-[350] flex pl-1 items-center"> .Engenharia Química </span>
                </div>
                <div className="pl-[6rem]"> 
                  <p className="text-black text-[15px] text-[500] pb-2"> Professor bacana. Adoro quando falta! </p>
                </div>
              </div>
              <div className="w-full max-w-[70%] mx-auto pl-[1rem]">
                <p className="text-black"> teste</p>
              </div>

          </div>
        </div>
      </div>
    </>
  )
}