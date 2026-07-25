import { Play, Star, Plus, Check } from 'lucide-react';
import type { MediaItem } from '@/types';
import { useWatchlist } from '@/context/WatchlistContext';

interface PosterCardProps {
  item: MediaItem;
  onOpen: (id: string) => void;
  index?: number;
}

/**
 * Rounded-xl poster card for horizontal media rows. Hover lifts and reveals a
 * play overlay + quick-add to watchlist. Optimized for both pointer and touch.
 */
export function PosterCard({ item, onOpen, index = 0 }: PosterCardProps) {
  const { has, toggle } = useWatchlist();
  const saved = has(item.id);

  return (
    <div
      className="group relative shrink-0 w-[150px] sm:w-[180px] md:w-[200px] cursor-pointer animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms`, opacity: 0 }}
      onClick={() => onOpen(item.id)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-oled-200 border border-white/[0.06] transition-all duration-500 group-hover:border-cyan-400/40 group-hover:shadow-glow-lg">
        <img
          src={item.poster}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* gradient + hover scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        {/* rating badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg glass-dark text-[11px] font-semibold">
          <Star className="w-3 h-3 text-cyan-300 fill-cyan-300" />
          <span className="text-white">{item.rating.toFixed(1)}</span>
        </div>

        {/* type chip */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md glass-dark text-[10px] uppercase tracking-wider text-white/70">
          {item.type === 'tv' ? 'Series' : 'Film'}
        </div>

        {/* hover play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-14 h-14 rounded-full glass-strong flex items-center justify-center cyan-glow-strong scale-90 group-hover:scale-100 transition-transform duration-500">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* quick add */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle(item.id, {
              media_type: item.type,
              title: item.title,
              poster: item.poster,
            });
          }}
          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            saved
              ? 'glass-strong text-cyan-300'
              : 'glass-dark text-white/80 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          aria-label={saved ? 'Remove from list' : 'Add to list'}
        >
          {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* title + meta */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-white/40 mt-0.5">
          {item.year} · {item.genres[0]}
        </p>
      </div>
    </div>
  );
}
