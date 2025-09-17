import { Search } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [onSearch, searchQuery]);

  const handleBlur = useCallback((e) => {
    if (!searchRef.current.contains(e.relatedTarget)) {
      setIsSearchOpen(false);
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <form
        className="flex items-center border-2 border-red-700 rounded-s-full p-0.5"
        onSubmit={handleSubmit}
        onBlur={handleBlur}
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
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
        <button type="submit" className="flex items-center justify-center rounded-full bg-white w-10 h-10">
          <Search className="text-zinc-900" />
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;