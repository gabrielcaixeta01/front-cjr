/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { format } from 'date-fns';
import Image from "next/image";
import { BellIcon } from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Avaliacao, Comment, User } from "@/types";
import { findAval, fetchUserInfo, deleteAval, getOneCourse, createComment, updateAval, deleteComment, updateComment, fetchProfessorInfo } from "@/utils/api";
import { Avaliacao } from "@prisma/client";
import telaCarregamento from "@/components/telas_carregamento/avaliacao/tela_carregamento_aval"
import HeaderLogado from "@/components/headers/logado/page"
import HeaderDeslogado from '@/components/headers/deslogado/page';
import { jwtDecode } from 'jwt-decode'

export default function TelaAvaliacao() {
  
  const [profilePic, setProfilePic] = useState("/default-profile.png");
  const router = useRouter();
  const [isModalCommentOpen, setIsModalCommentOpenmentOpen] = useState(false);
  const [textoComment, setTextoComment]= useState("");
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteAvalOpen, setIsToggleDeleteAvalOpen] = useState(false);
  const [isModalDeleteCommentOpen, setIsModalDeleteCommentOpen] = useState(false);
  const [isModalEditCommentOpen, setIsModalEditCommentOpen] = useState(false);
  const [localProf, setLocalProf] = useState([])
  const [localCourse, setLocalCourse] = useState([])
  const [textoEdit, setTextoEdit] = useState("");
  const [textoEditComment, setTextoEditComment] = useState("");
  const [idCommentDeleted, setIdCommentDeleted] = useState(0);
  const [idCommentEdited, setIdCommentEdited] = useState(0);
  const {avalId} = useParams();
  const [localAval, setLocalAval] = useState<Avaliacao | null>(null);
  const [userAvalInfo, setUserAvalInfo] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<User | null> (null);
  const [isAuth, setIsAuth] = useState(false); //verifica se o usuario está logado

  useEffect(()=> {
    const verify_acess = async () =>{ 
      const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken)
      setIsAuth(true);
      const usuarioLogado : User = await fetchUserInfo(Number(decodedToken.sub));
      setUserInfo(usuarioLogado);
    }
    else{
      setUserInfo(null);
    }
  }
    verify_acess()}) 

  useEffect(()=>{
    if (!avalId) {
      toast.error("Não foi possível achar a avaliação");
      return;
    }
    const findingAval = async () =>{
      try {
        const avalFound: Avaliacao = await findAval(Number(avalId));
        setLocalAval(avalFound as Avaliacao);
      }
      catch (error){
        toast.error("Erro ao procurar avaliação", {autoClose:2200});
        router.push("/feed");
      }
    }
    findingAval();
  }, [avalId,router])

    //useEffects para inicializar a tela
    useEffect(()=> {
    if (localAval?.professorId!=null)
      findingProf(localAval.professorId)
    }, [localAval])
  
    useEffect(()=>{
      if (localAval?.courseId!=null)
      findingCourse(localAval.courseId)
    },[localAval])
  
    useEffect(() => {
      const loadUserAvalInfo = async () => {
        try {
          if (localAval?.userId!=null){
          const userData = (await fetchUserInfo(localAval.userId)) as User;
          setUserAvalInfo(userData as User)
        };
        } catch (error) {
          toast.error("Erro ao carregar as informações do usuário:", {autoClose:2200});
        } 
      };
      loadUserAvalInfo();
    }, [localAval]);
       
  const findingProf = async (id:number) => {
    try{
      if (id>0){
      const prof =await fetchProfessorInfo(id);
      setLocalProf(prof);
      }
    }
    catch(error){
      toast.error("Erro ao procurar professor")
    }
  }

  const findingCourse = async (id:number)=>{
    try{
      if (id>0){
      const course = await getOneCourse(id);
      setLocalCourse(course);
    }
    }
    catch (error){
      toast.error("Erro ao procurar curso")
    }
  }

  //função para tratar da data
  const formatData = (dataPrisma:Date) => {
    if (dataPrisma!==undefined){
      const dataFormatada = format(dataPrisma, 'dd/MM/yyyy HH:mm');
      const dataSeparada = dataFormatada.split(" ");
      const data = dataSeparada[0];
      const hora = dataSeparada[1];
      return {data,hora};
    }
    else{
      return {data:-1, hora:-1}
    }
  }

  //toggles dos modais
  const toggleModalComment = () => {
    setIsModalCommentOpenmentOpen(!isModalCommentOpen);
  }

  const toggleModalEdit = () => {
    setIsModalEditOpen(!isModalEditOpen);
  }

  const toggleDeleteAval = () => {
    setIsToggleDeleteAvalOpen(!isModalDeleteAvalOpen);
  }

  const toggleDeleteComment = ()=> {
    setIsModalDeleteCommentOpen(!isModalDeleteCommentOpen);
  }

  const toggleEditComment = () => {
    setIsModalEditCommentOpen(!isModalEditCommentOpen);
  }

  //modais usados na página
  const modalCreateComment = () =>  {
    const modal = 
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="h-screen  w-1/2 max-h-[45%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
          <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
            <textarea value={textoComment} maxLength={500} onChange={(event)=> setTextoComment(event.target.value)} className="text-black h-full  shadow-sm placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md" placeholder="Digite seu comentário aqui"> </textarea>
        </div>
        <div className="flex justify-between items-center w-[90%] mt-6">
          <span className="text-white text-base pl-1">{textoComment.length}/500</span>
        <div className="flex mr-6 items-center justify-center">
            <button
              onClick={() => {
                setTextoComment("");
                toggleModalComment();
              }}
              className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9 flex items-center justify-center"
              >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!textoComment.trim()) {
                  toast.error("O comentário não pode ser vazio", { autoClose: 2200 });
                } else {
                  const newComment: Partial<Comment> = {
                    text: textoComment,
                    userId: userInfo.id,
                    avaliacaoId: localAval.id,
                  };
                  try {
                    createComment(newComment);
                    setTextoComment("");
                    toggleModalComment();
                    toast.success("O comentário foi criado com sucesso", { autoClose: 1200 });
                    setTimeout(() => {
                      window.location.reload();
                    }, 1700);
                  } catch (error) {
                    toast.error("Erro ao criar comentário");
                  }
                }
              }}
              className="bg-[#A4FED3] text-[#2B895C] ml-1 font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px] flex items-center justify-center"
            >
              Comentar
            </button>
          </div>
        </div>
      </div>
    </div>
  return modal;
};

  const modalDeleteAval = () => {
    const modal = 
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-black pt-3 pl-6 pr-6 pb-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
          <div className="text-center mb-5 p-2">
            <p className="text-lg text-ellipsis text-white">
            Tem certeza de que deseja excluir a avaliação?
            </p>
            <p className="text-xs italic text-white"> Essa ação não poderá ser desfeita</p>
        </div>
        <div className="flex space-x-6">
          <button
            onClick={()=> {
                            toggleDeleteAval();
                            try{                                              
                              deleteAval(localAval.id);
                              toast.success("Avaliação excluída com sucesso!",{autoClose:800})
                              setTimeout(() => {
                                router.push(`/feed`);
                                }, 1100);              
                            }
                            catch(error){
                              toast.error("Erro ao excluir avaliação")
                            }
                          }
                        }
            className="bg-red-600 text-white font-semibold px-7 py-2 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 ease-in-out"
          >
            Sim 
          </button>
          <button
            onClick={()=> toggleDeleteAval()}
            className=" text-white font-semibold px-7 py-2 rounded-lg hover:bg-white border-[0.5px] border-gray-300 hover:text-black transition duration-300 ease-in-out"
          >
            Cancelar 
          </button>
        </div>
      </div>
    </div>
  return modal;
  }

  const modalEditAval = () => {
    const modal = <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="h-screen  w-1/2 max-h-[45%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
      <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
        <textarea value={textoEdit} maxLength={500} onChange={(event)=> setTextoEdit(event.target.value)} className="text-black h-full placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"> </textarea>
      </div>
      <div className="flex justify-between items-center w-[90%] mt-6">
          <span className="text-white text-base pl-1">
            {textoEdit.length}/500
          </span>
          <div className="flex mr-6 items-center justify-center">
            <button onClick={()=> 
              {setTextoEdit("");
                toggleModalEdit();
              }}
              className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9 flex items-center justify-center"
              >
              Cancelar
            </button>
            <button onClick={() => {
                if (!textoEdit.trim()){
                  toast.error("O comentário não pode ser vazio");
                }
                else {
                  setTextoEdit(textoEdit);          
                  const avalEdited: Partial <Avaliacao> = {
                    text: textoEdit,
                    isEdited:true,
                  }
                  try{
                    updateAval(avalEdited,localAval.id);
                    toggleModalEdit(); 
                    toast.success("A avaliação foi editada com sucesso", {autoClose:1100});
                    setTimeout(() => {
                    window.location.reload();
                    }, 1600);
                  }
                  catch(error){
                    toast.error("Erro ao editar avaliação", {autoClose:2200})
                  }                                  
                }
              }}
              className="bg-[#A4FED3] text-[#2B895C] ml-1 font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px] flex items-center justify-center"
              >
                Editar
              </button>
          </div>
        </div>
      </div>
    </div>
    return modal;                          
  }

  const modalEditComment = (commentId:number) => {
    const modal = 
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="h-screen  w-1/2 max-h-[45%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
        <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
          <textarea value= {textoEditComment} maxLength={500} onChange={(event)=> setTextoEditComment(event.target.value)} className="text-black h-full placeholder-black mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"> </textarea>
        </div>
        <div className="flex justify-between items-center w-[90%] mt-6">
          <span className="text-white text-base pl-1">
            {textoEditComment.length}/500
          </span>
          <div className="flex mr-6 items-center justify-center">
            <button onClick={()=> 
              {setTextoEditComment("");
                toggleEditComment();
              }}
              className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
              >
              Cancelar
            </button>
            <button onClick={() => {
                if (!textoEditComment.trim()){
                  toast.error("O comentário não pode ser vazio");
                }
                else {
                  setTextoEditComment(textoEditComment);          
                  const commentEdited: Partial <Comment> = {
                    text: textoEditComment,
                  }
                  try{
                    if (commentId>0){
                      updateComment(commentEdited, commentId);
                      toast.success("Comentário editado com sucesso!",{autoClose:900});
                      setTimeout(() => {
                        window.location.reload();
                      }, 1350);
                    }
                  }
                  catch(error){
                    toast.error("Erro ao editar comentário", {autoClose:2200})
                  }                                  
                }
              }}
              className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px] ml-2"
              >
                Editar
            </button>
          </div>
        </div>
      </div>
    </div>
    return modal;  
  }

  const modalDeleteComment = (commentId:number) => {
    const modal = 
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-black pt-3 pl-6 pr-6 pb-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
          <div className="text-center mb-5 p-2">
            <h1 className="text-3xl font-bold text-white mb-4">
            </h1>
            <p className="text-lg text-ellipsis text-white"> Tem certeza de que deseja excluir o comentário? </p>
            <p className="text-xs italic text-white"> Essa ação não poderá ser desfeita</p>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={()=> {
                toggleDeleteComment();
                try{
                  if (commentId>0){                                              
                    deleteComment(commentId);
                    toast.success("Comentário excluído com sucesso!",{autoClose:800});
                    setTimeout(() => {
                      window.location.reload();
                    }, 1300);
                  }
                }
                catch(error){
                  toast.error("Erro ao excluir comentário",{autoClose:2200});
                }
              }}
      
              className="bg-red-600 text-white font-semibold px-7 py-2 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 ease-in-out"
            >
              Sim 
            </button>
            <button
              onClick={()=> {toggleDeleteComment()
              }}
              className=" text-white font-semibold px-7 py-2 rounded-lg hover:bg-white border-[0.5px] border-gray-300 hover:text-black transition duration-300 ease-in-out"
            >
              Cancelar 
            </button>
          </div>
        </div>
      </div>
    return modal
  }

  //tela de carregamento
  if (!localAval || !userAvalInfo) {
    return telaCarregamento;
  }

  //tela ao terminar de carregar
  return (
    <>
      <div className="flex flex-col h-screen min-h-fit overflow-y-scroll bg-gray-100">
        {isAuth && userInfo && (
          HeaderLogado(userInfo)
        )}
        {!isAuth && (
          HeaderDeslogado()
        )}
        <div className="w-full max-w-[40%]  mx-auto min-h-fit bg-white h-screen rounded shadow-md ">
            <div className=" w-full max-w-[95%] bg-[#3EEE9A] rounded-md mt-8 flex flex-col mx-auto mb-4 min-h-fit" >
                <div className=" w-full max-w-[100%] flex flex-col mx-auto border-b-[1.5px] border-b-black pb-[0.7rem] mt-2">
                    <div className="flex items-center pl-3 pb-[0.7rem] mt-2">
                        <div className="pl-1">
                            <Image
                            src={userAvalInfo.profilepic || profilePic} //caso a foto de perfil do usuário seja null, é colocada uma foto de perfil padrão
                            alt="Foto de perfil"
                            width={48}
                            height={48}
                            className="w-9 h-9 rounded-full shadow-md bg-white object-cover cursor-pointer"
                            onClick={() => router.push(`/user/aluno/${userAvalInfo.id}`)}
                            />         
                        </div>
                        <div className='flex ml-3 items-center'>
                            <span className="font-sans text-black text-[15px] font-[500] leading-[16.94px]  hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer" onClick={()=> router.push(`/user/aluno/${userAvalInfo.id}`)}>{userAvalInfo.name}</span>
                            <span className="font-sans text-[#71767B] text-[12px] leading-[16.94px] flex ml-[6px] mr-[3px] font-bold"> · </span>
                            <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex">{formatData(localAval.updatedAt).data}, às {formatData(localAval.updatedAt).hora}</span>
                            <span className="font-sans text-[#71767B] text-[12px] font-bold leading-[16.94px] flex ml-[3px] mr-[3px]"> · </span>
                            <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex">{localProf.name} </span>
                            <span className="font-sans text-[#71767B] text-[12px] font-bold leading-[16.94px] flex ml-[3px] mr-[3px]"> · </span>
                            <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex">{localCourse.name}</span>
                        </div>
                    </div>
                    <div className='flex flex-col ml-[4.25rem]'>
                        <div>
                            <div>
                                <p className="text-[#222E50] text-[15px] font-[500] leading-[18.15px] pb-2 pr-4 whitespace-pre-wrap overflow-wrap: break-words break-word white-space: normal max-width: 100%">{localAval.text}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex">
                              {isAuth && (
                                <Image
                                src="/comente.png"
                                alt="Comentários"
                                width={48}
                                height={48}
                                className="w-6 h-6 rounded-full shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110  ease-in-out cursor-pointer"
                                onClick= {()=>toggleModalComment()}
                                />
                              )} 
                              {!isAuth && (<Image
                                    src="/comente.png"
                                    alt="Comentários"
                                    width={48}
                                    height={48}
                                    className="w-6 h-6 rounded-full shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110  ease-in-out cursor-pointer"
                                    onClick= {()=>router.push("/login")}
                                    />
                                )}

                              {localAval.comments?.length===0 && (
                                <span className="font-sans text-[#222E50] text-[12px] font-[600] leading-[14.52px] flex pl-1 items-center"> 
                                  Nenhum comentário
                                </span>                                     
                              )}
                              {localAval.comments?.length===1 && (
                                <span className="font-sans text-[#222E50] text-[12px] font-[600] leading-[14.52px] flex pl-1 items-center"> 
                                  1 comentário
                                </span>                                     
                              )}
                              {localAval.comments && localAval.comments?.length>1 && (
                                <span className="font-sans text-[#222E50] text-[12px] font-[600] leading-[14.52px] flex pl-1 items-center"> 
                                  {localAval.comments?.length} comentários
                                </span>                                     
                              )}
                            </div>
                            {userInfo && localAval.userId===userInfo.id && (
                                <div className="flex pr-2">             
                                    <Image
                                    src="/editar.png"
                                    alt="Editar avaliação"
                                    width={64} 
                                    height={64}
                                    onClick = {()=> {toggleModalEdit(); setTextoEdit(localAval.text)}}
                                    className="w-4 h-4 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110 ease-in-out cursor-pointer"   
                                    />  
                                    <Image
                                    src="/lixeira.png"
                                    alt="Excluir avaliação"
                                    width={64} 
                                    height={64}
                                    onClick = {()=> toggleDeleteAval()}
                                    className="w-4 h-4 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110  ease-in-out cursor-pointer"
                                    />   
                                </div>
                                )}
                                {isModalCommentOpen && (
                                modalCreateComment()                           
                                )}
                                {isModalDeleteAvalOpen && (
                                modalDeleteAval()
                                )}
                                {isModalEditOpen && (
                                modalEditAval()
                                )}                             
                        </div>  
                    </div>
                </div>
                    <div className="mt-3 w-full max-w-[70%] flex flex-col mx-auto  mb-4 justify-center">
                        {localAval.comments?.map((comentario, index)=> (                       
                            <div key={comentario.id} className='mt-1'>
                            <div  className="flex mx-left mb-[0.2rem] items-center"> 
                            <div className="items-center">
                                <Image
                                src={comentario.user?.profilepic || profilePic}
                                alt="Foto de perfil"
                                width={48}
                                height={48}
                                className="w-7 h-7 rounded-full shadow-md bg-white object-cover cursor-pointer"
                                onClick={() => router.push(`/user/aluno/${comentario.userId}`)}
                                />
                            </div>
                            <span onClick= {()=> router.push(`/user/aluno/${comentario.userId}`)} className="font-sans text-black ml-2 text-[13px] font-[500] leading-[15.73px] text-center items-center hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"> 
                                {comentario.user?.name} 
                            </span> 
                            <span className="font-sans text-[#71767B] pl-2 text-[13px] font-[350] leading-[15.73px] text-center items-center"> 
                                · {formatData(comentario.updatedAt).data}, ás {formatData(comentario.updatedAt).hora}  
                            </span>  
                            {userInfo && comentario.userId===userInfo.id && (
                                <div className="ml-auto flex flex-row">
                                <Image
                                    src="/editar.png"
                                    alt="Editar comentário"
                                    width={64} 
                                    height={64}
                                    onClick={()=> {
                                    setIdCommentEdited(comentario.id);
                                    setTextoEditComment(comentario.text);
                                    toggleEditComment();
                                    }}
                                    className="w-4 h-4 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110 ease-in-out cursor-pointer"   
                                />
                                <Image
                                    src="/lixeira.png"
                                    alt="Excluir comentário"
                                    width={64} 
                                    height={64}
                                    onClick = {()=> {
                                    setIdCommentDeleted(comentario.id); 
                                    toggleDeleteComment();
                                    }}
                                    className="w-4 h-4 object-cover shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110  ease-in-out cursor-pointer">
                                </Image>
        
                                {isModalDeleteCommentOpen && (
                                    modalDeleteComment(idCommentDeleted)
                                )}
                                {isModalEditCommentOpen && (
                                    modalEditComment(idCommentEdited)
                                )}       
                                </div>    
                            )}               
                            </div>
                            <div className="pl-[2.3rem] break-words"> 
                                <p className="text-[#222E50] text-[14px] text-[500] leading-[16.94px] pb-2 whitespace-pre-wrap overflow-wrap: break-words break-word white-space: normal">{comentario.text}</p>
                            </div>
                            {index !== localAval.comments.length - 1 && (
                            <div className="border-b border-[#71767B] w-full mb-[0.75rem]"></div>
                            )}
                        </div>
                            ))
                        }
                </div>
            </div>
        </div>     
      </div>
    </>
  )
}