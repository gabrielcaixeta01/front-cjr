"use client";
import Image from "next/image";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { getAval } from "@/utils/page";
import { useParams } from "next/navigation";
import { useRouter } from "next/compat/router";
import ModalComentario from "@/app/modals/comentario/page";
import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createComment } from "@/utils/api";
import { Comment } from "@/types";

export default function Avaliacao() {

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [textoComment, setTextoComment]= useState("");

  const creatingComment = async (comment: Partial<Comment>) => {
    try {
      const created = await createComment(comment);
    }
    catch (error){
      console.log(error);
    }
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }
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
                        onClick= {()=>toggleModal}
                      />
                      <span className="font-sans text-[#222E50] text-[12px] font-[600] leading-[14.52px] flex pl-1 items-center"> 2 comentários</span>
                  </div>
                          {isModalOpen && (
                                      <div className="flex flex-col h-screen bg-gray-100 justify-center">
                                          <div className="h-screen  w-1/2 max-h-[58%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
                                              <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
                                                <input type="text" value={textoComment} onChange={(event)=> setTextoComment(event.target.value)} className=" text-black h-16 w-full pt-[0.5px] pl-[1rem] rounded-md bg-[#A4FED3] leading-tight focus:outline-none"/> 
                                              </div>
                                              <div className="ml-auto items-right pr-5 mt-6">
                                                <button onClick={()=> setTextoComment("")}
                                                  className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
                                                  >
                                                  Cancelar
                                              </button>
                                              <button   onClick={() => {
                                                if (textoComment ==""){
                                                  toast.error("O comentário não pode ser vazio");
                                                }
                                                else {
                                                  const newComment: Partial<Comment> ={
                                                    text:textoComment,
                                                    userId:5,
                                                    avaliacaoId: 2
                                                  }
                                                  creatingComment(newComment);
                                                  setTextoComment("");
                                                  toast.success("O comentário foi criado com sucesso", {autoClose:2200})
                                                }
                                              }}
                                              className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
                                              >
                                                  Comentar
                                              </button>
                                              </div>
                                          </div>
                                      </div>
                                
                              )
                            }                             
                        </div>
                  
                  <div className="flex pr-2">             
                    <Image
                      src="/editar.png"
                      alt="Icone de editar"
                      width={64} 
                      height={64}
                      className="w-4 h-4 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"
          
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

  )
}