import { NavBar } from '@/components/NavBar';
import { HeroSeries } from '@/components/HeroSeries';
import { MediaRow } from '@/components/MediaRow';
import { PosterCard } from '@/components/PosterCard';
import { CATALOG } from '@/data/catalog';
import { useWatchlist } from '@/context/WatchlistContext';
import { useCatalog } from '@/hooks/useCatalog';

interface HomePageProps {
  onOpen: (id: string) => void;
  onPlay: (id: string) => void;
  onNavigate: (view: 'home' | 'movies' | 'series' | 'watchlist') => void;
  current: string;
}

export function HomePage({ onOpen, onPlay, onNavigate, current }: HomePageProps) {
  const { entries } = useWatchlist();
  const { hero, rows, catalog } = useCatalog();
  const myListRow = entries.length
    ? entries.map((e) => catalog.find((m) => m.id === e.media_id)).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-oled">
      <NavBar onNavigate={onNavigate} current={current} watchlistCount={entries.length} />

      <main className="pt-0">
        <HeroSeries item={hero} onPlay={onPlay} onInfo={onOpen} />

        <div className="relative -mt-8 sm:-mt-12 pb-16 space-y-2 sm:space-y-4">
          {myListRow.length > 0 && (
            <MediaRow
              title="My List"
              items={myListRow as typeof CATALOG}
              onOpen={onOpen}
            />
          )}
          {rows.map((row) => (
            <MediaRow
              key={row.title}
              title={row.title}
              items={row.items}
              onOpen={onOpen}
            />
          ))}

          {/* featured grid footer */}
          <section className="px-4 sm:px-8 pt-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-4">
              Featured Tonight
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {catalog.slice(0, 6).map((item, i) => (
                <PosterCard key={item.id} item={item} onOpen={onOpen} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
