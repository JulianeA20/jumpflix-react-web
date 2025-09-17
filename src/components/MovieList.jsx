import React from "react";
import PropTypes from "prop-types";
import { CirclePlay } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MovieList = React.memo(({ movies }) => {
  const navigate = useNavigate();
  const handlePlayClick = (movieId) => {
    navigate(`/content/movie/${movieId}`);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 p-6">
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
});

MovieList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      posterUrl: PropTypes.string.isRequired,
      releaseYear: PropTypes.number.isRequired,
    })
  ).isRequired,
};

MovieList.displayName = 'MovieList';

export default MovieList;
