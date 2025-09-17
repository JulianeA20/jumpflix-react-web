import { useState } from "react";
import logo from "../assets/logo-jf.png";
import User from "./User";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import { Menu } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSearch = (query) => {
    console.log("Busca enviada:", query);
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full px-10 py-8 flex items-center justify-between z-30 bg-zinc-800 bg-opacity-90">
        <button
          onClick={() => setIsMenuOpen(true)} // Abre o Sidebar
          className="text-white"
        >
          <Menu />
        </button>

        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
          <span className="text-white text-lg font-bold">JumpFlix</span>
        </div>

        <SearchBar onSearch={handleSearch} />

        <User />
      </header>

      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
};

export default Header;
