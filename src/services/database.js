import Dexie from "dexie";

const db = new Dexie('EntertainmentDatabase');

db.version(1).stores({
  movies: '++id, title, releaseYear, imdbRating, synopsis, posterUrl, thumbnailUrl, videoUrl, duration',
  series: '++id, title, releaseYear, imdbRating, synopsis, posterUrl, isDorama',
  animes: '++id, title, releaseYear, imdbRating, synopsis, posterUrl, thumbnailUrl',
  seasons: '++id, parentId, parentType, seasonNumber, arcName',
  episodes: '++id, seasonId, episodeNumber, title, thumbnailUrl, videoUrl, duration'
});

// Adicionar
export async function addMovie(movie) {
  return await db.movies.add(movie);
}

export async function addSeries(series) {
  return await db.series.add(series);
}

export async function addAnime(anime) {
  return await db.animes.add(anime);
}

export async function addSeason(season) {
  return await db.seasons.add(season);
}

export async function addEpisode(episode) {
  return await db.episodes.add(episode);
}

// Buscar
export async function getMovies() {
  return await db.movies.toArray();
}

export async function getSeries() {
  return await db.series.toArray();
}

export async function getAnimes() {
  return await db.animes.toArray();
}

export async function getSeasons(parentId, parentType) {
  return await db.seasons.where({ parentId, parentType }).toArray();
}

export async function getEpisodes(seasonId) {
  return await db.episodes.where({ seasonId }).toArray();
}

// Buscar itens específicos
export async function getMovieById(id) {
  return await db.movies.get(id);
}

export async function getSeriesById(id) {
  return await db.series.get(id);
}

export async function getAnimeById(id) {
  return await db.animes.get(id);
}

// Atualizar dados
export async function updateMovie(id, changes) {
  await db.movies.update(id, changes);
}

export async function updateSeries(id, changes) {
  await db.series.update(id, changes);
}

export async function updateAnime(id, changes) {
  await db.animes.update(id, changes);
}

export async function updateSeason(id, changes) {
  await db.seasons.update(id, changes);
}

export async function updateEpisode(id, changes) {
  await db.episodes.update(id, changes);
}

// Deletar dados
export async function deleteMovie(id) {
  return await db.movies.delete(id);
}

export async function deleteSeries(id) {
  await db.series.delete(id);
  const seasons = await getSeasons(id, 'series');
  for (let season of seasons) {
    await deleteSeason(season.id);
  }
}

export async function deleteAnime(id) {
  await db.animes.delete(id);
  const seasons = await getSeasons(id, "anime");
  for (let season of seasons) {
    await deleteSeason(season.id);
  }
}

export async function deleteSeason(id) {
  await db.seasons.delete(id);
  await db.episodes.where({ seasonId: id }).delete();
}

export async function deleteEpisode(id) {
  return await db.episodes.delete(id);
}

export default db;