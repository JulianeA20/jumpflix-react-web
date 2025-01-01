import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import CustomCheckbox from "./Checkbox";
import { supabase } from "../services/supabaseClient";
import { ArrowLeft, Eye, EyeClosed, XIcon } from "lucide-react";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log("Usuário logado: ", data);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      navigate("/dashboard");
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mt-8 mb-8 text-white text-center">
        Login
      </h2>
      <input
        className="w-full px-4 py-2.5 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <input
          className="w-full px-4 py-2.5 mt-4 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          className="absolute inset-y-9 right-0 flex items-center pr-2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeClosed size={21} color="white" />
          ) : (
            <Eye size={21} color="white" />
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <div className="flex items-center">
          <CustomCheckbox checked={rememberMe} onChange={handleRememberMeChange} />
          <span className="text-sm font-semibold text-white">
            Lembrar senha
          </span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setIsForgotPasswordModalOpen(true)}
            className="text-sm font-semibold text-white transition-colors duration-300 hover:text-red-600"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>

      <button
        onClick={handleLogin}
        className="w-full px-4 py-2 mt-4 text-sm font-bold transition-colors duration-300 text-red-700 bg-white rounded-md hover:bg-zinc-200 focus:outline-none"
      >
        Login
      </button>

      {error && (
        <span className="text-red-700 font-semibold mt-4 p-2 text-center">
          {error}
        </span>
      )}

      <Modal
        isOpen={isForgotPasswordModalOpen}
        onRequestClose={() => setIsForgotPasswordModalOpen(false)}
        className="modal-content slide-in-right"
        overlayClassName="fixed inset-0 bg-black/60 z-50"
      >
        <ForgotPassword />
        <div className="absolute top-4 left-4">
          <button onClick={() => setIsForgotPasswordModalOpen(false)}>
            <ArrowLeft size={24} />
            <span className="ml-2">Voltar</span>
          </button>
        </div>
        <button
          onClick={() => setIsForgotPasswordModalOpen(false)}
          className="absolute top-4 right-4 text-white font-semibold"
        >
          <XIcon size={24} />
        </button>
      </Modal>
    </div>
  );
};

export default Login;
