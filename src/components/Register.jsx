import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeClosed } from "lucide-react";
import { supabase } from "../services/supabaseClient";
const Register = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem, tente novamente");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("Usuário registrado: ", data);
      setError(null);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold mt-8 mb-8 text-white">Registro</h2>
      </div>
      <input
        className="w-full px-4 py-2.5 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full px-4 py-2.5 mt-4 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
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
      <div>
        <div className="relative">
          <input
            className="w-full px-4 py-2.5 mt-4 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Verificar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-9 right-0 flex items-center pr-2 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <EyeClosed size={21} color="white" />
            ) : (
              <Eye size={21} color="white" />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleRegister}
        className="w-full px-4 py-2 mt-4 text-sm font-bold transition-colors duration-300 text-red-700 bg-white rounded-md hover:bg-zinc-200 focus:outline-none"
      >
        Registrar
      </button>

      {error && (
        <span className="text-red-700 font-semibold mt-4 p-2 text-center">
          {error}
        </span>
      )}
    </div>
  );
};

Register.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default Register;
