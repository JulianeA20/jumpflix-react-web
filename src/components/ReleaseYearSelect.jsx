import PropTypes from "prop-types";

const ReleaseYearSelect = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);

  return (
    <select
      value={value || currentYear}
      onChange={onChange}
      className="mb-2 px-4 py-2 w-full bg-zinc-950 border-2 border-red-600 rounded"
    >
      {years.map((year) => (
        <option value={year} key={year} className="bg-black">
          {year}
        </option>
      ))}
    </select>
  );
};

ReleaseYearSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

export default ReleaseYearSelect;
