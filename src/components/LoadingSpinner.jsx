import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const LoadingSpinner = ({ fullScreen = true, message = "Carregando..." }) => {
    if (fullScreen) {
        return (
            <>
                {/* Backdrop com opacidade em toda a página */}
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9998]"></div>

                {/* Container do spinner centralizado */}
                <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-[9999]">
                    <Loader2 className="w-20 h-20 text-red-500 animate-spin" />
                    {message && <p className="text-white text-md font-semibold">{message}</p>}
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]" />
            {message && <p className="text-red-500 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">{message}</p>}
        </div>
    );
};

LoadingSpinner.propTypes = {
    fullScreen: PropTypes.bool,
    message: PropTypes.string,
};

export default LoadingSpinner;
