"use client";
import Image from "next/image";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { getAval } from "@/utils/page";
import { useParams } from "next/navigation";
import { useRouter } from "next/compat/router";
import ModalComentario from "@/components/comentario/page";
import { useState } from "react";

export default function Avaliacao() {

  const router = useRouter();
  const [createComment, setCreateComment] = useState(false);

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-100">
        {/*{createComment ? <ModalComentario> </ModalComentario> : <p></p>}*/}
          <div className="flex justify-between w-full bg-blue-200 p-2 items-center fixed">
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
                  className="bg-azulCjr hover:bg-blue-600 mx-5 p-2 rounded-[60px] transition duration-300 ease-in-out"
                onClick={() => alert("Sem notificações novas.")}
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
                  onClick={() => router.push("/perfil/Aluno/Logado")}
                />
              </div>

              <div> 
                <button
                  className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out mx-5"
                  onClick={() => router.push("/feed/Deslogado")}
                  >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
              </button>
              </div>
            </div>
          </div>
        <div className="w-full h-screen max-w-[40%] mt-10 mx-auto bg-white rounded shadow-md ">
          <div className=" w-full max-w-[95%] bg-[#3EEE9A] rounded-md mt-8 flex flex-col mx-auto">
              <div className=" w-full max-w-[100%] flex flex-col mx-auto border-b-[1.5px] border-b-black pb-[0.7rem]">
                <div className="flex mx-auto items-center p-3 pb-1 ">
                    <div className="pl-1 items-center">
                    <Image
                      src="/morty.png"
                      alt="Foto de perfil"
                      width={48}
                      height={48}
                      className="w-9 h-9 rounded-full shadow-md bg-white object-cover cursor-pointer"
                      onClick={() => router.push("/perfil/Aluno/Logado")}
                    />
                    </div>
                    <span className="font-sans text-black ml-2 text-[15px] font-[500] leading-[16.94px] items-center hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer" onClick={()=> router.push("/perfil/Aluno/Logado")}> Morty Gamer </span>
                    <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1.5 items-center"> · 08/04/2024, ás 21:42 </span>
                    <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1 items-center"> · Homer Simpson </span>
                    <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1 items-center"> · Engenharia Química </span>
                </div>
                <div className="pl-[6.8rem]"> 
                  <p className="text-[#222E50] text-[15px] font-[500] leading-[18.15px] pb-2"> Professor bacana. Adoro quando falta! </p>
                </div>
                <div className="flex items-center justify-between pl-[6.5rem]">
                  <div className="flex"> 
                    <Image
                        src="/comente.png"
                        alt="Comentários"
                        width={48}
                        height={48}
                        className="w-6 h-6 rounded-full shadow-md"
                        onClick= {()=> setCreateComment(true)}
                      />
                      <span className="font-sans text-[#222E50] text-[12px] font-[600] leading-[14.52px] flex pl-1 items-center"> 2 comentários</span>
                  </div>
                  <div className="flex pr-2">
                    {/*<button className=" hover:bg-blue-600 rounded-[60px] transition duration-300 ease-in-out"> 
                      <TrashIcon className="text-black h-4 w-4"/> 
                      </button>*/}              
                    <Image
                      src="/editar.png"
                      alt="Icone de editar"
                      width={64} 
                      height={64}
                      className="w-4 h-4 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"
                      onClick= {()=> <ModalComentario> </ModalComentario>}
                    />
                      
                    <Image
                      src="/lixeira.png"
                      alt="Icone de editar"
                      width={64} 
                      height={64}
                      className="w-4 h-4 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"
                    />   
                  </div>

                </div>
                
              </div>
              <div className=" pt-[1rem] w-full max-w-[70%] flex flex-col mx-auto border-b-[1.6px] border-b-gray-300 mb-2 justify-center">
                <div className="flex mx-left pb-[0.2rem] items-center">         
                  <div className="items-center">
                      <Image
                        src="/gabigol.jpg"
                        alt="Foto de perfil"
                        width={48}
                        height={48}
                        className="w-7 h-7 rounded-full shadow-md bg-white object-cover cursor-pointer"
                        onClick={() => router.push("/perfil/Aluno/Logado")}
                      />
                  </div>
                  <span className="font-sans text-black ml-2 text-[13px] font-[500] leading-[15.73px] text-center items-center hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"> El Gabi </span> 
                  <span className="font-sans text-[#71767B] pl-2 text-[13px] font-[350] leading-[15.73px] text-center items-center"> · 08/04/2024, ás 21:43  </span>                                   
                </div>
                <div className="pl-[2.3rem]"> 
                  <p className="text-[#222E50] text-[14px] text-[500] leading-[16.94px] pb-2"> Vou pro Cruzeiro! </p>
                </div>
              </div>
              <div className="pt-[0.3rem] w-full max-w-[70%] flex flex-col mx-auto mb-2 justify-center">
                <div className="flex mx-left mb-[0.2rem] items-center">         
                  <div className="items-center">
                      <Image
                        src="/felipeluis.jpeg"
                        alt="Foto de perfil"
                        width={48}
                        height={48}
                        className="w-7 h-7 rounded-full shadow-md bg-white object-cover cursor-pointer"
                        onClick={() => router.push("/perfil/Aluno/Logado")}
                      />
                  </div>
                  <span className="font-sans text-black ml-2 text-[13px] font-[500] leading-[15.73px] text-center items-center hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"> Guardiola Cabeludo </span> 
                  <span className="font-sans text-[#71767B] ml-2 text-[13px] font-[350] leading-[15.73px] text-center items-center"> · 08/04/2024, ás 21:43  </span>                                   
                </div>
                <div className="pl-[2.3rem]"> 
                  <p className="text-[#222E50] text-[14px] text-[500] leading-[16.94px] mb-2 "> Entreguei pro criciuma nassaum  </p>
                </div>
              </div>

          </div>
        </div>
      </div>
    </>
  )
}