import type { MediaItem } from '@/types';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p';

export const tmdbImage = {
  backdrop: (path: string, size: 'w1280' | 'original' = 'w1280') =>
    path ? `${IMG}/${size}${path}` : '',
  backdropOriginal: (path: string) => (path ? `${IMG}/original${path}` : ''),
  poster: (path: string, size: 'w500' | 'original' = 'w500') =>
    path ? `${IMG}/${size}${path}` : '',
};

const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

export const tmdbReady = Boolean(apiKey || accessToken);

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    h['Authorization'] = `Bearer ${accessToken}`;
  } else if (apiKey) {
    h['Authorization'] = `Bearer ${apiKey}`;
  }
  return h;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!tmdbReady) return null;
  const url = new URL(`${TMDB_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString(), { headers: authHeaders() });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { name: string }[];
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  credits?: { crew: { job: string; name: string }[]; cast: { name: string }[] };
}

interface TMDBTv {
  id: number;
  name: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  episode_run_time: number[];
  genres: { name: string }[];
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  credits?: { crew: { job: string; name: string }[]; cast: { name: string }[] };
}

function slugify(title: string, id: number): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `tmdb-${id}`
  );
}

function movieToItem(m: TMDBMovie): MediaItem {
  const director = m.credits?.crew.find((c) => c.job === 'Director')?.name;
  return {
    id: slugify(m.title, m.id),
    tmdbId: m.id,
    title: m.title,
    type: 'movie',
    year: m.release_date ? new Date(m.release_date).getFullYear() : 0,
    rating: Math.round(m.vote_average * 10) / 10,
    voteCount: m.vote_count,
    runtime: m.runtime ? `${m.runtime} min` : 'N/A',
    genres: m.genres?.map((g) => g.name) ?? [],
    tagline: m.tagline,
    overview: m.overview,
    poster: tmdbImage.poster(m.poster_path),
    backdrop: tmdbImage.backdropOriginal(m.backdrop_path),
    director,
    cast: m.credits?.cast.slice(0, 6).map((c) => c.name) ?? [],
  };
}

function tvToItem(t: TMDBTv): MediaItem {
  return {
    id: slugify(t.name, t.id),
    tmdbId: t.id,
    title: t.name,
    type: 'tv',
    year: t.first_air_date ? new Date(t.first_air_date).getFullYear() : 0,
    rating: Math.round(t.vote_average * 10) / 10,
    voteCount: t.vote_count,
    runtime: 'Series',
    genres: t.genres?.map((g) => g.name) ?? [],
    tagline: t.tagline,
    overview: t.overview,
    poster: tmdbImage.poster(t.poster_path),
    backdrop: tmdbImage.backdropOriginal(t.backdrop_path),
    cast: t.credits?.cast.slice(0, 6).map((c) => c.name) ?? [],
  };
}

/** Fetch detailed movie data (with credits appended). */
export async function fetchMovie(id: number): Promise<MediaItem | null> {
  const data = await tmdbFetch<TMDBMovie>(`/movie/${id}`, {
    append_to_response: 'credits',
  });
  return data ? movieToItem(data) : null;
}

/** Fetch detailed TV data (with credits appended). */
export async function fetchTv(id: number): Promise<MediaItem | null> {
  const data = await tmdbFetch<TMDBTv>(`/tv/${id}`, {
    append_to_response: 'credits',
  });
  return data ? tvToItem(data) : null;
}

interface TMDBListResponse<T> {
  results: T[];
}

/** Fetch trending movies of the week. */
export async function fetchTrendingMovies(): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBListResponse<{ id: number; title: string; poster_path: string; backdrop_path: string; vote_average: number; release_date: string }>>(
    '/trending/movie/week',
  );
  if (!data?.results) return [];
  return data.results.slice(0, 20).map((m) => ({
    id: slugify(m.title, m.id),
    tmdbId: m.id,
    title: m.title,
    type: 'movie' as const,
    year: m.release_date ? new Date(m.release_date).getFullYear() : 0,
    rating: Math.round(m.vote_average * 10) / 10,
    voteCount: 0,
    runtime: 'N/A',
    genres: [],
    tagline: '',
    overview: '',
    poster: tmdbImage.poster(m.poster_path),
    backdrop: tmdbImage.backdropOriginal(m.backdrop_path),
    cast: [],
  }));
}

/** Fetch trending TV series of the week. */
export async function fetchTrendingTv(): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBListResponse<{ id: number; name: string; poster_path: string; backdrop_path: string; vote_average: number; first_air_date: string }>>(
    '/trending/tv/week',
  );
  if (!data?.results) return [];
  return data.results.slice(0, 20).map((t) => ({
    id: slugify(t.name, t.id),
    tmdbId: t.id,
    title: t.name,
    type: 'tv' as const,
    year: t.first_air_date ? new Date(t.first_air_date).getFullYear() : 0,
    rating: Math.round(t.vote_average * 10) / 10,
    voteCount: 0,
    runtime: 'Series',
    genres: [],
    tagline: '',
    overview: '',
    poster: tmdbImage.poster(t.poster_path),
    backdrop: tmdbImage.backdropOriginal(t.backdrop_path),
    cast: [],
  }));
}

/** Fetch a single item by slug-style id — used by the details page. */
export async function fetchByTmdbId(
  tmdbId: number,
  type: 'movie' | 'tv',
): Promise<MediaItem | null> {
  return type === 'movie' ? fetchMovie(tmdbId) : fetchTv(tmdbId);
}
