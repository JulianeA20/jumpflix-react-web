import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getMovies, getSeries, getAnimes, getDoramas } from "../services/database";
import { Star, Film, Tv, Drama, Swords, CirclePlay, ChevronLeft, ChevronRight, Play, Info } from "lucide-react";

const Dashboard = () => {
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ movies: 0, series: 0, animes: 0, doramas: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredContent, setFeaturedContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllContent();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (featuredContent.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [featuredContent.length]);

  const fetchAllContent = async () => {
    try {
      setLoading(true);

      // Buscar todos os conteúdos em paralelo
      const [moviesData, seriesData, animesData, doramasData] = await Promise.all([
        getMovies(),
        getSeries(),
        getAnimes(),
        getDoramas(),
      ]);

      // Adicionar propriedade 'type' a cada item
      const movies = moviesData.map(item => ({ ...item, type: 'movie', typeName: 'Filme' }));
      const series = seriesData.filter(item => !item.isDorama).map(item => ({ ...item, type: 'series', typeName: 'Série' }));
      const animes = animesData.map(item => ({ ...item, type: 'anime', typeName: 'Anime' }));
      const doramas = doramasData.map(item => ({ ...item, type: 'dorama', typeName: 'Dorama' }));

      // Combinar tudo
      const combined = [...movies, ...series, ...animes, ...doramas];

      // Ordenar por mais recente (assumindo que IDs maiores = mais novos)
      combined.sort((a, b) => b.id - a.id);

      setAllContent(combined);

      // Selecionar os 3 primeiros para destaque
      setFeaturedContent(combined.slice(0, 3));

      // Calcular estatísticas
      setStats({
        movies: movies.length,
        series: series.length,
        animes: animes.length,
        doramas: doramas.length,
      });
    } catch (error) {
      console.error("Erro ao buscar conteúdo:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleCardClick = (item) => {
    navigate(`/content/${item.type}/${item.id}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'movie': return 'bg-red-600';
      case 'series': return 'bg-blue-600';
      case 'dorama': return 'bg-purple-600';
      case 'anime': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'movie': return <Film size={16} />;
      case 'series': return <Tv size={16} />;
      case 'dorama': return <Drama size={16} />;
      case 'anime': return <Swords size={16} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner fullScreen={false} message="Carregando conteúdo..." />
      </PageLayout>
    );
  }

  const totalContent = stats.movies + stats.series + stats.animes + stats.doramas;

  return (
    <PageLayout>
      <div className="px-8 py-8">
        {/* Featured Carousel - Hero Section */}
        {featuredContent.length > 0 && (
          <div className="relative w-full h-[70vh] mb-10 border-2 border-white rounded-lg overflow-hidden">
            {featuredContent.map((item, index) => (
              <div
                key={`featured-${item.type}-${item.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 rounded-lg">
                  <img
                    src={item.thumbnailUrl || item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-20 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-8 w-full">
                    <div className="max-w-2xl">
                      {/* Type Badge */}
                      <div className={`inline-flex items-center gap-2 ${getTypeColor(item.type)} px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
                        {getTypeIcon(item.type)}
                        {item.typeName}
                      </div>

                      {/* Title */}
                      <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
                        {item.title}
                      </h2>

                      {/* Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleCardClick(item)}
                          className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                        >
                          <Play size={24} fill="currentColor" />
                          Assistir
                        </button>
                        <button
                          onClick={() => handleCardClick(item)}
                          className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-500 transition-all"
                        >
                          <Info size={24} />
                          Mais Informações
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hover:text-red-600 transition-duration:300 text-white p-3 rounded-full transition-all"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hover:text-red-600 text-white p-3 rounded-full transition-all"
            >
              <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {featuredContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-6 bg-gray-400/50'
                    }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="max-w-full mx-auto">
          {/* Título da seção */}
          <h1 className="text-2xl font-bold mb-6">Adicionados Recentemente</h1>

          {/* Grid de conteúdo */}
          {allContent.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-2">Nenhum conteúdo encontrado</p>
              <p className="text-gray-500">Adicione conteúdo para começar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {allContent.map((item) => (
                <ContentCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onClick={() => handleCardClick(item)}
                  typeColor={getTypeColor(item.type)}
                  typeIcon={getTypeIcon(item.type)}
                />
              ))}
            </div>
          )}

          {/* Contador */}
          <div className="mt-8 text-center text-gray-400">
            Mostrando {allContent.length} {allContent.length === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};



// Componente de card de conteúdo
const ContentCard = ({ item, onClick, typeColor, typeIcon }) => (
  <div
    onClick={onClick}
    className="relative group cursor-pointer"
  >
    <div className="w-full aspect-[2/3] overflow-hidden rounded-md">
      {item.posterUrl ? (
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-gray-600">
          {typeIcon}
        </div>
      )}

      {/* Overlay no hover */}
      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
        <div className="text-center px-4">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-white text-sm mb-1">
            {item.releaseYear}
          </p>

          {/* Badge de tipo */}
          <div className={`inline-flex items-center gap-1 ${typeColor} px-2 py-1 rounded text-xs font-semibold mb-2`}>
            {typeIcon}
            {item.typeName}
          </div>

          <div className="text-white hover:text-red-600 transition-colors duration-300 flex justify-center">
            <CirclePlay size={50} strokeWidth={1.2} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
