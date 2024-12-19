import Image from "next/image";

const telaCarregamento = 
    <div className="flex flex-col h-screen min-h-screen bg-gray-100">
        <header className="flex justify-between bg-customGreen pb-1 items-center mb-2">
           <div className="flex bg-azulUnb pb-1">
             <div className="flex justify-between w-screen bg-white py-3 items-center">
               <Image
                 src="/logounb.png"
                 alt="Logo da UnB"
                 width={80}
                 height={80}
                 className="w-20 h-10 cursor-pointer ml-5 shadow-md"
               />
             </div>
           </div>
        </header>
    </div>

export default telaCarregamento;