const EditContent = ({ onClose }) => {
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-zinc-900 p-6 rounded-lg">
      <h2 className="text-2xl mb-4">Editar Conteúdo</h2>
      {/* Adicione aqui os campos do formulário para editar conteúdo */}
      <button
        onClick={onClose}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Fechar
      </button>
    </div>
  </div>;
}

export default EditContent;