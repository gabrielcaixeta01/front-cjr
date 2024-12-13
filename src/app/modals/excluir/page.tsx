"use client"
export default function Excluir (){
      return ( 
      <>
        <div className="flex flex-col h-screen bg-gray-100 justify-center items-center">
        <div className="bg-black pt-3 pl-6 pr-6 pb-6 max-h-fit flex flex-col items-center rounded-lg w-full max-w-md shadow-lg">
        <div className="text-center mb-5 p-2">
          <h1 className="text-3xl font-bold text-white mb-4">
          </h1>
          <p className="text-lg text-ellipsis text-white">
            Tem certeza de que deseja excluir a avaliação?
          </p>
          <p className="text-xs italic text-white"> Essa ação não poderá ser desfeita</p>
        </div>
        <div className="flex space-x-6">
        <button
          className="bg-red-600 text-white font-semibold px-7 py-2 rounded-lg hover:bg-red-900 hover:text-white transition duration-300 ease-in-out"
        >
          Sim 
        </button>
        <button
          className=" text-white font-semibold px-7 py-2 rounded-lg hover:bg-white border-[0.5px] border-gray-300 hover:text-black transition duration-300 ease-in-out"
        >
          Cancelar 
        </button>
        </div>
      </div>
        </div>
      </>
      
    )
    }
    
