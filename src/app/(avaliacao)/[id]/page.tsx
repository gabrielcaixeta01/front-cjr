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
import { findAval, fetchUserInfo, getOneProf, deleteAval, getOneCourse, createComment, updateAval, deleteComment, updateComment } from "@/utils/api";
import { Avaliacao } from "@prisma/client";
import { text } from 'stream/consumers';

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
  const [loading, setLoading] = useState(true);
  const [idCommentDeleted, setIdCommentDeleted] = useState(0);
  const [idCommentEdited, setIdCommentEdited] = useState(0);
  const [lengthComment, setLengthComment] = useState(textoComment.length)

  const [localAval, setLocalAval] = useState<Avaliacao>({
      id: 0,
      userId: 1,
      professorId: 0,
      text: "",
      courseId:0,
      comments:[],
      createdAt: undefined,
      updatedAt: undefined
    });

    const [userAvalInfo, setUserAvalInfo] = useState<User>({
      id: 0,
      name: "",
      email: "",
      password: "",
      program: { id: 0, name: "Carregando..." },
      profilepic: "/default-profile.png",
      avaliacoes: [],
    });

    const [userInfo, setUserInfo] = useState<User> (
      {
        id:0,
        name: "",
        email:"",
        password:"",
        program: { id: 0, name: "Carregando..." },
        profilepic: "/default-profile.png",
        avaliacoes: [],
      }
    );

  const {id} = useParams();

  //funções para achar objetos de acordo com os ids
  const findingAval = async () =>{
    try {
      const avalFound = (await findAval(8)) as Avaliacao;
      setLocalAval({
        id: avalFound.id || 2,
        text: avalFound.text || "",
        userId: avalFound.userId ||1,
        professorId: avalFound.professorId || 1,
        courseId: avalFound.courseId || 2,
        comments: avalFound.comments || [],
        createdAt: avalFound.createdAt,
        updatedAt: avalFound.updatedAt
      })
    }
    catch (error){
      toast.error("Erro ao procurar avaliação", {autoClose:2200})
    }
    
  }

  const findingProf = async (id:number) => {
    try{
      if (id>0){
      const prof =await getOneProf(id);
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
            <textarea value={textoComment} maxLength={500} onChange={(event)=> {setTextoComment(event.target.value); setLengthComment(event.target.value.length)}} className="text-black h-full  shadow-sm placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md" placeholder="Digite seu comentário aqui"> </textarea>
        </div>
          <div className="ml-auto items-right mr-6 mt-6">
            <button onClick={()=> {setTextoComment(""); toggleModalComment(); setLengthComment(textoComment.length)}}
              className="bg-transparent rounded-lg hover:scale-110  duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
              >
              Cancelar
            </button>
            <button   onClick={() => {
              if (textoComment ===""){
                toast.error("O comentário não pode ser vazio", {autoClose:2200});
              }
              else {
                const newComment: Partial<Comment> ={
                text:textoComment,
                userId:userAvalInfo.id,
                avaliacaoId: localAval.id
                }
                try {
                  createComment(newComment);
                  setTextoComment("");
                  setLengthComment(textoComment.length);
                  toggleModalComment();
                  window.location.reload()
                  toast.success("O comentário foi criado com sucesso", {autoClose:2200})}
                catch (error){
                  toast.success("Erro ao criar comentário")
                }
              }
            }}
            className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
            >
                Comentar
            </button>
          </div>
      </div>
    </div>     
    return modal;              
  }

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
                              router.push("/feed/Logado")
                              toast.success("Avaliação excluída com sucesso!",{autoClose:2200})}
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
    <div className="h-screen  w-1/2 max-h-[47%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
      <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
        <textarea value={textoEdit} onChange={(event)=> setTextoEdit(event.target.value)} className="text-black h-full placeholder-black placeholder-opacity-50 mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"> </textarea>
      </div>
      <div className="ml-auto items-right mr-6 mt-6">
        <button onClick={()=> 
          {setTextoEdit("");
            toggleModalEdit();
          }}
          className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
          >
          Cancelar
        </button>
        <button onClick={() => {
            if (textoEdit===""){
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
                toast.success("A avaliação foi editada com sucesso", {autoClose:2200});
                window.location.reload()
                toggleModalEdit(); }
              catch(error){
                toast.error("Erro ao editar avaliação", {autoClose:2200})
              }                                  
            }
          }}
                className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
                >
                Editar
          </button>
        </div>
        <div className="flex mr-auto ml-4 items-left justify-start">
          <Image
            src="/lixeira.png"
            alt="Excluir"
            width={100} 
            height={100}
            className="w-8 h-8 mb-2 object-cover mx-2 shadow-md hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"
          />   
        </div>
      </div>
    </div>
    return modal;                          
  }

  const modalEditComment = (commentId:number) => {
    const modal = 
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="h-screen  w-1/2 max-h-[47%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
        <div className="flex flex-col h-[12rem] w-[90%] bg-[#A4FED3] mt-[2rem] rounded-md">
          <textarea value= {textoEditComment} onChange={(event)=> setTextoEditComment(event.target.value)} className="text-black h-full placeholder-black mt-2 pt-[2px] border-none pl-[1rem] bg-[#A4FED3] leading-tight focus:outline-none w-full p-2 resize-none overflow-y-auto  border rounded-md"> </textarea>
        </div>
        <div className="ml-auto items-right mr-6 mt-6">
          <button onClick={()=> 
            {setTextoEditComment("");
              toggleEditComment();
            }}
            className="bg-transparent rounded-lg hover:scale-110 duration-200 w-20 h-10 text-xl text-[23px] font-400 leading-[54.46px] mr-9"
            >
            Cancelar
          </button>
          <button onClick={() => {
              if (textoEditComment===""){
                toast.error("O comentário não pode ser vazio");
              }
              else {
                setTextoEditComment(textoEditComment);          
                const commentEdited: Partial <Comment> = {
                  text: textoEditComment,
                }
                try{
                  if (commentId>0){
                    updateComment(commentEdited,commentId);
                    toast.success("A avaliação foi editada com sucesso", {autoClose:2200});
                    window.location.reload();
                    toggleEditComment(); 
                  }
                }
                catch(error){
                  toast.error("Erro ao editar avaliação", {autoClose:2200})
                }                                  
              }
            }}
            className="bg-[#A4FED3] text-[#2B895C] font-400 text-[20px] rounded-lg hover:scale-110 duration-200 w-32 h-10 text-xl leading-[42.36px]  mr-10 ml-2"
            >
              Editar
            </button>
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
            <p className="text-lg text-ellipsis text-white">
              Tem certeza de que deseja excluir o comentário?
            </p>
            <p className="text-xs italic text-white"> Essa ação não poderá ser desfeita</p>
          </div>
          <div className="flex space-x-6">
            <button
              onClick={()=> {
                toggleDeleteComment();
                try{
                  if (commentId>0){                                              
                  deleteComment(commentId);
                  window.location.reload();
                  toast.success("Comentário excluído com sucesso!",{autoClose:2200})}}
                catch(error){
                  toast.error("Erro ao excluir comentário",{autoClose:2200})
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


  //useEffects para inicializar a tela
  useEffect (()=>{
    findingAval()
  },[])

  useEffect(()=> {
    findingProf(localAval.professorId)
  }, [localAval.professorId])

  useEffect(()=>{
    findingCourse(localAval.courseId)
  },[localAval.courseId])

  useEffect(() => {
    const loadUserAvalInfo = async () => {
      try {
        const userData = (await fetchUserInfo(localAval.userId)) as User;
        setUserAvalInfo({
          id: userData.id || 0,
          name: userData.name || "",
          email: userData.email || "",
          password: userData.password || "",
          program: userData.program || { id: 0, name: "Carregando..." },
          profilepic: userData.profilepic || "/default-profile.png",
          avaliacoes: userData.avaliacoes || [],
        });
      } catch (error) {
        toast.error("Erro ao carregar as informações do usuário:", {autoClose:2200});
      } 
    };
    loadUserAvalInfo();
  }, [localAval.userId]);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = (await fetchUserInfo(8)) as User;
        setUserInfo({
          id: userData.id || 0,
          name: userData.name || "",
          email: userData.email || "",
          password: userData.password || "",
          program: userData.program || { id: 0, name: "Carregando..." },
          profilepic: userData.profilepic || "/default-profile.png",
          avaliacoes: userData.avaliacoes || [],
        });
      } catch (error) {
        toast.error("Erro ao carregar as informações do usuário:", {autoClose:2200});
      } 
      finally{
        setLoading(false);
      }
    };
    loadUserInfo();
  }, []);


  //tela de carregamento
  if (loading) {
    return       <div className="flex flex-col h-screen min-h-screen overflow-y-scroll bg-gray-100">
      <header className="flex justify-between bg-customGreen pb-1 items-center mb-2">
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
                         className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
                         onClick={() => toast.info("Sem notificações novas.")}
                       >
                         <BellIcon className="h-6 w-6 text-white" />
                       </button>
                       <Image
                         src={profilePic}
                         alt="Foto de perfil"
                         width={48}
                         height={48}
                         className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
                         onClick={() => router.push("/perfil/Aluno/Logado")}
                       />
                       <button
                         className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                         onClick={() => router.push("/feed/Deslogado")}
                       >
                         <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
                       </button>
                     </div>
                   </div>
                 </div>
            </header>
            <div className='w-full max-w-[40%] mx-auto bg-white h-screen rounded shadow-md'>
            </div>
                  </div>
  }

  //tela ao terminar de carregar
  return (
    <>
      <div className="flex flex-col h-screen min-h-fit overflow-y-scroll bg-gray-100">
               <header className="flex justify-between bg-customGreen pb-1 items-center mb-2">
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
                         className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
                         onClick={() => toast.info("Sem notificações novas.")}
                       >
                         <BellIcon className="h-6 w-6 text-white" />
                       </button>
                       <Image
                         src={profilePic}
                         alt="Foto de perfil"
                         width={48}
                         height={48}
                         className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
                         onClick={() => router.push("/perfil/Aluno/Logado")}
                       />
                       <button
                         className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                         onClick={() => router.push("/feed/Deslogado")}
                       >
                         <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
                       </button>
                     </div>
                   </div>
                 </div>
            </header>

        <div className="w-full max-w-[40%] mx-auto min-h-fit bg-white h-screen rounded shadow-md ">
          <div className=" w-full max-w-[95%] bg-[#3EEE9A] rounded-md mt-8 flex flex-col mx-auto mb-4" >
              <div className=" w-full max-w-[100%] flex flex-col mx-auto border-b-[1.5px] border-b-black pb-[0.7rem]">
                <div className="flex mx-auto items-center p-3 pb-1 ">
                  <div className="pl-1 items-center">
                    <Image
                      src={userAvalInfo.profilepic}
                      alt="Foto de perfil"
                      width={48}
                      height={48}
                      className="w-9 h-9 rounded-full shadow-md bg-white object-cover cursor-pointer"
                      onClick={() => router.push("/perfil/Aluno/Logado")}
                    />
                  </div>
                  <span className="font-sans text-black ml-2 text-[15px] font-[500] leading-[16.94px] items-center hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer" onClick={()=> router.push("/perfil/Aluno/Logado")}> {userAvalInfo.name} </span>
                  <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1.5 items-center"> · {formatData(localAval.updatedAt).data}, às {formatData(localAval.updatedAt).hora} </span>
                  <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1 items-center"> · {localProf.name} </span>
                  <span className="font-sans text-[#71767B] text-[12px] font-[350] leading-[16.94px] flex pl-1 items-center"> · {localCourse.name} </span>
                </div>
                <div className="pl-[6.8rem] max-w-[100%] break-words"> 
                  <p className="text-[#222E50] text-[15px] font-[500] leading-[18.15px] pb-2 pr-4 overflow-wrap: break-word white-space: normal max-width: 100%"> {localAval.text} </p>
                </div>
                <div className="flex items-center justify-between pl-[6.5rem]">
                <div className="flex"> 
                  <Image
                      src="/comente.png"
                      alt="Comentários"
                      width={48}
                      height={48}
                      className="w-6 h-6 rounded-full shadow-md hover:bg-blue-200 transition duration-300 hover:scale-110  ease-in-out cursor-pointer"
                      onClick= {()=>toggleModalComment()}
                    />
                    <span className="font-sans text-[#222E50] text-[12px] font-[600] leading-[14.52px] flex pl-1 items-center"> {localAval.comments?.length} comentários</span>
                  </div>
                  {localAval.userId===userInfo.id && (
                    <div className="flex pr-2">             
                      <Image
                        src="/editar.png"
                        alt="Editar avaliação"
                        width={64} 
                        height={64}
                        onClick = {()=> toggleModalEdit()}
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
              <div className="mt-3 w-full max-w-[70%] flex flex-col mx-auto  mb-4 justify-center">
                {localAval.comments?.map((comentario, index)=> (                       
                  <div key={comentario.id} className='mt-1'>
                  <div  className="flex mx-left mb-[0.2rem] items-center"> 
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
                    <span onClick= {()=> router.push("/perfil/aluno/Logado")} className="font-sans text-black ml-2 text-[13px] font-[500] leading-[15.73px] text-center items-center hover:bg-blue-200 transition duration-300 ease-in-out cursor-pointer"> {comentario.user?.name} </span> 
                    <span className="font-sans text-[#71767B] pl-2 text-[13px] font-[350] leading-[15.73px] text-center items-center"> · {formatData(comentario.updatedAt).data}, ás {formatData(comentario.updatedAt).hora}  </span>  
                    {comentario.userId===localAval.userId && (
                      <div className="ml-auto flex flex-row">
                        <Image
                          src="/editar.png"
                          alt="Editar comentário"
                          width={64} 
                          height={64}
                          onClick={()=> {
                            setIdCommentEdited(comentario.id);
                            toggleEditComment();}
                          }
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
                    <p className="text-[#222E50] text-[14px] text-[500] leading-[16.94px] pb-2"> {comentario.text} </p>
                  </div>
                  {index !== localAval.comments.length - 1 && (
                    <div className="border-b border-[#71767B] w-full mb-[0.5rem]" >
                    </div>
                  )}
                </div>
                )  
                )}
              </div>
          </div>
        </div>
      </div>
    </>
  )
}