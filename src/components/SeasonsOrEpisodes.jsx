import { useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "../services/supabaseClient";

// Função utilitária para calcular a duração do vídeo enviado
const calculateVideoDuration = (file) =>
  new Promise((resolve) => {
    if (!file) return resolve("");
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration); // segundos
    };
    video.src = URL.createObjectURL(file);
  });

const uploadFile = async (bucket, file) => {
  if (!file) return null;
  const filePath = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) {
    console.error("Erro ao fazer upload:", error);
    return null;
  }
  const { publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath).data;
  return publicUrl;
};

const SeasonsOrEpisodes = ({
  contentType,
  formData,
  onComplete,
  onBackToContentSelection,
}) => {
  // Tabela de referência
  const isAnime = contentType === "Anime";
  const totalSeasons = Math.max(Number(formData.seasons || 1), 1);

  // Estados para navegação
  const [seasonIndex, setSeasonIndex] = useState(1);
  const [episodeIndex, setEpisodeIndex] = useState(1);
  const [episodesData, setEpisodesData] = useState({});

  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    synopsis: "",
    thumbnail: null,
    video: null,
    duration: "",
  });
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); 

  const ensureSeason = (season) => {
    setEpisodesData((prev) =>
      prev[season] ? prev : { ...prev, [season]: [] }
    );
  };

  const handleBackToSeason = () => {
    setEpisodeForm({
      title: "",
      synopsis: "",
      thumbnail: null,
      video: null,
      duration: "",
    });
    setStep(1);
    setSaving(false);
  };

  const handleChooseSeason = (targetSeason) => {
    ensureSeason(targetSeason);
    setSeasonIndex(targetSeason);
    setEpisodeIndex((episodesData[targetSeason]?.length || 0) + 1);
    setStep(2);
  };

  const handleSaveEpisode = async (advanceType = "next-ep") => {
    setSaving(true);
    try {
      const duration = await calculateVideoDuration(episodeForm.video);
      const thumbnailUrl = await uploadFile(
        "thumbnails",
        episodeForm.thumbnail
      );
      const videoUrl = await uploadFile("videos", episodeForm.video);

      const insertResult = await supabase.from("episodes").insert([
        {
          title: episodeForm.title.trim(),
          synopsis: episodeForm.synopsis.trim(),
          thumbnailUrl,
          videoUrl,
          duration,
          season_or_arc: seasonIndex,
          episode: episodeIndex,
          parentTitle: formData.title, // Troque por ID se tiver
        },
      ]);
      if (insertResult.error) throw insertResult.error;

      // Salva no estado local
      setEpisodesData((prev) => {
        const arr = prev[seasonIndex] || [];
        return {
          ...prev,
          [seasonIndex]: [
            ...arr,
            { ...episodeForm, thumbnailUrl, videoUrl, duration },
          ],
        };
      });

      setEpisodeForm({
        title: "",
        synopsis: "",
        thumbnail: null,
        video: null,
        duration: "",
      });

      // Lógica de navegação
      if (advanceType === "next-ep") {
        setEpisodeIndex((prev) => prev + 1);
      } else if (advanceType === "next-season") {
        setStep(1);
        setSeasonIndex((prev) => prev + 1);
        setEpisodeIndex(1);
      } else if (advanceType === "finish") {
        setSaving(false);
        alert("Todos os episódios cadastrados com sucesso!");
        onComplete && onComplete();
        return;
      }
    } catch (error) {
      alert("Erro ao salvar episódio: " + error.message);
    }
    setSaving(false);
  };

  // Preencher campos do episódio
  const handleEpisodeFormChange = (e) => {
    const { name, value, files } = e.target;
    setEpisodeForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Campos de label
  const labelSeason = isAnime ? "arco" : "temporada";

  return (
    <div className="bg-zinc-950 rounded-lg p-6 mb-8 mx-auto max-w-2xl mt-16">
      {/* Etapa 1: Seleção da temporada/arco */}
      {step === 1 && (
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-4 text-center">
              Escolha {labelSeason}
            </h2>
            <div className="flex flex-col items-center gap-4 mb-6">
              {Array.from({ length: totalSeasons }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChooseSeason(idx + 1)}
                  className={`${
                    seasonIndex === idx + 1
                      ? "bg-red-600 text-white"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  } font-bold w-10 h-10 rounded transition-colors duration-300 flex items-center justify-center`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onBackToContentSelection}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold text-base py-2 px-4 rounded transition-colors duration-300"
            >
              Voltar
            </button>
          </div>
        </div>
      )};

      {/* Etapa 2: Cadastro de episódio */}
      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 text-center">
              {labelSeason} {seasonIndex} — Episódio {episodeIndex}
            </h2>
            <label className="block mt-2">Título do episódio</label>
            <input
              type="text"
              name="title"
              value={episodeForm.title}
              onChange={handleEpisodeFormChange}
              className="px-4 py-2 w-full border-2 border-red-600 bg-transparent rounded"
              required
            />
            <label className="block mt-2">Sinopse</label>
            <textarea
              name="synopsis"
              value={episodeForm.synopsis}
              onChange={handleEpisodeFormChange}
              className="px-4 py-2 w-full border-2 border-red-600 bg-transparent rounded"
              required
            />
            <label className="block mt-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              name="thumbnail"
              onChange={handleEpisodeFormChange}
              className="mb-2 w-full border-2 border-red-600 rounded"
              required
            />
            <label className="block mt-2">Vídeo</label>
            <input
              type="file"
              accept="video/*"
              name="video"
              onChange={handleEpisodeFormChange}
              className="mb-2 w-full border-2 border-red-600 rounded"
              required
            />
          </div>
          <div className="flex flex-wrap mt-6 gap-4">
            <button
              onClick={handleBackToSeason}
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
              disabled={saving}
            >
              Voltar para {labelSeason}
            </button>
            <button
              onClick={() => handleSaveEpisode("next-ep")}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              disabled={saving}
            >
              Próximo Episódio
            </button>
            {seasonIndex < totalSeasons && (
              <button
                onClick={() => handleSaveEpisode("next-season")}
                type="button"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded"
                disabled={saving}
              >
                Próxima {labelSeason}
              </button>
            )}
            {seasonIndex === totalSeasons && (
              <button
                onClick={() => handleSaveEpisode("finish")}
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                disabled={saving}
              >
                Finalizar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

SeasonsOrEpisodes.propTypes = {
  contentType: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  onComplete: PropTypes.func,
  onBackToContentSelection: PropTypes.func.isRequired,
};

export default SeasonsOrEpisodes;
