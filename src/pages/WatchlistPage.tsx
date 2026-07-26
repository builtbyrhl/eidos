import { NavBar } from '@/components/NavBar';
import { PosterCard } from '@/components/PosterCard';
import { GlassCard } from '@/components/GlassCard';
import { Bookmark, Sparkles } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import { useCatalogContext } from '@/context/CatalogContext';
import type { MediaItem } from '@/types';

interface WatchlistPageProps {
  onOpen: (id: string) => void;
  onNavigate: (view: 'home' | 'movies' | 'series' | 'watchlist') => void;
  current: string;
}

export function WatchlistPage({ onOpen, onNavigate, current }: WatchlistPageProps) {
  const { entries, loading } = useWatchlist();
  const { getById } = useCatalogContext();
  const items = entries
    .map((e) => getById(e.media_id))
    .filter(Boolean) as MediaItem[];

  return (
    <div className="min-h-screen bg-oled">
      <NavBar onNavigate={onNavigate} current={current} watchlistCount={entries.length} />

      <main className="pt-28 sm:pt-32 px-4 sm:px-8 pb-20 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              My List
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              {loading ? 'Loading…' : `${items.length} saved title${items.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <GlassCard variant="dark" className="p-12 text-center">
            <Sparkles className="w-10 h-10 text-cyan-300/50 mx-auto mb-4" />
            <p className="text-white/70 font-medium">Your list is empty</p>
            <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto">
              Browse the catalog and tap the plus icon on any title to save it here.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="mt-6 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all cyan-glow"
            >
              Browse titles
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item, i) => (
              <PosterCard key={item.id} item={item} onOpen={onOpen} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
