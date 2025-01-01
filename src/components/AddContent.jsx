import { useState } from "react";
import PropTypes from "prop-types";
import { addMovie, addSeries, addAnime } from "../services/database";

const contentTypes = [
  { id: "movie", name: "Filme" },
  { id: "series", name: "Série" },
  { id: "kdrama", name: "Dorama" },
  { id: "anime", name: "Anime" },
];

const AddContent = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (selectedType) {
        case "movie":
          await addMovie(formData);
          break;
        case "series":
        case "kdrama":
          await addSeries({ ...formData, isDorama: selectedType === "kdrama" });
          break;
        case "anime":
          await addAnime(formData);
          break;
        default:
          throw new Error("Tipo de conteúdo desconhecido");
      }
      alert("Conteúdo adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar conteúdo: ", error);
      alert("Erro ao adicionar conteúdo. Por favor, tente novamente.");
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
    setFormData({});
  };

  const commonFields = (
    <>
      <input
        type="text"
        name="title"
        placeholder="Título"
        value={formData.title || ""}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 bg-zinc-800 rounded"
        required
      />
      <input
        type="number"
        name="releaseYear"
        placeholder="Ano de lançamento"
        value={formData.releaseYear || ""}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 bg-zinc-800 rounded"
        required
      />
      <input
        type="number"
        name="imdbRating"
        placeholder="Avaliação IMDB (0-10)"
        value={formData.imdbRating || ""}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 bg-zinc-800 rounded"
        min="0"
        max="10"
        step="0.1"
        required
      />
      <textarea
        name="synopsis"
        placeholder="Sinopse"
        value={formData.synopsis || ""}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 bg-zinc-800 rounded"
        required
      />
      <input
        type="url"
        name="posterUrl"
        placeholder="URL do Poster"
        value={formData.posterUrl || ""}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 bg-zinc-800 rounded"
        required
      />
    </>
  );

  const renderForm = () => {
    switch (selectedType) {
      case "movie":
        return (
          <form onSubmit={handleSubmit}>
            {commonFields}
            <input
              type="url"
              name="thumbnailUrl"
              placeholder="URL da Miniatura"
              value={formData.thumbnailUrl || ""}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-zinc-800 rounded"
              required
            />
            <input
              type="url"
              name="videoUrl"
              placeholder="URL do Vídeo"
              value={formData.videoUrl || ""}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-zinc-800 rounded"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duração (em minutos)"
              value={formData.duration || ""}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-zinc-800 rounded"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Adicionar Filme
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        );
      case "series":
      case "kdrama":
        return (
          <form onSubmit={handleSubmit}>
            {commonFields}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Adicionar {selectedType === "series" ? "Série" : "Dorama"}
            </button>
          </form>
        );
      case "anime":
        return (
          <form onSubmit={handleSubmit}>
            {commonFields}
            <input
              type="url"
              name="thumbnailUrl"
              placeholder="URL da Miniatura"
              value={formData.thumbnailUrl || ""}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-zinc-800 rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Adicionar Anime
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-zinc-950 rounded-lg p-6 mb-8 mx-auto max-w-2xl mt-16">
      <h2 className="text-center font-bold text-2xl mb-8">
        Adicionar Conteúdo
      </h2>
      {!selectedType ? (
        <div>
          <p className="mb-4 text-center">
            Qual tipo de conteúdo você deseja adicionar?
          </p>
          <div className="grid grid-cols-2 gap-4">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="bg-red-600 transition-colors duration-300 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        renderForm()
      )}
    </div>
  );
};

AddContent.propTypes = {
  onClose: PropTypes.func,
};

export default AddContent;
