import { supabase } from "../services/supabaseClient";

// Adicionar
export async function addMovie(movieData) {
  const { data, error } = await supabase
    .from("movies")
    .insert([movieData])
    .select();

  if (error) throw error;
  return data[0];
}

export async function addSeries(seriesData) {
  const { data, error } = await supabase
    .from("series")
    .insert([seriesData])
    .select();

  if (error) throw error;
  return data[0];
}

export async function addAnime(animeData) {
  const { data, error } = await supabase
    .from("animes")
    .insert([animeData])
    .select();

  if (error) throw error;
  return data[0];
}

export async function addSeason(seasonData) {
  const { data, error } = await supabase
    .from("seasons")
    .insert([seasonData])
    .select();

  if (!error) throw error;
  return data[0];
}

export async function addEpisode(episodeData) {
  const { data, error } = await supabase
    .from("episodes")
    .insert([episodeData])
    .select();

  if (!error) throw error;
  return data[0];
}

// Buscar
export async function getMovies() {
  const { data, error } = await supabase.from("movies").select();

  if (error) throw error;
  return data;
}

export async function getSeries() {
  const { data, error } = await supabase.from("series").select();

  if (error) throw error;
  return data;
}

export async function getAnimes() {
  const { data, error } = await supabase.from("animes").select();

  if (error) throw error;
  return data;
}

export async function getSeasons(parentId, parentType) {
  const { data, error } = await supabase
    .from("seasons")
    .select()
    .eq("parentId", parentId)
    .eq("parentType", parentType);

  if (error) throw error;
  return data;
}

export async function getEpisodes(seasonId) {
  const { data, error } = await supabase
    .from("episodes")
    .select()
    .eq("seasonId", seasonId);

  if (error) throw error;
  return data;
}

// Buscar itens específicos
export async function getMovieById(id) {
  const { data, error } = await supabase
    .from("movies")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getSeriesById(id) {
  const { data, error } = await supabase
    .from("series")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getAnimeById(id) {
  const { data, error } = await supabase
    .from("animes")
    .select()
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Atualizar dados
export async function updateMovie(id, changes) {
  const { data, error } = await supabase
    .from("movies")
    .update(changes)
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function updateSeries(id, changes) {
  const { data, error } = await supabase
    .from("series")
    .update(changes)
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function updateAnime(id, changes) {
  const { data, error } = await supabase
    .from("animes")
    .update(changes)
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function updateSeason(id, changes) {
  const { data, error } = await supabase
    .from("seasons")
    .update(changes)
    .eq("id", id);

  if (error) throw error;
  return data;
}

export async function updateEpisode(id, changes) {
  const { data, error } = await supabase
    .from("episodes")
    .update(changes)
    .eq("id", id);

  if (error) throw error;
  return data;
}

// Deletar dados
export async function deleteMovie(id) {
  const { data, error } = await supabase.from("movies").delete().eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteSeries(id) {
  const { data, error } = await supabase.from("series").delete().eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteAnime(id) {
  const { data, error } = await supabase.from("animes").delete().eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteSeason(id) {
  const { data, error } = await supabase.from("seasons").delete().eq("id", id);

  if (error) throw error;
  return data;
}

export async function deleteEpisode(id) {
  const { data, error } = await supabase.from("episodes").delete().eq("id", id);

  if (error) throw error;
  return data;
}
