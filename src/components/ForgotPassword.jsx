import { useState } from "react";
import { supabase } from "../services/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleForgotPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setError("Erro ao enviar o link de redefinição.");
        console.error(error);
      } else {
        setMessage("Link de redefinição enviado para o seu email.");
        setError(null);
        setEmail(2);
      }
    } catch (e) {
      setError("Ocorreu um erro inesperado.");
      console.error(e);
    }
  };

  const handleVerifyCode = () => {
    if (code === "123456") {
      setStep(3);
      setError(null);
    } else {
      setError("Código inválido.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("As senhas não coincidem, tente novamente.");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        setError("Erro ao redefinir senha");
        console.error(error);
      } else {
        setMessage("Senha redefinida com sucesso!");
        setError(null);
      }
    } catch (e) {
      setError("Ocorreu um erro inesperado.");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-bold mt-8 mb-8 text-white text-center">
        {step === 1
          ? "Redefinir senha"
          : step === 2
          ? "Verificar Código"
          : "Nova Senha"}
      </h2>

      {step === 1 && (
        <>
          <input
            className="w-full px-4 py-2.5 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleForgotPassword}
            className="w-full px-4 py-2 mt-4 text-sm font-bold transition-colors duration-300 text-red-700 bg-white rounded-md hover:bg-zinc-200 focus:outline-none"
          >
            Enviar link de redefinição
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="w-full px-4 py-2.5 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
            type="text"
            placeholder="Código de verificação"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleVerifyCode}
            className="w-full px-4 py-2 mt-4 text-sm font-bold transition-colors duration-300 text-red-700 bg-white rounded-md hover:bg-zinc-200 focus:outline-none"
          >
            Verificar
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            className="w-full px-4 py-2.5 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
            type="password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="w-full px-4 py-2.5 text-sm text-white bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
            type="password"
            placeholder="Confirmar Senha"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="w-full px-4 py-2 mt-4 text-sm font-bold transition-colors duration-300 text-red-700 bg-white rounded-md hover:bg-zinc-200 focus:outline-none"
          >
            Redefinir senha
          </button>
        </>
      )}

      {message && (
        <span className="text-green-500 mt-4 text-center">{message}</span>
      )}
      {error && <span className="text-red-500 mt-4 text-center">{error}</span>}
    </div>
  );
};

export default ForgotPassword;
