import { useState } from "react";
import { addMovie } from '../services/database';

function AddMovie() {
  const [movie, setMovie] = useState({
    title: "",
    releaseYear: "",
    imdbRating: "",
    synopsis: "",
    posterUrl: "",
    thumbnailUrl: "",
    videoUrl: "",
    duration: "",
  });

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMovie(movie);
      alert("Filme adicionado com sucesso!");
      setMovie({
        title: "",
        releaseYear: "",
        imdbRating: "",
        synopsis: "",
        posterUrl: "",
        thumbnailUrl: "",
        videoUrl: "",
        duration: ""
      });
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      alert('Erro ao adicionar filme');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={movie.title}
        onChange={handleChange}
        placeholder="Título"
        required
      />
      <input
        name="releaseYear"
        type="number"
        value={movie.releaseYear}
        onChange={handleChange}
        placeholder="Ano de lançamento"
        required
      />
      <input
        name="imdbRating"
        type="number"
        step="0.1"
        min="0"
        max="10"
        value={movie.imdbRating}
        onChange={handleChange}
        placeholder="Nota IMDB"
        required
      />
      <textarea
        name="synopsis"
        value={movie.synopsis}
        onChange={handleChange}
        placeholder="Sinopse"
      />
      <input
        name="posterUrl"
        value={movie.posterUrl}
        onChange={handleChange}
        placeholder="URL do Poster"
      />
      <input
        name="thumbnailUrl"
        value={movie.thumbnailUrl}
        onChange={handleChange}
        placeholder="URL da Thumbnail"
      />
      <input
        name="videoUrl"
        value={movie.videoUrl}
        onChange={handleChange}
        placeholder="URL do Vídeo"
        required
      />
      <input
        name="duration"
        type="number"
        value={movie.duration}
        onChange={handleChange}
        placeholder="Duração"
        required
      />
      <button type="submit">Adicionar Filme</button>
    </form>
  );
}

export default AddMovie;