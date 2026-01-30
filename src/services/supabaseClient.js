import { createClient } from "@supabase/supabase-js";

// Variáveis de ambiente do Vite (prefixadas com VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação para desenvolvimento
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Erro: Variáveis de ambiente do Supabase não configuradas!");
    console.error("Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
