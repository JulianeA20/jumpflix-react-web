import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../services/supabaseClient";
import MovieList from "../components/MovieList";
import logo from "../assets/logo-jf.png";
import user_default from "../assets/user_no_background.png";
import {
  ClapperboardIcon,
  FilmIcon,
  GlobeIcon,
  HeartIcon,
  LogOut,
  Menu,
  Search,
  TvIcon,
  UserRoundPen,
  X,
} from "lucide-react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "../styles.css";
const Dashboard = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao buscar sessão do usuário:", error);
    } else if (session) {
      setUser(session.user);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar: ", error);
    } else {
      console.log("Usuário deslogado com sucesso.");
      setUser(null);
      navigate("/");
    }
  };

  const navigateToProfile = () => {
    console.log("Navegando para a página de perfil");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 z-50 border-r-2 border-red-600 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="relative mt-11 ml-10 transition-colors duration-300 hover:text-red-600"
          onClick={() => setIsMenuOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-start justify-between mt-12">
          <button className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800">
            {" "}
            <FilmIcon size={20} />
            Filmes
          </button>
          <button className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800">
            <TvIcon size={20} />
            Séries
          </button>
          <button className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800">
            <GlobeIcon size={20} />
            Doramas
          </button>
          <button className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800">
            <ClapperboardIcon size={20} />
            Animes
          </button>
          <button className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800">
            <HeartIcon size={20} />
            Minha Lista
          </button>
        </div>
      </div>

      <header className="fixed top-0 left-0 w-full px-10 py-8 flex items-center justify-between z-30 bg-zinc-800 bg-opacity-90">
        {/* Menu button */}
        <button
          className="flex items-center justify-center transition-colors duration-300 hover:text-red-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 mr-2" />
          <span className="text-white text-lg font-bold">JumpFlix</span>
        </div>

        {/* SearchBar */}
        <div className="relative flex items-center" ref={searchRef}>
          <form
            className="flex items-center border-2 border-red-700 rounded-full p-0.5"
          >
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

        {/* User profile */}
        <div className="relative flex items-center flex-col">
          <button
            onClick={() => setUserOpen(true)}
            className="flex items-center"
          >
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
      </header>

      <main className="pt-32 px-5 pb-10">
        <MovieList />
      </main>

      {/* User modal */}
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
    </div>
  );
};

export default Dashboard;
