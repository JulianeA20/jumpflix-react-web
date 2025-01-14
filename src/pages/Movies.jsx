import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import MovieList from "../components/MovieList";
import { getMovies } from "../services/database";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ITEMS_PER_PAGE = 30;

const Movies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await getMovies();
      setAllMovies(movies);
      setFilteredMovies(movies);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (currentLetter) {
      const filtered = allMovies.filter((movie) =>
        movie.title.toUpperCase().startsWith(currentLetter)
      );
      setFilteredMovies(filtered);
      setCurrentPage(1);
    } else {
      setFilteredMovies(allMovies);
    }
  }, [currentLetter, allMovies]);

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  const handleLetterClick = (letter) => {
    setCurrentLetter(letter === currentLetter ? null : letter);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <PageLayout>
      {/* Alphabet buttons */}
      <div className="flex flex-wrap gap-2 ml-3 mb-6">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`px-3 py-1 rounded ${
              currentLetter === letter
                ? "bg-red-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <MovieList movies={currentMovies} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>{currentPage} de {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">
            <ChevronRight/>
          </button>
        </div>
      )}
    </PageLayout>
  );
};

export default Movies;
