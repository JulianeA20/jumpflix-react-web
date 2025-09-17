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

export const addSeason = async (seasonData) => {
  const { data, error } = await supabase.from("seasons").insert([
    {
      number: seasonData.number,
      parentId: seasonData.parentId,
      parentType: seasonData.parentType,
    },
  ]);

  if (error) {
    console.error("Erro ao criar temporada:", error);
    throw error;
  }

  return data;
}

export const addEpisode = async (episodeData) => {
  const { data, error } = await supabase.from("episodes").insert({ episodeData });

  if (error) {
    console.error("Erro ao criar episódio:", error);
    throw error;
  }

  return data;
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
export const updateMovie = async (id, data) => {
  const { data: updatedData, error } = await supabase
    .from("movies")
    .update(data)
    .eq("id", id);

  return { updatedData, error };
};

export const updateSeries = async (id, data) => {
  const { data: updatedData, error } = await supabase
    .from("series")
    .update(data)
    .eq("id", id);

  return { updatedData, error };
};

export const updateAnime = async (id, data) => {
  const { data: updatedData, error } = await supabase
    .from("animes")
    .update(data)
    .eq("id", id);

  return { updatedData, error };
};

export const updateSeason = async (seasonId, seasonData) => {
  const { data, error } = await supabase
    .from("seasons")
    .update({
      number: seasonData.number,
      parentId: seasonData.parentId,
      parentType: seasonData.parentType,
    })
    .eq("id", seasonId);

   if (error) {
     console.error("Erro ao atualizar temporada:", error);
     throw error;
   }

   return data ? data[0] : null;
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

export async function getContentDetails(id, type) {
  let data, error;

  switch (type) {
    case "movie":
      ({ data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single());
      break;
    case "series":
      ({ data, error } = await supabase
        .from("series")
        .select(
          `
          *,
          seasons(
            *,
            episodes(*)
          )
        `
        )
        .eq("id", id)
        .single());
      break;
    case "dorama":
      ({ data, error } = await supabase
        .from("doramas")
        .select(
          `
          *,
          seasons(
            *,
            episodes(*)
          )
        `
        )
        .eq("id", id)
        .single());
      break;
    case "anime":
      ({ data, error } = await supabase
        .from("animes")
        .select(
          `
          *,
          seasons(
            *,
            episodes(*)
          )
        `
        )
        .eq("id", id)
        .single());
      break;
    default:
      throw new Error("Tipo de conteúdo inválido");
  }

  if (error) throw error;
  if (!data) throw new Error("Conteúdo não encontrado");

  return data;
}
