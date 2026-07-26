import { useEffect, useState } from 'react';
import type { MediaItem } from '@/types';
import {
  tmdbReady,
  fetchTrendingMovies,
  fetchTrendingTv,
  fetchMovie,
  fetchTv,
} from '@/lib/tmdb';
import { CATALOG, HERO, ROWS } from '@/data/catalog';

interface CatalogState {
  hero: MediaItem;
  rows: { title: string; items: MediaItem[] }[];
  catalog: MediaItem[];
  loading: boolean;
}

export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({
    hero: HERO,
    rows: ROWS,
    catalog: CATALOG,
    loading: false,
  });

  useEffect(() => {
    if (!tmdbReady) return;
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));

    (async () => {
      const [trendingMovies, trendingTv] = await Promise.all([
        fetchTrendingMovies(),
        fetchTrendingTv(),
      ]);
      if (cancelled) return;

      const enrichedMovies = await Promise.all(
        trendingMovies.slice(0, 6).map((m) => fetchMovie(m.tmdbId)),
      );
      const enrichedTv = await Promise.all(
        trendingTv.slice(0, 6).map((t) => fetchTv(t.tmdbId)),
      );

      if (cancelled) return;

      const movies = enrichedMovies.filter(Boolean) as MediaItem[];
      const tv = enrichedTv.filter(Boolean) as MediaItem[];

      const seen = new Set(CATALOG.map((m) => m.tmdbId));
      const trendingAll = [
        ...trendingMovies.filter((m) => !seen.has(m.tmdbId)),
        ...trendingTv.filter((t) => !seen.has(t.tmdbId)),
      ];
      const all = [...CATALOG, ...trendingAll];
      const liveCatalog = trendingAll.length >= 4 ? all : CATALOG;
      const hero = tv[0] ?? movies[0] ?? HERO;

      const rows = [
        {
          title: 'Trending Movies',
          items: movies.length ? movies : CATALOG.filter((m) => m.type === 'movie'),
        },
        {
          title: 'Trending Series',
          items: tv.length ? tv : CATALOG.filter((m) => m.type === 'tv'),
        },
        ...ROWS.filter((r) => r.title !== 'Trending Movies' && r.title !== 'Series of the Week'),
      ];

      setState({ hero, rows, catalog: liveCatalog, loading: false });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
