import { Play, Star, Plus, Check, Info } from 'lucide-react';
import type { MediaItem } from '@/types';
import { useWatchlist } from '@/context/WatchlistContext';
import { tmdbImage } from '@/data/catalog';

interface HeroSeriesProps {
  item: MediaItem;
  onPlay: (id: string) => void;
  onInfo: (id: string) => void;
}

/**
 * The "Series of the Week" hero — full-bleed backdrop with a glass info panel,
 * rating, and dual CTAs (play / more info). The backdrop uses TMDB original
 * resolution for maximum immersion.
 */
export function HeroSeries({ item, onPlay, onInfo }: HeroSeriesProps) {
  const { has, toggle } = useWatchlist();
  const saved = has(item.id);
  const backdrop = tmdbImage.backdropOriginal(
    item.backdrop.replace('https://image.tmdb.org/t/p/original', ''),
  );

  return (
    <section className="relative w-full h-[78vh] min-h-[520px] max-h-[820px] overflow-hidden">
      {/* layered backdrop */}
      <div className="absolute inset-0">
        <img
          src={backdrop}
          alt={item.title}
          className="w-full h-full object-cover object-center"
          style={{ animation: 'kenburns 40s ease-in-out infinite alternate' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-oled via-oled/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-oled/90 via-oled/30 to-transparent" />

      {/* content */}
      <div className="relative h-full flex items-end pb-12 sm:pb-16 px-4 sm:px-8">
        <div className="max-w-2xl animate-fade-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full glass-strong text-cyan-300 text-xs font-semibold uppercase tracking-widest">
              Series of the Week
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark">
              <Star className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
              <span className="text-white text-sm font-semibold">
                {item.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white text-shadow-lg leading-[1.05] tracking-tight">
            {item.title}
          </h1>
          <p className="mt-3 text-white/70 text-sm sm:text-base font-light tracking-wide">
            {item.tagline}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm text-white/50">
            <span>{item.year}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{item.genres.join(' · ')}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{item.runtime}</span>
          </div>

          <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-xl">
            {item.overview}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(item.id)}
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all duration-300 cyan-glow-strong hover:scale-[1.03] active:scale-95"
            >
              <Play className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
              Play
            </button>
            <button
              onClick={() => onInfo(item.id)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl glass-strong text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
            <button
              onClick={() =>
                toggle(item.id, {
                  media_type: item.type,
                  title: item.title,
                  poster: item.poster,
                })
              }
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                saved
                  ? 'glass-strong text-cyan-300'
                  : 'glass-dark text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label={saved ? 'Remove from list' : 'Add to list'}
            >
              {saved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
