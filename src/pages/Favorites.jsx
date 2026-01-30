import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { getUserFavorites, getMovieById, getSeriesById, getAnimeById } from "../services/database";
import { supabase } from "../services/supabaseClient";
import { Star, Film, Tv, Drama, Swords, Heart } from "lucide-react";
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserAndFavorites();
  }, []);
  const fetchUserAndFavorites = async () => {
    try {
      setLoading(true);
      
      // Buscar usuário
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        navigate("/"); // Redirecionar se não autenticado
        return;
      }
      
      setUser(user);
      
      // Buscar favoritos
      const favoritesData = await getUserFavorites(user.id);
      
      // Buscar detalhes de cada favorito
      const favoritesWithDetails = await Promise.all(
        favoritesData.map(async (fav) => {
          let contentDetails;
          switch (fav.content_type) {
            case 'movie':
              contentDetails = await getMovieById(fav.content_id);
              break;
            case 'series':
            case 'dorama':
              contentDetails = await getSeriesById(fav.content_id);
              break;
            case 'anime':
              contentDetails = await getAnimeById(fav.content_id);
              break;
          }
          return {
            ...fav,
            ...contentDetails,
            type: fav.content_type
          };
        })
      );
      
      setFavorites(favoritesWithDetails);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCardClick = (item) => {
    navigate(`/content/${item.type}/${item.content_id}`);
  };
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xl text-gray-400">Carregando favoritos...</p>
        </div>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="fill-red-500 text-red-500" size={32} />
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        </div>
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-600 mb-4" />
            <p className="text-xl text-gray-400 mb-2">Nenhum favorito ainda</p>
            <p className="text-gray-500 mb-6">
              Adicione conteúdos aos favoritos clicando no ícone de coração!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
            >
              Explorar Conteúdo
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((item) => (
                <FavoriteCard
                  key={`${item.type}-${item.content_id}`}
                  item={item}
                  onClick={() => handleCardClick(item)}
                />
              ))}
            </div>
            
            <div className="mt-8 text-center text-gray-400">
              {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};
const FavoriteCard = ({ item, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-900/20"
  >
    <div className="relative aspect-[2/3] bg-zinc-800">
      {item.posterUrl && (
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute top-2 left-2">
        <Heart
          size={20}
          className="fill-red-500 text-red-500"
        />
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
        {item.title}
      </h3>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{item.releaseYear}</span>
        {item.imdbRating && (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-yellow-500 text-yellow-500" />
            <span>{item.imdbRating}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
export default Favorites;