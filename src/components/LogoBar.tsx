import { FaSteam, FaPlaystation, FaXbox } from "react-icons/fa6";
import { BsNintendoSwitch } from "react-icons/bs";

function LogoBar() {
  return (
    <div className="w-full bg-[#131416] dark:bg-[#0D0E10] py-[5rem] px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center gap-10 text-[#F5F6F7]">
        <FaSteam 
          className="text-3xl md:text-[4rem] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 cursor-pointer" 
        />
        <FaPlaystation 
          className="text-3xl md:text-[4rem] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 cursor-pointer" 
        />
        <FaXbox 
          className="text-3xl md:text-[4rem] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 cursor-pointer" 
        />
        <BsNintendoSwitch 
          className="text-3xl md:text-[4rem] opacity-60 hover:opacity-100 hover:text-white transition-all duration-300 cursor-pointer" 
        />
      </div>
    </div>
  );
}

export default LogoBar;