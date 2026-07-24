export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id: string;
  tmdbId: number;
  title: string;
  type: MediaType;
  year: number;
  rating: number;
  voteCount: number;
  runtime: string;
  genres: string[];
  tagline: string;
  overview: string;
  poster: string;
  backdrop: string;
  logoPath?: string;
  director?: string;
  cast: string[];
  featured?: boolean;
}

export interface StreamServer {
  id: string;
  name: string;
  build: (type: MediaType, tmdbId: number, season?: number, episode?: number) => string;
}
