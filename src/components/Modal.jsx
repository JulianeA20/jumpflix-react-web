import { X, CheckCircle, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, type = "info", title, message }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case "error":
                return <AlertCircle className="w-16 h-16 text-red-500" />;
            default:
                return <AlertCircle className="w-16 h-16 text-blue-500" />;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "success":
                return "text-green-500";
            case "error":
                return "text-red-500";
            default:
                return "text-blue-500";
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-lg shadow-xl max-w-md w-full relative animate-fade-in">
                {/* Botão X */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Conteúdo do Modal */}
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Ícone */}
                    <div className="mb-4">
                        {getIcon()}
                    </div>

                    {/* Título */}
                    {title && (
                        <h2 className={`text-2xl font-bold mb-3 ${getIconColor()}`}>
                            {title}
                        </h2>
                    )}

                    {/* Mensagem */}
                    {message && (
                        <p className="text-gray-300 mb-6">
                            {message}
                        </p>
                    )}

                    {/* Botão OK */}
                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 w-full"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.oneOf(["success", "error", "info"]),
    title: PropTypes.string,
    message: PropTypes.string,
};

export default Modal;
