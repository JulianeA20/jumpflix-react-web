import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Modal from "react-modal";
import logo from "../assets/logo-jf.png";
import user_default from "../assets/user_no_background.png";
import { ArrowLeft, LogOut, UserRoundPen } from "lucide-react";

const HeaderBack = ({ user }) => {
  const [isUserOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();

  const navigateToProfile = () => {
    setUserOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setUserOpen(false);
    navigate("/");
  }

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

      {/* Foto e nome do usuário */}
      <div className="relative flex flex-col items-center">
        <button onClick={() => setUserOpen(true)} className="flex items-center">
          <img
            src={user?.avatar_url || user_default}
            alt="Foto de Perfil"
            className="w-11 h-11 rounded-full border-2 border-red-700"
          />
        </button>
        <span className="text-white text-center font-semibold ml-2">
          {user?.name || "Usuário"}
        </span>
      </div>

      <Modal
        isOpen={isUserOpen}
        onRequestClose={() => setUserOpen(false)}
        className="bg-zinc-950 w-32 absolute right-6 top-32 rounded-md p-2 text-white seta flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-transparent z-50"
      >
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={navigateToProfile}
            className="py-2 px-4 flex items-center gap-2 font-semibold transition-colors duration-300 hover:text-red-600 hover:cursor-pointer w-full text-left"
          >
            <UserRoundPen />
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-4 flex items-center gap-2 font-semibold transition-colors duration-300 hover:text-red-600 hover:cursor-pointer w-full text-left"
          >
            <LogOut />
            Sair
          </button>
        </div>
      </Modal>
    </header>
  );
};

HeaderBack.propTypes = {
  user: PropTypes.shape({
    avatar_url: PropTypes.string,
    name: PropTypes.string,
  }),
};

HeaderBack.defaultProps = {
  user: null,
};

export default HeaderBack;
