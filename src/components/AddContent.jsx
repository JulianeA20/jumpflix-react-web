import { useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "../services/supabaseClient";
import ReleaseYearSelect from "./ReleaseYearSelect";
import SeasonsArcsSelect from "./SeasonsArcsSelect";
import SeasonsOrEpisodes from "./SeasonsOrEpisodes";
import { CircleMinus, CirclePlus } from "lucide-react";

const AddContent = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState(null);
  const [imdbInterval, setImdbInterval] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    imdbRating: 0,
    synopsis: "",
    posterUrl: null,
    thumbnailUrl: null,
    videoUrl: null,
    duration: "",
    seasons: 1,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSelectContentType = (type) => {
    setContentType(type);
    setStep(2);
  };

  const handleBackToTypeSelection = () => {
    setStep(1);
    setContentType(null);
    setFormData({
      title: "",
      releaseYear: "",
      imdbRating: "",
      synopsis: "",
      posterUrl: "",
      thumbnailUrl: "",
      videoUrl: "",
      seasons: 1,
    });
  };

  const handleImdbPlus = () => {
    setFormData((prevData) => {
      const newRating = Math.min(10, +(prevData.imdbRating + 0.1).toFixed(1));
      return { ...prevData, imdbRating: newRating };
    });
  };

  const handleImdbMinus = () => {
    setFormData((prevData) => {
      const newRating = Math.max(0, +(prevData.imdbRating - 0.1).toFixed(1));
      return { ...prevData, imdbRating: newRating };
    });
  };

  const startImdbContinuous = (modifier) => {
    if (imdbInterval) return;
    const fn = modifier > 0 ? handleImdbPlus : handleImdbMinus;
    const interval = setInterval(fn, 100);
    setImdbInterval(interval);
  };

  const stopImdbContinuous = () => {
    if (imdbInterval) {
      clearInterval(imdbInterval);
      setImdbInterval(null);
    }
  };

  const uploadFile = async (bucket, file) => {
    if (!file) return null;

    const filePath = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("Erro ao fazer upload:", error);
      return null;
    }

    const { publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath).data;
    return publicUrl;
  };

  const calculateVideoDuration = (videoFile) => {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);

          const durationInSeconds = video.duration;
          if (isNaN(durationInSeconds)) {
            reject("O arquivo de vídeo parece inválido ou não tem duração.");
          }

          const hours = Math.floor(durationInSeconds / 3600);
          const minutes = Math.floor((durationInSeconds % 3600) / 60);
          const seconds = Math.floor(durationInSeconds % 60);

          const formattedDuration = [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
          ].join(":");

          resolve(formattedDuration);
        };

        video.onerror = () => {
          reject("Erro ao carregar vídeo. Verifique o arquivo.");
        };

        video.src = URL.createObjectURL(videoFile);
      } catch (error) {
        reject("Erro ao calcular a duração do vídeo.");
        alert("Erro ao calcular a duração do video:", error);
      }
    });
  };

  const handleSaveAndAdvance = async () => {
    try {
      const posterUrl = await uploadFile("posters", formData.posterUrl);

      let response;

      if (contentType === "Série" || contentType === "Dorama") {
        response = await supabase
          .from("series")
          .insert([
            {
              title: formData.title.trim(),
              releaseYear: formData.releaseYear,
              imdbRating: formData.imdbRating,
              synopsis: formData.synopsis,
              posterUrl,
              isDorama: contentType === "Dorama",
            },
          ])
          .select();

        if (response.error || !response.data || response.data.length === 0) {
          throw new Error(response.error?.message ||"Erro ao salvar a série ou dorama.");
        }

        const seriesId = response.data[0].id;

        const seasonsPayload = Array.from({ length: formData.seasons }).map(
          (_, index) => ({
            parentId: seriesId,
            number: index + 1,
            parentType: "series",
          })
        );

        const seasonsResponse = await supabase.from("seasons").insert(seasonsPayload);
      if (seasonsResponse.error) throw seasonsResponse.error;
    } else if (contentType === "Anime") {
      response = await supabase
        .from("animes")
        .insert([
          {
            title: formData.title.trim(),
            releaseYear: formData.releaseYear,
            imdbRating: formData.imdbRating,
            synopsis: formData.synopsis.trim(),
            posterUrl,
          },
        ])
        .select();

      if (response.error || !response.data || response.data.length === 0) {
        throw new Error(response.error?.message ||"Erro ao salvar o anime.");
      }

      const animeId = response.data[0].id;

      const arcsPayload = Array.from({ length: formData.seasons }).map(
        (_, index) => ({
          anime_id: animeId,
          number: index + 1,
        })
      );

      const arcsResponse = await supabase.from("arcs").insert(arcsPayload);
      if (arcsResponse.error) throw arcsResponse.error;
    }

      setStep(3);
    } catch (error) {
      console.error("Erro ao salvar o conteúdo:", error);
      alert("Erro ao salvar, tente novamente.");
    }
  };

  const handleSave = async () => {
    try {
      const posterUrl = await uploadFile("posters", formData.posterUrl);
      const thumbnailUrl = await uploadFile(
        "thumbnails",
        formData.thumbnailUrl
      );
      const videoUrl = await uploadFile("videos", formData.videoUrl);

      let duration = "";
      if (formData.videoUrl) {
        duration = await calculateVideoDuration(formData.videoUrl);
      }

      const response = await supabase.from("movies").insert([
        {
          title: formData.title.trim(),
          releaseYear: formData.releaseYear,
          imdbRating: formData.imdbRating,
          synopsis: formData.synopsis.trim(),
          posterUrl,
          thumbnailUrl,
          videoUrl,
          duration, // Duração do vídeo no formato `hh:mm:ss`
        },
      ]);

      if (response.error) {
        throw response.error;
      }

      alert("Conteúdo salvo com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o filme:", error);
      alert("Erro ao salvar o filme, tente novamente.");
    }
  };

  return (
    <div className="bg-zinc-950 rounded-lg p-6 mb-8 mx-auto max-w-2xl mt-16">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">
            Adicionar Conteúdo
          </h2>
          <p className="mb-4 text-center">
            Qual tipo de conteúdo você deseja adicionar?
          </p>
          <div className="grid grid-cols-2 gap-4">
            {["Filme", "Série", "Dorama", "Anime"].map((type) => (
              <button
                key={type}
                onClick={() => handleSelectContentType(type)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">
            Adicionar {contentType}
          </h2>
          <label className="text-sm font-bold block mb-2 ml-2 focus:outline-none">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mb-2 px-4 py-2 w-full border-2 border-red-600 bg-transparent rounded-full focus:outline-none"
          />
          <div className="flex justify-between">
            <div>
              <label className="text-sm font-bold block mb-2">
                Ano de lançamento
              </label>
              <ReleaseYearSelect
                value={formData.releaseYear}
                onChange={(e) =>
                  handleChange({
                    target: { name: "releaseYear", value: e.target.value },
                  })
                }
              />
            </div>

            {contentType !== "Filme" && (
              <div>
                <label className="text-sm font-bold block mb-2">
                  Número de {contentType === "Anime" ? "Arcos" : "Temporadas"}
                </label>
                <SeasonsArcsSelect
                  value={formData.totalSeasons}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "seasons", value: e.target.value },
                    })
                  }
                />
              </div>
            )}

            <div>
              <label className="text-sm font-bold block mb-2 ml-2">
                Nota IMDb
              </label>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  name="imdbRating"
                  value={formData.imdbRating}
                  readOnly
                  className="mb-2 px-4 py-2 w-24 bg-transparent border-2 border-red-600 rounded focus:outline-none"
                />
                <div className="flex flex-col gap-1">
                  <CirclePlus
                    size={20}
                    onClick={handleImdbPlus}
                    onMouseDown={() => startImdbContinuous(1)}
                    onMouseUp={stopImdbContinuous}
                    onMouseLeave={stopImdbContinuous}
                    className="transition-colors duration-300 hover:text-red-600"
                    tabIndex={-1}
                  />
                  <CircleMinus
                    size={20}
                    onClick={handleImdbMinus}
                    onMouseDown={() => startImdbContinuous(-1)}
                    onMouseUp={stopImdbContinuous}
                    onMouseLeave={stopImdbContinuous}
                    className="transition-colors duration-300 hover:text-red-600"
                    tabIndex={-1}
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="text-sm font-bold block mb-2 ml-2">Sinopse</label>
          <textarea
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            className="mb-2 px-4 py-2 w-full border-2 border-red-600 bg-transparent rounded focus:outline-none"
          ></textarea>
          <label className="text-sm font-bold block mb-2 ml-2">
            Poster de {contentType}
          </label>
          <input
            type="file"
            accept="image/*"
            name="posterUrl"
            onChange={handleChange}
            className="mb-2 px-4 py-2 w-full text-center text-sm border-2 border-red-600 bg-transparent rounded-full"
          />

          {contentType === "Filme" && (
            <>
              <label className="text-sm font-bold block mb-2 ml-2">
                Thumbnail do Filme
              </label>
              <input
                type="file"
                accept="image/*"
                name="thumbnailUrl"
                onChange={handleChange}
                className="mb-2 px-4 py-2 w-full text-center text-sm border-2 border-red-600 bg-transparent rounded-full"
              />

              <label className="text-sm font-bold block mb-2 ml-2">
                Vídeo do Filme
              </label>
              <input
                type="file"
                accept="video/*"
                name="videoUrl"
                onChange={handleChange}
                className="mb-2 px-4 py-2 w-full text-center text-sm border-2 border-red-600 bg-transparent rounded-full"
              />
            </>
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={handleBackToTypeSelection}
              className="transition-colors duration-300 bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded font-semibold"
            >
              Voltar
            </button>
            {contentType === "Filme" ? (
              <button
                onClick={handleSave}
                className="transition-colors duration-300 bg-green-600 hover:bg-green-700 py-2 px-4 rounded font-semibold"
              >
                Salvar
              </button>
            ) : (
              <button
                onClick={handleSaveAndAdvance}
                className="transition-colors duration-300 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded font-semibold"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      )}

      {step === 3 &&
        (contentType === "Série" ||
        contentType === "Dorama" ||
        contentType === "Anime") && (
          <SeasonsOrEpisodes
            contentType={contentType}
            formData={formData}
            onComplete={() => {
              onClose()
            }}
            onBackToContentSelection={handleBackToTypeSelection}
          />
        )}
    </div>
  );
};

AddContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddContent;
