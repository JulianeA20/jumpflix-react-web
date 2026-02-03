import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-jf.png";
import User from "./User";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import { Menu } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full px-10 flex items-center justify-between z-30 bg-zinc-800 bg-opacity-90 transition-all duration-300 ${isScrolled ? "py-4" : "py-8"
        }`}>
        <button
          onClick={() => setIsMenuOpen(true)} // Abre o Sidebar
          className="text-white"
        >
          <Menu />
        </button>

        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Logo" className={`mr-2 transition-all duration-300 ${isScrolled ? "h-8" : "h-10"
            }`} />
          <span className="text-white text-lg font-bold">JumpFlix</span>
        </div>

        <SearchBar />

        <User />
      </header>

      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </>
  );
};

export default Header;
