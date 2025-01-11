import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Header from "./Header";
import Sidebar from "./Sidebar";

const PageLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao buscar sessão do usuário:", error);
    } else if (session) {
      setUser(session.user);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar: ", error);
    } else {
      console.log("Usuário deslogado com sucesso.");
      setUser(null);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      <Header
        user={user}
        setIsMenuOpen={setIsMenuOpen}
        handleLogout={handleLogout}
      />
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="pt-32 px-5 pb-10">{children}</main>
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageLayout;
