import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  ClapperboardIcon,
  FilmIcon,
  GlobeIcon,
  HeartIcon,
  TvIcon,
  X,
} from "lucide-react";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    navigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => {
            setIsMenuOpen;
          }}
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
          <button
            onClick={() => navigateToPage("/movies")}
            className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800"
          >
            <FilmIcon size={20} />
            Filmes
          </button>
          <button
            onClick={() => navigateToPage("/series")}
            className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800"
          >
            <TvIcon size={20} />
            Séries
          </button>
          <button
            onClick={() => navigateToPage("/kdramas")}
            className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800"
          >
            <GlobeIcon size={20} />
            Doramas
          </button>
          <button
            onClick={() => navigateToPage("/animes")}
            className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800"
          >
            <ClapperboardIcon size={20} />
            Animes
          </button>
          <button className="w-full flex items-center gap-3 px-11 py-5 font-semibold text-md transition-colors duration-300 hover:bg-zinc-800">
            <HeartIcon size={20} />
            Minha Lista
          </button>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
};

export default Sidebar;
