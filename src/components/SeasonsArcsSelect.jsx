import PropTypes from "prop-types";

const SeasonsArcsSelect = ({ value, onChange }) => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

  return (
    <select
      value={value || 1}
      onChange={onChange}
      className="mb-2 px-4 py-2 w-full bg-zinc-950 border-2 border-red-600 rounded"
    >
      {numbers.map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  );
};

SeasonsArcsSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

export default SeasonsArcsSelect;
