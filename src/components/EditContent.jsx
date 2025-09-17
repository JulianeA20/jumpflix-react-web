import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import {
  addSeason,
  addEpisode,
  updateMovie,
  updateSeries,
  updateAnime,
  getMovies,
  getSeries,
  getAnimes,
  updateSeason,
  updateEpisode,
} from "../services/database";
import { supabase } from "../services/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { CircleMinus, CirclePlus, Search } from "lucide-react";

const contentTypes = [
  { id: "movie", name: "Filme" },
  { id: "series", name: "Série" },
  { id: "kdrama", name: "Dorama" },
  { id: "anime", name: "Anime" },
];

const EditContent = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [formData, setFormData] = useState({});
  const [posterPreview, setPosterPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [seasons, setSeasons] = useState([]);
  const ratingIntervalRef = useRef(null);
  const longPressTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSearchTerm("");
    setSearchResults([]);
    setSelectedContent(null);
    setFormData({});
    setPosterPreview(null);
    setThumbnailPreview(null);
    setStep(1);
  };

  const handleSearch = async () => {
    console.log("Buscando resultados...");

    let results;
    switch (selectedType) {
      case "movie":
        results = await getMovies();
        break;
      case "series":
      case "kdrama":
        results = await getSeries();
        break;
      case "anime":
        results = await getAnimes();
        break;
      default:
        results = [];
    }

    console.log("Resultados brutos:", results);

    const filteredResults = results.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Resultados filtrados:", filteredResults);

    setSearchResults(filteredResults);
  };

  const handleContentSelect = async (content) => {
    setSelectedContent(content);
    setFormData(content);
    setPosterPreview(content.posterUrl);
    setThumbnailPreview(content.thumbnailUrl);

    await fetchSeasonsAndEpisodes();

    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (change) => {
    setFormData((prev) => {
      const currentRating = parseFloat(prev.imdbRating) || 0;
      const newRating = Math.min(10, Math.max(0, currentRating + change));
      return { ...prev, imdbRating: newRating.toFixed(1) };
    });
  };

  useEffect(() => {
    if (isIncrementing) {
      ratingIntervalRef.current = setInterval(
        () => handleRatingChange(0.1),
        100
      );
    } else if (isDecrementing) {
      ratingIntervalRef.current = setInterval(
        () => handleRatingChange(-0.1),
        100
      );
    } else {
      clearInterval(ratingIntervalRef.current);
    }

    return () => {
      clearInterval(ratingIntervalRef.current);
      clearTimeout(longPressTimeoutRef.current);
    };
  }, [isIncrementing, isDecrementing]);

  const startIncrementing = () => {
    handleRatingChange(0.1);
    longPressTimeoutRef.current = setTimeout(() => {
      setIsIncrementing(true);
    }, 250);
  };

  const startDecrementing = () => {
    handleRatingChange(-0.1);
    longPressTimeoutRef.current = setTimeout(() => {
      setIsDecrementing(true);
    }, 250);
  };

  const stopChanging = () => {
    setIsIncrementing(false);
    setIsDecrementing(false);
    clearTimeout(longPressTimeoutRef.current);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(0);

    try {
      const uploadFile = async (file, bucket) => {
        if (!file) return null; // Se o arquivo não for definido, retorna null

        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      };

      setProgress(10);

      const posterUrl =
        formData.poster instanceof File
          ? await uploadFile(formData.poster, "posters")
          : selectedContent.posterUrl;

      setProgress(25);

      const thumbnailUrl =
        formData.thumbnail instanceof File
          ? await uploadFile(formData.thumbnail, "thumbnails")
          : selectedContent.thumbnailUrl;

      setProgress(50);

      const videoUrl =
        formData.video instanceof File
          ? await uploadFile(formData.video, "videos")
          : selectedContent.videoUrl;

      setProgress(75);

      const contentData = {
        title: formData.title,
        releaseYear: parseInt(formData.releaseYear),
        imdbRating: parseFloat(formData.imdbRating),
        synopsis: formData.synopsis,
        posterUrl,
        thumbnailUrl,
        videoUrl,
        duration: formData.duration ? parseInt(formData.duration) : null,
      };

      let result;
      switch (selectedType) {
        case "movie":
          result = await updateMovie(selectedContent.id, contentData);
          break;
        case "series":
        case "kdrama":
          result = await updateSeries(selectedContent.id, {
            ...contentData,
            isDorama: selectedType === "kdrama",
          });
          break;
        case "anime":
          result = await updateAnime(selectedContent.id, contentData);
          break;
        default:
          throw new Error("Tipo de conteúdo desconhecido");
      }

      if (!result || result.error) {
        throw new Error(
          result?.error || "Erro desconhecido ao atualizar o conetúdo."
        );
      }

      setProgress(100);
      alert("Conteúdo atualizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar conteúdo:", error);
      alert("Erro ao atualizar conteúdo. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (e.target.name === "poster") {
          setPosterPreview(reader.result);
        } else if (e.target.name === "thumbnail") {
          setThumbnailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, [e.target.name]: file });
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, video: file });

      if (!videoRef.current) {
        videoRef.current = document.createElement("video");
      }

      const video = videoRef.current;
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        setFormData((prevData) => ({
          ...prevData,
          duration: Math.round(video.duration / 60),
        }));

        URL.revokeObjectURL(video.src);
      };
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
    setSearchTerm("");
    setSearchResults([]);
    setSelectedContent(null);
    setFormData({});
    setPosterPreview(null);
    setThumbnailPreview(null);
    setStep(1);
  };

  const handleAddSeason = async () => {
    try {
      const newSeasons = [...seasons];
      const currentSeason = newSeasons[newSeasons.length - 1];

      if (currentSeason) {
        const seasonData = {
          number: currentSeason.number,
          parentId: selectedContent.id,
          parentType: selectedType,
          arc_name: currentSeason.arc_name || null,
        };

        if (currentSeason.id) {
          const { error } = await updateSeason(currentSeason.id, seasonData);
          if (error) throw error;
        } else {
          const { data, error } = await addSeason(seasonData);
          if (error) throw error;

          currentSeason.id = data[0].id;
        }
      }

      newSeasons.push({
        number: newSeasons.length + 1,
        episodes: [],
      });

      setSeasons(newSeasons);
    } catch (error) {
      console.error("Erro ao salvar temporada:", error);
      alert("Erro ao salvar temporada. Tente novamente.");
    }
  };

  const handleAddEpisode = async (seasonIndex) => {
    try {
      const newSeasons = [...seasons];
      const currentSeason = newSeasons[seasonIndex];

      const currentEpisode =
        currentSeason.episodes[currentSeason.episodes.length - 1];

      if (currentEpisode) {
        const episodeData = {
          number: currentEpisode.number,
          title: currentEpisode.title,
          description: currentEpisode.description,
          season_id: currentSeason.id || null,
          thumbnailUrl: currentEpisode.thumbnailUrl || null,
          videoUrl: currentEpisode.videoUrl || null,
        };

        if (currentEpisode.id) {
          const { error } = await updateEpisode(currentEpisode, episodeData);
          if (error) throw error;
        } else {
          const { data, error } = await addEpisode(episodeData);
          if (error) throw error;

          currentSeason.episodes[currentSeason.episodes.length - 1].id =
            data[0].id;
        }
      }

      currentSeason.episodes = [
        {
          number: currentSeason.episodes.length + 1,
          title: "",
          description: "",
          thumbnailUrl: null,
          videoUrl: null,
        },
      ];

      setSeasons(newSeasons);
    } catch (error) {
      console.error("Erro ao salvar episódio:", error);
      alert("Erro ao salvar episódio. Tente novamente.");
    }
  }

  const uploadFile = async (file, bucket) => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSaveSeasons = async () => {
    setIsSubmitting(true);
    setProgress(0);

    try {
      for (const season of seasons) {
        let savedSeason;

        if (season.id) {
          const { data, error } = await updateSeason(season.id, {
            number: season.number,
            parentId: selectedContent.id,
            parentType: selectedType,
          });

          if (error) {
            console.error("Erro ao atualizar temporada:", error);
            throw new Error("Erro ao atualizar temporada.");
          }
          savedSeason = data;
        } else {
          const { data, error } = await addSeason({
            number: season.number,
            parentId: selectedContent.id,
            parentType: selectedType,
          });

          if (error) {
            console.error("Erro ao criar temporada:", error);
            throw new Error("Erro ao criar temporada.");
          }
          savedSeason = data;
        }

        if (!savedSeason || !savedSeason.id) {
          throw new Error("Erro ao salvar a temporada. ID não retornado.");
        }

        for (const episode of season.episodes) {
          const episodeData = {
            number: episode.number,
            title: episode.title,
            description: episode.description,
            season_id: savedSeason.id, // Associar episódio à temporada
          };

          if (episode.thumbnail instanceof File) {
            episodeData.thumbnailUrl = await uploadFile(
              episode.thumbnail,
              "thumbnails"
            );
          } else {
            episodeData.thumbnailUrl = episode.thumbnailUrl || null;
          }

          if (episode.video instanceof File) {
            episodeData.videoUrl = await uploadFile(episode.video, "videos");
          } else {
            episodeData.videoUrl = episode.videoUrl || null;
          }

          if (episode.id) {
            const { error } = await updateEpisode(episode.id, episodeData);
            if (error) {
              console.error("Erro ao atualizar episódio:", error);
              throw new Error("Erro ao atualizar episódio.");
            }
          } else {
            const { error } = await addEpisode(episodeData);
            if (error) {
              console.error("Erro ao criar episódio:", error);
              throw new Error("Erro ao criar episódio.");
            }
          }
        }

        setProgress((prevProgress) => prevProgress + 100 / seasons.length);
      }

      alert("Temporadas e episódios atualizados com sucesso!");
      setStep(1);
      selectedContent(null);
      setFormData({});
      setSeasons([]);
    } catch (error) {
      console.error("Erro ao atualizar temporadas e episódios:", error);
      alert(
        "Erro ao atualizar as temporadas e apisódios. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const fetchSeasonsAndEpisodes = async () => {
    try {
      const { data: seasonsData, error: seasonsError } = await supabase
        .from("seasons")
        .select(
          "id, numberm arc_name, episodes (id, number, title, description, thumbnailUrl, videoUrl)"
        )
        .eq("parentId", selectedContent.id)
        .order("number", { ascending: true });

      if (seasonsError) {
        console.error("Erro ao buscar temporadas:", seasonsError);
        throw seasonsError;
      }

      setSeasons(
        seasonsData.map((season) => ({
          id: season.id,
          number: season.number,
          arc_name: season.arc_name,
          episodes: season.episodes || [],
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar temporadas e episódios:", error);
      alert("Erro ao carregar temporadas e episódios. Tente novamente.");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const renderForm = () => {
    if (step === 1) {
      return (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar conteúdo..."
            className="w-full p-2 mb-4 bg-zinc-900 rounded-full border-2 border-red-600 indent-2 text-sm outline-none"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mb-4"
          >
            <Search className="inline mr-2" size={20} />
            Buscar
          </button>
          {searchResults.length > 0 && (
            <ul className="bg-zinc-800 rounded-lg p-4">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleContentSelect(item)}
                  className="cursor-pointer hover:bg-zinc-700 p-2 rounded"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (step === 2) {
      return (
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold ml-2 mb-2">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 bg-zinc-900 rounded-full border-2 border-red-600 indent-2 text-sm outline-none"
            required
          />
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-full md:w-1/2 pr-4">
              <label className="block text-sm font-bold ml-2 mb-2">
                Ano de lançamento
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear || ""}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 bg-zinc-900 rounded-full border-2 border-red-600 indent-2 text-sm outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold ml-2 mb-2">
                Avaliação IMDB
              </label>
              <div className="flex items-center">
                <div className="relative flex-grow mr-2">
                  <input
                    type="text"
                    name="imdbRating"
                    value={formData.imdbRating || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-zinc-900 text-sm rounded-full border-2 border-red-600 indent-2 outline-none"
                    readOnly
                  />
                </div>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onMouseDown={startIncrementing}
                    onMouseUp={stopChanging}
                    onMouseLeave={stopChanging}
                    className="mb-1 focus:outline-none"
                  >
                    <CirclePlus
                      size={20}
                      className="transition-colors duration-300 hover:text-red-600"
                    />
                  </button>
                  <button
                    type="button"
                    onMouseDown={startDecrementing}
                    onMouseUp={stopChanging}
                    onMouseLeave={stopChanging}
                    className="mb-1 focus:outline-none"
                  >
                    <CircleMinus
                      size={20}
                      className="transition-colors duration-300 hover:text-red-600"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <label className="block text-sm font-bold ml-2 mb-2">Sinopse</label>
          <textarea
            name="synopsis"
            value={formData.synopsis || ""}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 bg-zinc-900 border-2 border-red-600 rounded-lg text-sm outline-none"
            required
          />
          <div>
            <label className="block text-sm font-bold ml-2 mb-2">Poster</label>
            <input
              type="file"
              name="poster"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 mb-4 border-2 border-red-600 rounded-full text-sm"
            />
            {posterPreview && (
              <img
                src={posterPreview}
                alt="Poster Preview"
                className="mt-2 max-w-xs"
              />
            )}
          </div>
          {selectedType === "movie" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-bold ml-2 mb-2">
                  Thumbnail
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border-2 border-red-600 rounded-full text-sm"
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold ml-2 mb-2">
                  Vídeo
                </label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full px-4 py-2 border-2 border-red-600 rounded-full text-sm"
                />
              </div>
            </>
          )}
          {isSubmitting && (
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm mt-2">Atualizando conteúdo... {progress}%</p>
            </div>
          )}
          <div className="flex justify-between">
            {selectedType === "movie" ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-sm text-white font-bold py-2 px-4 rounded ${
                  isSubmitting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Atualizando...' : 'Atualizar Filme'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={isSubmitting}
                className={`text-sm text-white font-bold py-2 px-4 rounded ${
                  isSubmitting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Avançar
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-sm text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (step === 3) {
      return (
        <div>
          <h3 className="text-xl font-bold mb-4">Temporadas e Episódios</h3>
          {seasons.map((season, seasonIndex) => (
            <div key={seasonIndex} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">
                Temporada {season.number}{" "}
                {season.arc_name && `- ${season.arc_name}`}
              </h4>
              {season.episodes.length > 0 ? (
                season.episodes.map((episode, episodeIndex) => (
                  <div
                    key={episodeIndex}
                    className="mb-4 p-4 bg-zinc-800 rounded-lg"
                  >
                    <h5 className="font-semibold mb-4">
                      Episódio {episode.number}: {episode.title}
                    </h5>
                    <p className="mb-2">{episode.description}</p>
                    {episode.thumbnailUrl && (
                      <img
                        src={episode.thumbnailUrl}
                        alt={`Thumbnail do Episódio ${episode.number}`}
                        className="mb-4 max-w-xs"
                      />
                    )}
                    {episode.videoUrl && (
                      <a
                        href={episode.videoUrl}
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Assistir ao vídeo
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Nenhum episódio encontrado.</p>
              )}
              <button
                type="button"
                onClick={() => handleAddEpisode(seasonIndex)}
                className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-bold py-2 px-4 rounded mt-2"
              >
                Adicionar Episódio
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSeason}
            className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-bold py-2 px-4 rounded mb-4"
          >
            Adicionar Temporada
          </button>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSaveSeasons}
              className="bg-green-600 hover:bg-green-700 text-sm text-white font-bold py-2 px-4 rounded"
            >
              Salvar Temporadas e Episódios
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-yellow-600 hover:bg-yellow-700 text-sm text-white font-bold py-2 px-4 rounded"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-zinc-950 rounded-lg p-6 mb-8 mx-auto max-w-2xl mt-16">
        <h2 className="text-center font-bold  text-2xl mb-8">
          Editar Conteúdo
        </h2>
        {!selectedType ? (
          <div>
            <p className="mb-4 text-center">
              Qual tipo de conteúdo deseja editar?
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
        ) : step === 1 ? (
          <div>
            <h4 className="text-center text-xl font-bold mb-4">
              Pesquisar{" "}
              {contentTypes.find((type) => type.id === selectedType).name}
            </h4>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conteúdo..."
              className="w-full p-2 mb-4 bg-zinc-900 rounded-full border-2 border-red-600 indent-2 text-sm outline-none"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mb-4"
            >
              <Search className="inline mr-2" size={20} />
              Buscar
            </button>
            {searchResults.length > 0 ? (
              <ul className="bg-zinc-800 rounded-lg p-4">
                {searchResults.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleContentSelect(item)}
                    className="cursor-pointer hover:bg-zinc-700 p-2 rounded"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            ) : (
              searchTerm && (
                <p className="text-center text-gray-400">
                  Nenhum resultado encontrado.
                </p>
              )
            )}
            <button
              onClick={handleCancel}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Voltar
            </button>
          </div>
        ) : (
          renderForm()
        )}
      </div>
    );
  }
}

EditContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default EditContent;
