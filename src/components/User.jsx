import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import user_default from "../assets/user_no_background.png";
import { supabase } from "../services/supabaseClient";
import { LogOut, UserRoundPen } from "lucide-react";

const User = ({ className }) => {
  const [user, setUser] = useState(null);
  const [isUserOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } else if (data?.session?.user) {
          setUser(data.session.user.user_metadata);
        }
      } catch (error) {
        console.error("Erro inesperado ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <button onClick={() => setUserOpen(true)} className="flex justify-center items-center">
        <img
          src={user?.avatar_url || user_default}
          alt="Foto de Perfil"
          className="w-12 h-12 rounded-full border-2 border-red-600"
        />
      </button>
      <span className="text-center text-white font-semibold">
        {user?.name || "Usuário"}
      </span>

      <Modal
        isOpen={isUserOpen}
        onRequestClose={() => setUserOpen(false)}
        className="bg-zinc-950 w-32 absolute right-5 top-32 rounded-md p-4 text-white z-50 seta"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      >
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => {
              setUserOpen(false);
              window.location.href = "/profile"; // Redireciona para o perfil
            }}
            className="py-2 px-4 flex items-center gap-2 font-semibold transition-colors duration-300 hover:text-red-600"
          >
            <UserRoundPen />
            Perfil
          </button>
          <button
            onClick={handleLogout}
            className="py-2 px-4 flex items-center gap-2 font-semibold transition-colors duration-300 hover:text-red-600"
          >
            <LogOut />
            Sair
          </button>
        </div>
      </Modal>
    </div>
  );
};

User.propTypes = {
  className: PropTypes.string,
};

User.defaultProps = {
  className: "justify-center",
};

export default User;
