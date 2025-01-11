import { useState, useRef, useMemo, useEffect } from "react";
import { addMovie, addSeries, addAnime } from "../services/database";
import { supabase } from "../services/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { CircleMinus, CirclePlus } from "lucide-react";

const contentTypes = [
  { id: "movie", name: "Filme" },
  { id: "series", name: "Série" },
  { id: "kdrama", name: "Dorama" },
  { id: "anime", name: "Anime" },
];

const AddContent = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [posterPreview, setPosterPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const ratingIntervalRef = useRef(null);
  const longPressTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  const generateYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1930; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({});
    setPosterPreview(null);
    setThumbnailPreview(null);
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
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            onUploadProgress: (progressEvent) => {
              const percent =
                (progressEvent.loaded / progressEvent.total) * 100;
              setProgress((prevProgress) => Math.max(prevProgress, percent));
            },
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      };

      setProgress(10);
      const posterUrl = await uploadFile(formData.poster, "posters");
      setProgress(40);

      let thumbnailUrl = null;
      if (formData.thumbnail) {
        thumbnailUrl = await uploadFile(formData.thumbnail, "thumbnails");
      }
      setProgress(70);

      let videoUrl = null;
      if (formData.video) {
        videoUrl = await uploadFile(formData.video, "videos");
      }
      setProgress(90);

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
          result = await addMovie(contentData);
          break;
        case "series":
        case "kdrama":
          result = await addSeries({
            ...contentData,
            isDorama: selectedType === "kdrama",
          });
          break;
        case "anime":
          result = await addAnime(contentData);
          break;
        default:
          throw new Error("Tipo de conteúdo desconhecido");
      }

      if (result.error) throw result.error;

      setProgress(100);
      alert("Conteúdo adicionado com sucesso!");
      setSelectedType(null);
      setFormData({});
      setPosterPreview(null);
      setThumbnailPreview(null);
    } catch (error) {
      console.error("Erro ao adicionar conteúdo:", error);
      alert("Erro ao adicionar conteúdo. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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
    setFormData({});
    setPosterPreview(null);
    setThumbnailPreview(null);
  };

  const commonFields = (
    <>
      <label className="block text-sm font-bold ml-2 mb-2">Titulo</label>
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
          <div className="relative">
            <select
              name="releaseYear"
              value={formData.releaseYear || ""}
              onChange={handleInputChange}
              className="w-full px-5 py-2 mb-4 bg-zinc-900 rounded-full border-2 border-red-600 text-sm outline-none appearance-none"
              required
            >
              <option value="" disabled className="text-sm">
                Selecione o ano
              </option>
              {generateYears.map((year) => (
                <option key={year} value={year} className="text-sm">
                  {year}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-3.5 right-1 flex items-center px-2 text-zinc-200">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
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
                className="focus:outline-none"
              >
                <CircleMinus
                  size={20}
                  className=" transition-colors duration-300 hover:text-red-600"
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
          required
        />
        {posterPreview && (
          <img
            src={posterPreview}
            alt="Poster Preview"
            className="mt-2 max-w-xs"
          />
        )}
      </div>
    </>
  );

  const renderForm = () => {
    switch (selectedType) {
      case "movie":
        return (
          <form onSubmit={handleSubmit}>
            {commonFields}
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
                required
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
              <label className="block text-sm font-bold ml-2 mb-2">Vídeo</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-4 py-2 border-2 border-red-600 rounded-full text-sm"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-sm text-white font-bold py-2 px-4 rounded"
              >
                Adicionar Filme
              </button>
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
      case "series":
      case "kdrama":
        return (
          <form onSubmit={handleSubmit}>
            {commonFields}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-sm text-white font-bold py-2 px-4 rounded"
              >
                Adicionar {selectedType === "series" ? "Série" : "Dorama"}
              </button>
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
      case "anime":
        return (
          <form onSubmit={handleSubmit}>
            {commonFields}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-sm text-white font-bold py-2 px-4 rounded"
              >
                Adicionar Anime
              </button>
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
        <>
          {renderForm()}
          {isSubmitting && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${progress}` }}
                ></div>
                </div>
                <p className="text-center mt-2">{Math.round(progress)}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddContent;
