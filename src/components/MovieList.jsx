import { useEffect, useState } from "react";
import { getMovies } from "../services/database";

function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const movieList = await getMovies();
      setMovies(movieList);
    }
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className="font-semibold text-xl ml-6 mt-10">Lista de Filmes</h2>
      {movies.map(movie => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <p>Ano: {movie.releaseYear}</p>
          <p>Nota IMDB: {movie.imdbRating}</p>
          <img src={movie.posterUrl} alt={movie.title} />
        </div>
      ))}
    </div>
  );
}

export default MovieList;