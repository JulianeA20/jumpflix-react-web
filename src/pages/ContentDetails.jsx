import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import HeaderBack from "../components/HeaderBack";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { getContentDetails, addToFavorites, removeFromFavorites, isFavorite } from "../services/database";
import { supabase } from "../services/supabaseClient";
import { Play, Star, Heart } from "lucide-react";

const ContentDetails = () => {
  const { id, type } = useParams();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  useEffect(() => {
    const fetchContentDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getContentDetails(id, type);
        setContent(details);
      } catch (error) {
        console.error("Erro ao buscar detalhes do conteúdo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentDetails();
  }, [id, type]);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao buscar sessão do usuário:", error);
      } else if (user) {
        setUser(user);
      }
    } catch (err) {
      console.error("Erro inesperado ao buscar sessão:", err);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchUserData]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user?.id && content?.id) {
        try {
          const favorited = await isFavorite(user.id, content.id, type);
          setIsFavorited(favorited);
        } catch (error) {
          console.error("Erro ao verificar favorito:", error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, content, type]);

  if (isLoading) {
    return <LoadingSpinner message="Carregando conteúdo..." />;
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-xl text-gray-400">Conteúdo não encontrado.</p>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    if (!user?.id) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Login Necessário",
        message: "Faça login para adicionar aos favoritos!"
      });
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(user.id, content.id, type);
        setIsFavorited(false);
        setModal({
          isOpen: true,
          type: "success",
          title: "Removido!",
          message: "Conteúdo removido dos favoritos."
        });
      } else {
        await addToFavorites(user.id, content.id, type);
        setIsFavorited(true);
        setModal({
          isOpen: true,
          type: "success",
          title: "Adicionado!",
          message: "Conteúdo adicionado aos favoritos."
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos: ", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Erro",
        message: "Erro ao atualizar favoritos. Tente novamente."
      });
    }
  };

  const handlePlay = () => {
    setShowControls(true);
    const videoElement = document.getElementById("content-video");
    if (videoElement) {
      videoElement.play();
    }
  };

  const renderContent = () => {
    if (type === "movie") {
      return (
        <div className="relative bg-black rounded-lg overflow-hidden max-w-4xl mx-auto">
          {content.videoUrl ? (
            <>
              <div className="relative w-full h-0 pb-[56.25%]">
                <video
                  id="content-video"
                  controls={showControls}
                  poster={content.thumbnailUrl}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                >
                  <source src={content.videoUrl} type="video/mp4" />
                  Seu navegador não suporta o elemento de video.
                </video>

                {!showControls && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-4xl"
                  >
                    <Play size={48} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="relative w-full h-0 pb-[56.25%]">
              <img
                src={content.thumbnailUrl}
                alt="Thumbnail"
                className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <div className="flex space-x-2 mb-4">
            {content.seasons.map((season) => (
              <button
                key={season.number}
                onClick={() => setSelectedSeason(season.number)}
                className={`px-4 py-2 rounded-full ${selectedSeason === season.number
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300"
                  }`}
              >
                {season.number}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {content.seasons
              .find((s) => s.number === selectedSeason)
              ?.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-gray-800 p-4 rounded-lg flex items-center"
                >
                  <img
                    src={episode.thumbnailUrl}
                    alt={episode.title}
                    className="w-24 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{episode.title}</h3>
                    <p className="text-sm text-gray-400">
                      Episódio {episode.number}
                    </p>
                  </div>
                  <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-full">
                    <Play size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${content.posterUrl})` }}
    >
      <div className="backdrop-blur-md bg-black/50 min-h-screen">
        <HeaderBack user={user} className="mb-6" />

        <div className="container mx-auto px-4 py-8 pt-36 relative">
          <div className="fixed top-36 left-10">
            <div className="relative mb-6">
              <img
                src={content.posterUrl}
                alt={content.title}
                className="w-64 rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-2 -right-3 bg-yellow-400 text-black rounded-full w-16 h-16 flex items-center justify-center">
                <Star className="w-4 h-4 mr-1" />
                <span className="font-bold">{content.imdbRating || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="ml-[280px] flex-1">
            <div className="bg-black bg-opacity-80 rounded-lg p-8 backdrop-filter backdrop-blur-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <button
                  onClick={handleToggleFavorite}
                  className="transition-colors hover:scale-110 transform duration-200"
                >
                  <Heart
                    size={24}
                    className={`transition-all ${isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-white hover:text-red-500"
                      }`}
                  />
                </button>
              </div>
              <div className="flex items-center text-gray-300 mb-4">
                <span className="mr-4">{content.releaseYear}</span>
                <span>
                  {type === "movie"
                    ? `${content.duration || 0}min`
                    : `${content.seasons?.length || 0} ${content.seasons?.length === 1
                      ? "temporada"
                      : "temporadas"
                    }`}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{content.synopsis}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 p-8">
          <h2 className="text-2xl text-center font-bold text-white mb-4">
            {type === "movie" ? "Conteúdo" : "Episódios"}
          </h2>
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default ContentDetails;
