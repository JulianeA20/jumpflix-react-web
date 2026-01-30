import { Search, ArrowRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef();
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleButtonClick = useCallback((e) => {
    e.preventDefault();
    if (!isSearchOpen) {
      // Se o input está fechado, abre e foca nele
      setIsSearchOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else if (searchQuery.trim()) {
      // Se está aberto e tem conteúdo, submete
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  }, [isSearchOpen, searchQuery, navigate]);

  // Detectar clique fora do componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    // Adicionar listener quando o search está aberto
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);


  return (
    <div className="relative flex items-center" ref={searchRef}>
      <form
        className="flex items-center border-2 border-red-700 rounded-full p-0.5"
        onSubmit={handleSubmit}
      >
        <div
          className={`flex transition-width duration-300 ease-in-out overflow-hidden ${isSearchOpen ? "w-48" : "w-0"
            }`}
        >
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-white outline-none px-3"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex items-center justify-center rounded-full bg-white w-10 h-10"
        >
          {isSearchOpen ? (
            <ArrowRight className="text-zinc-900" />
          ) : (
            <Search className="text-zinc-900" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;