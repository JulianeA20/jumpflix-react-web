import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-jf.png";
import User from "./User";
import { ArrowLeft } from "lucide-react";

const HeaderBack = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full px-10 py-6 flex items-center justify-between z-30">
      {/* Botão de Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-white font-bold px-2 py-2 rounded transition-colors duration-300 hover:text-red-700"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Voltar
      </button>

      {/* Logo centralizado */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-2" />
        <span className="text-white text-lg font-bold">JumpFlix</span>
      </div>

      {/* Componente User */}
      <User />
    </header>
  );
};

export default HeaderBack;
