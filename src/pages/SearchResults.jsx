import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import MovieList from "../components/MovieList";
import SerieList from "../components/SerieList";
import { searchAllContent } from "../services/database";
import { ChevronLeft, ChevronRight, Search as SearchIcon, SearchX } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ITEMS_PER_PAGE = 30;

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [searchResults, setSearchResults] = useState({
        movies: [],
        series: [],
        animes: [],
        doramas: [],
    });
    const [currentLetter, setCurrentLetter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setSearchResults({ movies: [], series: [], animes: [], doramas: [] });
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(false);
            try {
                const results = await searchAllContent(query);
                setSearchResults(results);
            } catch (err) {
                console.error("Erro ao buscar resultados:", err);
                setSearchResults({ movies: [], series: [], animes: [], doramas: [] });
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    // Combinar todos os resultados em um único array para filtragem
    const allResults = useMemo(() => {
        return [
            ...searchResults.movies.map((item) => ({ ...item, type: "movie" })),
            ...searchResults.series.map((item) => ({ ...item, type: "series" })),
            ...searchResults.animes.map((item) => ({ ...item, type: "anime" })),
            ...searchResults.doramas.map((item) => ({ ...item, type: "dorama" })),
        ];
    }, [searchResults]);

    // Filtrar por letra
    const filteredResults = useMemo(() => {
        if (currentLetter) {
            return allResults.filter((item) =>
                item.title.toUpperCase().startsWith(currentLetter)
            );
        }
        return allResults;
    }, [currentLetter, allResults]);

    // Resetar página quando filtro muda
    useEffect(() => {
        setCurrentPage(1);
    }, [currentLetter, query]);

    // Paginação
    const { totalPages, currentResults } = useMemo(() => {
        const total = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const current = filteredResults.slice(startIndex, endIndex);
        return { totalPages: total, currentResults: current };
    }, [filteredResults, currentPage]);

    // Agrupar resultados paginados por categoria
    const groupedResults = useMemo(() => {
        return {
            movies: currentResults.filter((item) => item.type === "movie"),
            series: currentResults.filter((item) => item.type === "series"),
            animes: currentResults.filter((item) => item.type === "anime"),
            doramas: currentResults.filter((item) => item.type === "dorama"),
        };
    }, [currentResults]);

    const handleLetterClick = useCallback((letter) => {
        setCurrentLetter(letter === currentLetter ? null : letter);
    }, [currentLetter]);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const totalResults = allResults.length;

    return (
        <PageLayout>
            <div className="space-y-8">
                {/* Header com ícone de busca */}
                <div className="flex items-center gap-4 border-b border-gray-700 pt-4 pb-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full">
                        <SearchIcon size={25} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">
                            Resultados para: <span className="text-red-600">"{query}"</span>
                        </h1>
                        {!loading && totalResults > 0 && (
                            <p className="text-gray-400 mt-1">
                                {totalResults} {totalResults === 1 ? "resultado encontrado" : "resultados encontrados"}
                            </p>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mb-4"></div>
                        <p className="text-gray-400 text-lg">Buscando conteúdo...</p>
                    </div>
                ) : error || totalResults === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6">
                        <div className="flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full">
                            <SearchX size={40} className="text-gray-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-white">
                                Nenhum resultado encontrado
                            </h2>
                            <p className="text-gray-400 text-md max-w-md">
                                Não encontramos nada para "{query}". Tente pesquisar com outras palavras-chave.
                            </p>
                        </div>
                        <div className="bg-gray-700/50 rounded-lg p-6 max-w-md">
                            <p className="text-gray-300 text-sm">
                                <strong>Dicas:</strong>
                            </p>
                            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mt-2">
                                <li>Verifique a ortografia</li>
                                <li>Use termos mais gerais</li>
                                <li>Tente palavras-chave diferentes</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Alphabet filter */}
                        <div className="bg-zinc-900/50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                                Filtrar por letra
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {ALPHABET.map((letter) => (
                                    <button
                                        key={letter}
                                        onClick={() => handleLetterClick(letter)}
                                        className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 ${currentLetter === letter
                                                ? "bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105"
                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
                                            }`}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                            {currentLetter && (
                                <p className="text-sm text-gray-400 mt-3">
                                    Exibindo resultados que começam com "{currentLetter}"
                                </p>
                            )}
                        </div>

                        {/* Results by category */}
                        <div className="space-y-8">
                            {groupedResults.movies.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-l-4 border-red-600 pl-4">
                                        <span className="text-3xl">📽️</span>
                                        <h2 className="text-2xl font-bold">
                                            Filmes <span className="text-red-600">({groupedResults.movies.length})</span>
                                        </h2>
                                    </div>
                                    <MovieList movies={groupedResults.movies} />
                                </div>
                            )}

                            {groupedResults.series.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-l-4 border-red-600 pl-4">
                                        <span className="text-3xl">📺</span>
                                        <h2 className="text-2xl font-bold">
                                            Séries <span className="text-red-600">({groupedResults.series.length})</span>
                                        </h2>
                                    </div>
                                    <SerieList series={groupedResults.series} />
                                </div>
                            )}

                            {groupedResults.animes.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-l-4 border-red-600 pl-4">
                                        <span className="text-3xl">🎌</span>
                                        <h2 className="text-2xl font-bold">
                                            Animes <span className="text-red-600">({groupedResults.animes.length})</span>
                                        </h2>
                                    </div>
                                    <SerieList series={groupedResults.animes} />
                                </div>
                            )}

                            {groupedResults.doramas.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 border-l-4 border-red-600 pl-4">
                                        <span className="text-3xl">🎭</span>
                                        <h2 className="text-2xl font-bold">
                                            Doramas <span className="text-red-600">({groupedResults.doramas.length})</span>
                                        </h2>
                                    </div>
                                    <SerieList series={groupedResults.doramas} />
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-4 pb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                                >
                                    <ChevronLeft size={20} />
                                    <span className="hidden sm:inline">Anterior</span>
                                </button>
                                <div className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg font-semibold">
                                    <span>Página {currentPage}</span>
                                    <span className="text-red-200">de</span>
                                    <span>{totalPages}</span>
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                                >
                                    <span className="hidden sm:inline">Próxima</span>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default SearchResults;
