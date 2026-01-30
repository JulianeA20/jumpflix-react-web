import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { getMovies, getSeries, getAnimes, getDoramas } from "../services/database";
import { Star, Film, Tv, Drama, Swords } from "lucide-react";

const Dashboard = () => {
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ movies: 0, series: 0, animes: 0, doramas: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllContent();
  }, []);

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
      setFilteredContent(combined);

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

  const handleFilter = (type) => {
    setActiveFilter(type);

    if (type === "all") {
      setFilteredContent(allContent);
    } else {
      setFilteredContent(allContent.filter(item => item.type === type));
    }
  };

  const handleCardClick = (item) => {
    navigate(`/content/${item.type}/${item.id}`);
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
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xl text-gray-400">Carregando conteúdo...</p>
        </div>
      </PageLayout>
    );
  }

  const totalContent = stats.movies + stats.series + stats.animes + stats.doramas;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard - Gerenciar Conteúdo</h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8">
          <FilterButton
            active={activeFilter === "all"}
            onClick={() => handleFilter("all")}
            icon={null}
            label="Todos"
            count={totalContent}
            color="bg-zinc-700"
          />
          <FilterButton
            active={activeFilter === "movie"}
            onClick={() => handleFilter("movie")}
            icon={<Film size={18} />}
            label="Filmes"
            count={stats.movies}
            color="bg-red-600"
          />
          <FilterButton
            active={activeFilter === "series"}
            onClick={() => handleFilter("series")}
            icon={<Tv size={18} />}
            label="Séries"
            count={stats.series}
            color="bg-blue-600"
          />
          <FilterButton
            active={activeFilter === "dorama"}
            onClick={() => handleFilter("dorama")}
            icon={<Drama size={18} />}
            label="Doramas"
            count={stats.doramas}
            color="bg-purple-600"
          />
          <FilterButton
            active={activeFilter === "anime"}
            onClick={() => handleFilter("anime")}
            icon={<Swords size={18} />}
            label="Animes"
            count={stats.animes}
            color="bg-green-600"
          />
        </div>

        {/* Grid de conteúdo */}
        {filteredContent.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400 mb-2">Nenhum conteúdo encontrado</p>
            <p className="text-gray-500">Adicione conteúdo para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredContent.map((item) => (
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
          Mostrando {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'itens'}
        </div>
      </div>
    </PageLayout>
  );
};

// Componente de botão de filtro
const FilterButton = ({ active, onClick, icon, label, count, color }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300
      ${active
        ? `${color} text-white scale-105`
        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
      }
    `}
  >
    {icon}
    <span>{label}</span>
    <span className={`
      px-2 py-0.5 rounded-full text-xs
      ${active ? 'bg-black bg-opacity-30' : 'bg-zinc-900'}
    `}>
      {count}
    </span>
  </button>
);

// Componente de card de conteúdo
const ContentCard = ({ item, onClick, typeColor, typeIcon }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-900/20"
  >
    {/* Poster */}
    <div className="relative aspect-[2/3] bg-zinc-800">
      {item.posterUrl ? (
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          {typeIcon}
        </div>
      )}

      {/* Badge de tipo */}
      <div className={`absolute top-2 right-2 ${typeColor} px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}>
        {typeIcon}
        {item.typeName}
      </div>
    </div>

    {/* Informações */}
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

export default Dashboard;
