import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Menu, Search, UserRoundPen, LogOut } from "lucide-react";
import logo from "../assets/logo-jf.png";
import user_default from "../assets/user_no_background.png";
import Modal from "react-modal";
import "../styles.css";
const Header = ({ user, setIsMenuOpen, handleLogout }) => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const navigateToProfile = () => {
    console.log("Navegando para a página de perfil");
    navigate("/profile");
  };

  return (
    <header className="fixed top-0 left-0 w-full px-10 py-8 flex items-center justify-between z-30 bg-zinc-800 bg-opacity-90">
      <button
        className="flex items-center justify-center transition-colors duration-300 hover:text-red-600"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-2" />
        <span className="text-white text-lg font-bold">JumpFlix</span>
      </div>

      <div className="relative flex items-center" ref={searchRef}>
        <form className="flex items-center border-2 border-red-700 rounded-s-full p-0.5">
          <div
            className={`flex transition-width duration-300 ease-in-out overflow-hidden ${
              isSearchOpen ? "w-48" : "w-0"
            }`}
          >
            <input
              type="text"
              className="w-full bg-transparent text-white outline-none px-3"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center rounded-full bg-white w-10 h-10"
          >
            <Search className="text-zinc-900" />
          </button>
        </form>
      </div>
      <div className="relative flex items-center flex-col">
        <button onClick={() => setUserOpen(true)} className="flex items-center">
          <div className="border-2 border-red-700 rounded-full">
            <div className="flex items-center justify-center">
              <img
                src={user?.user_metadata?.avatar_url || user_default}
                alt="Foto de perfil"
                className="w-11 h-11 rounded-full"
              />
            </div>
          </div>
        </button>
        <span className="absolute top-12 left-1/2 transform -translate-x-1/2 text-sm font-semibold">
          {user?.user_metadata?.name || "Usuário"}
        </span>
      </div>

      <Modal
        isOpen={isUserOpen}
        onRequestClose={() => setUserOpen(false)}
        className="bg-zinc-950 w-32 h-30 absolute right-4 top-32 rounded-md p-2 text-white seta"
        overlayClassName="fixed inset-0 bg-transparent z-50"
      >
        <div className="flex flex-col items-center">
          <button
            onClick={navigateToProfile}
            className="py-2 px-4 flex items-center gap-2 font-semibold transition-colors duration-300 hover:text-red-600 hover:cursor-pointer"
          >
            <UserRoundPen />
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-4 flex items-center gap-2 font-semibold transition-colors duration-300 hover:text-red-600 hover:cursor-pointer"
          >
            <LogOut />
            Sair
          </button>
        </div>
      </Modal>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    user_metadata: PropTypes.shape({
      avatar_url: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  setIsMenuOpen: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};


export default Header;
