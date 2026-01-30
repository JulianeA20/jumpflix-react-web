import { useState, useEffect, useMemo, useCallback } from "react";
import PageLayout from "../components/PageLayout";
import SerieList from "../components/SerieList";
import { getDoramas } from "../services/database";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");
const ITEMS_PER_PAGE = 30;

const Kdramas = () => {
  const [allDoramas, setAllDoramas] = useState([]);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDoramas = async () => {
      const doramas = await getDoramas();
      setAllDoramas(doramas);
    };
    fetchDoramas();
  }, []);

  const filteredDoramas = useMemo(() => {
    if (currentLetter) {
      return allDoramas.filter((dorama) =>
        dorama.title.toUpperCase().startsWith(currentLetter)
      );
    }
    return allDoramas;
  }, [currentLetter, allDoramas]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentLetter]);

  const { totalPages, currentDoramas } = useMemo(() => {
    const total = Math.ceil(filteredDoramas.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const current = filteredDoramas.slice(startIndex, endIndex);
    return { totalPages: total, currentDoramas: current };
  }, [filteredDoramas, currentPage]);

  const handleLetterClick = useCallback((letter) => {
    setCurrentLetter(letter === currentLetter ? null : letter);
  }, [currentLetter]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  return (
    <PageLayout>
      {/* Alphabet and number buttons */}
      <div className="flex flex-wrap gap-2 mt-3 px-3 mb-6">
        {NUMBERS.map((number) => (
          <button
            key={number}
            onClick={() => handleLetterClick(number)}
            className={`px-3 py-1 rounded ${currentLetter === number
              ? "bg-red-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {number}
          </button>
        ))}
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`px-3 py-1 rounded ${currentLetter === letter
              ? "bg-red-600 text-white"
              : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {letter}
          </button>
        ))}
      </div>

      <SerieList series={currentDoramas} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>{currentPage} de {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">
            <ChevronRight />
          </button>
        </div>
      )}
    </PageLayout>
  );
};

export default Kdramas;
