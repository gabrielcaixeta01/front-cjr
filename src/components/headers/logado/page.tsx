import Image from "next/image";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function HeaderLogado() {  
    const [loggedInUser, setLoggedInUser] = useState<{
        id: number;
        name: string;
        profilepic?: string;
    } | null>(null);
    
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
        try {
            const decoded: { sub: number; name?: string; profilepic?: string } = jwtDecode(token);
            setLoggedInUser({
            id: decoded.sub,
            name: decoded.name || "Usuário",
            profilepic: decoded.profilepic || "/default-profile.png",
            });
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
        }
        }
    }, []);
      
    return(  
    <header className="flex justify-between bg-customGreen pb-1 items-center mb-2 min-h-fit ">
        <div className="flex bg-azulUnb pb-1">
            <div className="flex justify-between w-screen bg-white py-3 items-center">
                <Link
                href="/feed">  
                    <Image
                    src="/logounb.png"
                    alt="Logo da UnB"
                    width={80}
                    height={80}
                    className="w-20 h-10 cursor-pointer ml-5 shadow-md"
                    />
                </Link>
               
                <div className="flex items-center space-x-5 mr-10">
                    <button
                    className="bg-azulCjr hover:bg-blue-600 p-2 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg"
                    onClick={() => toast.info("Sem notificações novas.")}
                    >
                    <BellIcon className="h-6 w-6 text-white" />
                    </button>
                    {loggedInUser && (
                    <Link
                    href={`/user/aluno/${loggedInUser.id}`}>
                    <Image
                    src={loggedInUser.profilepic || "/default-profile.png"}
                    alt="Foto de perfil"
                    width={48}
                    height={48}
                    className="w-10 h-10 rounded-full shadow-md bg-white object-cover cursor-pointer"
                    />
                    </Link>
                    )}
                    <button
                    className="flex items-center bg-azulCjr text-white rounded-[60px] px-4 py-2 hover:bg-blue-600 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        window.location.href = "/feed";
                    }}
                    >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
            </div>
        </div>
    </header>
)}


