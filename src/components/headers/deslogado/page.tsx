import Image from "next/image";
import {useRouter } from "next/navigation";

export default function HeaderDeslogado() {  
  const router = useRouter();
    return(  
    <header className="flex justify-between bg-customGreen pb-1 items-center mb-2 min-h-fit ">
        <div className="flex bg-azulUnb pb-1">
            <div className="flex justify-between w-screen bg-white py-3 items-center">
                <Image
                    src="/logounb.png"
                    alt="Logo da UnB"
                    width={80}
                    height={80}
                    className="w-20 h-10 cursor-pointer ml-5 shadow-md"
                    onClick={()=> router.push("/feed")}
                />
                <div className="flex items-center space-x-5 mr-10">
                    <button
                    className="bg-azulCjr hover:bg-blue-600 py-2 px-5 rounded-[60px] transition duration-300 shadow-md hover:shadow-lg mr-2"
                    onClick={() => router.push("/login")}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    </header>
)}


