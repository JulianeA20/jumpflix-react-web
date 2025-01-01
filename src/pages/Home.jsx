import { useState } from "react";
import Modal from "react-modal";
import Login from "../components/Login";
import Register from "../components/Register";
import { XIcon } from "lucide-react";
import fundo from "../assets/wallpaper-jf.png";
import logo from "../assets/logo-jf.png";
import gif from "../assets/logo-12375_256-ezgif.com-speed.gif";
import "../styles.css";

Modal.setAppElement("#root");
const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const switchToLoginModal = () => {
    setIsRegisterModalOpen(false);
    setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 300);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <img
        className="absolute w-full h-full object-cover"
        src={fundo}
        alt="Fundo"
      />

      <div className="absolute w-full h-full bg-black/50 backdrop-blur-sm"></div>

      <header className="absolute top-0 left-0 w-full p-10 flex items-center justify-between z-30">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
          <span className="text-white text-xl font-bold">JumpFlix</span>
        </div>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="text-red-700 font-semibold bg-white px-4 py-2 rounded-md shadow-md transition-all duration-300 hover:scale-110"
        >
          Login
        </button>
      </header>

      <div className="flex flex-col items-center justify-center h-full text-center z-20 relative">
        <div className="flex flex-row items-center gap-2">
          <h1 className=" text-white text-4xl font-bold mb-4">
            Bem-vindo(a) ao JumpFlix
          </h1>
          <img
            src={gif}
            alt="Gif"
            className="mb-4 size-14 rounded-full shadow-lg"
          />
        </div>
        <p className="text-white mb-6">
          Acesse a plataforma de filmes e se divirta!
        </p>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="text-white font-semibold bg-red-700 px-4 py-2 rounded-md shadow-md transition-all duration-300 hover:scale-110"
        >
          Cadastre-se
        </button>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
        className="modal-content slide-in-right"
        overlayClassName="fixed inset-0 bg-black/60 z-50"
      >
        <Login />
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-2 text-white font-semibold"
        >
          <XIcon size={24} />
        </button>
      </Modal>

      <Modal
        isOpen={isRegisterModalOpen}
        onRequestClose={() => setIsRegisterModalOpen(false)}
        className="modal-content slide-in-left"
        overlayClassName="fixed inset-0 bg-black/60 z-50"
      >
        <Register onSuccess={switchToLoginModal} />
        <button
          onClick={() => setIsRegisterModalOpen(false)}
          className="absolute top-4 right-2 text-white font-semibold"
        >
          <XIcon size={24} />
        </button>
      </Modal>
    </div>
  );
};

export default Home;
