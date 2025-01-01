import PropTypes from "prop-types";

const DeleteContent = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-zinc-900 p-6 rounded-lg">
      <h2 className="text-2xl mb-4">Deletar Conteúdo</h2>
      <p>Tem certeza que deseja deletar este conteúdo?</p>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="mr-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancelar
        </button>
        <button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Deletar
        </button>
      </div>
    </div>
  </div>
);

DeleteContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default DeleteContent;
