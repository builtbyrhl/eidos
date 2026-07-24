import type { MediaItem } from '@/types';
import { tmdbImage } from '@/lib/tmdb';

// Re-export so existing imports from '@/data/catalog' keep working.
export { tmdbImage };

// Curated catalog with verified TMDB image file paths.
// Backdrop/poster paths confirmed against themoviedb.org image endpoints.
export const CATALOG: MediaItem[] = [
  {
    id: 'dune-part-two',
    tmdbId: 693134,
    title: 'Dune: Part Two',
    type: 'movie',
    year: 2024,
    rating: 8.2,
    voteCount: 9120,
    runtime: '166 min',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    tagline: 'Long live the fighters.',
    overview:
      'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.',
    poster: 'https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    featured: true,
  },
  {
    id: 'oppenheimer',
    tmdbId: 872585,
    title: 'Oppenheimer',
    type: 'movie',
    year: 2023,
    rating: 8.1,
    voteCount: 11240,
    runtime: '180 min',
    genres: ['Drama', 'History', 'Biography'],
    tagline: 'The world forever changes.',
    overview:
      'The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.',
    poster: 'https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.', 'Matt Damon'],
  },
  {
    id: 'interstellar',
    tmdbId: 157336,
    title: 'Interstellar',
    type: 'movie',
    year: 2014,
    rating: 8.4,
    voteCount: 35800,
    runtime: '169 min',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces a catastrophic future.',
    poster: 'https://image.tmdb.org/t/p/original/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/1GfWh0hquQCXaZL4f4O3skxu09Y.jpg',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Matt Damon'],
  },
  {
    id: 'blade-runner-2049',
    tmdbId: 335984,
    title: 'Blade Runner 2049',
    type: 'movie',
    year: 2017,
    rating: 7.6,
    voteCount: 16700,
    runtime: '164 min',
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    tagline: 'The key to the future is finally unearthed.',
    overview:
      'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.',
    poster: 'https://image.tmdb.org/t/p/original/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg',
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Jared Leto'],
  },
  {
    id: 'inception',
    tmdbId: 27205,
    title: 'Inception',
    type: 'movie',
    year: 2010,
    rating: 8.4,
    voteCount: 37200,
    runtime: '148 min',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    tagline: 'Your mind is the scene of the crime.',
    overview:
      'A skilled thief who commits corporate espionage by infiltrating the subconscious is offered a chance to regain his old life as payment for a task considered impossible: inception.',
    poster: 'https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Tom Hardy', 'Marion Cotillard'],
  },
  {
    id: 'the-dark-knight',
    tmdbId: 155,
    title: 'The Dark Knight',
    type: 'movie',
    year: 2008,
    rating: 8.5,
    voteCount: 32500,
    runtime: '152 min',
    genres: ['Action', 'Crime', 'Drama'],
    tagline: 'Welcome to a world without rules.',
    overview:
      'Batman raises the stakes in his war on crime, but he and his allies soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known as the Joker.',
    poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'],
  },
  {
    id: 'the-last-of-us',
    tmdbId: 100088,
    title: 'The Last of Us',
    type: 'tv',
    year: 2023,
    rating: 8.7,
    voteCount: 6400,
    runtime: 'Series',
    genres: ['Drama', 'Sci-Fi', 'Horror'],
    tagline: 'When you're lost in the darkness, look for the light.',
    overview:
      'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.',
    poster: 'https://image.tmdb.org/t/p/original/1CqIG3L8bkYaCtRY7HfmKxYFXQ1.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/acevLdSl5I2MK5RYAm7gwAndt1w.jpg',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Anna Torv', 'Gabriel Luna'],
  },
  {
    id: 'shogun',
    tmdbId: 126308,
    title: 'Shōgun',
    type: 'tv',
    year: 2024,
    rating: 8.6,
    voteCount: 2800,
    runtime: 'Series',
    genres: ['Drama', 'History', 'War'],
    tagline: 'An epic saga of war, passion, and power set in Feudal Japan.',
    overview:
      'In Japan in the year 1600, at the dawn of a century-defining civil war, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him.',
    poster: 'https://image.tmdb.org/t/p/original/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/6Tb87q9Tog30F5AAHh1gyDT2Vve.jpg',
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai', 'Tadanobu Asano'],
  },
  {
    id: 'arcane',
    tmdbId: 94605,
    title: 'Arcane',
    type: 'tv',
    year: 2021,
    rating: 8.7,
    voteCount: 4100,
    runtime: 'Series',
    genres: ['Animation', 'Action', 'Adventure'],
    tagline: 'The hunt is on.',
    overview:
      'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.',
    poster: 'https://image.tmdb.org/t/p/original/abf8tHznhSvl9BAElD2cQeRr7do.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/q8eejQcg1bAqImEV8jh8RtBD4uH.jpg',
    cast: ['Hailee Steinfeld', 'Ella Purnell', 'Kevin Alejandro', 'Jason Spisak'],
  },
  {
    id: 'game-of-thrones',
    tmdbId: 1399,
    title: 'Game of Thrones',
    type: 'tv',
    year: 2011,
    rating: 8.4,
    voteCount: 22100,
    runtime: 'Series',
    genres: ['Drama', 'Fantasy', 'Adventure'],
    tagline: 'Winter is coming.',
    overview:
      'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    poster: 'https://image.tmdb.org/t/p/original/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    cast: ['Emilia Clarke', 'Kit Harington', 'Peter Dinklage', 'Lena Headey'],
  },
];

export const ROWS: { title: string; items: MediaItem[] }[] = [
  {
    title: 'Trending Movies',
    items: CATALOG.filter((m) => m.type === 'movie'),
  },
  {
    title: 'Series of the Week',
    items: CATALOG.filter((m) => m.type === 'tv'),
  },
  {
    title: 'Nolan Essentials',
    items: CATALOG.filter((m) =>
      ['oppenheimer', 'interstellar', 'inception', 'the-dark-knight'].includes(m.id),
    ),
  },
  {
    title: 'Villeneuve Vision',
    items: CATALOG.filter((m) => ['dune-part-two', 'blade-runner-2049'].includes(m.id)),
  },
  {
    title: 'Critically Acclaimed',
    items: [...CATALOG].sort((a, b) => b.rating - a.rating).slice(0, 6),
  },
];

export const HERO = CATALOG.find((m) => m.featured) ?? CATALOG[0];

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'vidlink',
    name: 'VidLink',
    build: (type, tmdbId, season, episode) => {
      if (type === 'tv' && season && episode) {
        return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?autoplay=true`;
      }
      return `https://vidlink.pro/movie/${tmdbId}?autoplay=true`;
    },
  },
  {
    id: 'vidsrc',
    name: 'VidSrc',
    build: (type, tmdbId, season, episode) => {
      if (type === 'tv' && season && episode) {
        return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    },
  },
  {
    id: 'vidsrcxyz',
    name: 'VidSrc Pro',
    build: (type, tmdbId, season, episode) => {
      if (type === 'tv' && season && episode) {
        return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}-${episode}`;
      }
      return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
    },
  },
];

export const PRECONNECT_ORIGINS = STREAM_SERVERS.map((s) => {
  const u = new URL(s.build('movie', 1));
  return `${u.protocol}//${u.host}`;
});

export const getById = (id: string): MediaItem | undefined =>
  CATALOG.find((m) => m.id === id);
