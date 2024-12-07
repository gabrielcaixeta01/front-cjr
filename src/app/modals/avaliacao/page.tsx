"use client";
export default function Avaliacao() {
  return ( 
  <>
    <div className="flex flex-col h-screen bg-gray-100 justify-center">
        <div className="h-screen  w-1/2 max-h-[75%]  flex flex-col mx-auto bg-[#3EEE9A] rounded-md items-center">
            <div className="flex bg-white h-[2rem] w-[90%] justify-between items-center hover:cursor-pointer rounded-md mt-4"> 
                <span className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2" /*onClick={()=>{lista.map(profs)}=>}*/> Nome do professor </span> 
            </div>
            <div className="flex bg-white h-[2rem] w-[90%] justify-between items-center hover:cursor-pointer rounded-md mt-4"> 
                <span className="text-[#999797] font-[300] text-[18px] leading-[29.05px] pl-2"> Disciplina </span> 
            </div>

        </div>
    </div>
  </>
  
)
}
