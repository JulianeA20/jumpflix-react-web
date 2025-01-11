import { useEffect, useState } from "react";
import { getMovies } from "../services/database";
import { CirclePlay } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MovieList() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      const movieList = await getMovies();
      console.log("Filmes retornados: ", movieList);
      setMovies(movieList);
      console.log("Estado dos filmes:", movieList);
    }
    fetchMovies();
  }, []);

  const handlePlayClick = (movieId) => {
    navigate(`/contentDetails/${movieId}`);
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl ml-6 mt-10">Lista de Filmes</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7  gap-6 p-6">
        {movies.length === 0 ? (
          <p className="ml-6">Nenhum filme encontrado.</p>
        ) : (
          movies.map((movie) => {
            return (
              <div key={movie.id} className="relative group">
                <div className="w-full aspect-[2/3] overflow-hidden rounded-md">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white text-center line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-white text-sm mb-2">
                        {movie.releaseYear}
                      </p>

                      <button
                        onClick={() => handlePlayClick(movie.id)}
                        className="text-white hover:text-red-600 transition-colors duration-300"
                      >
                        <CirclePlay size={50} strokeWidth={1.2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MovieList;
