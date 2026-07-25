import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Plus, Check, Clock, Calendar, Play, Server } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { StreamPlayer } from '@/components/StreamPlayer';
import { getById, tmdbImage, CATALOG } from '@/data/catalog';
import { tmdbReady, fetchMovie, fetchTv } from '@/lib/tmdb';
import { useWatchlist } from '@/context/WatchlistContext';
import type { MediaItem } from '@/types';

interface DetailsPageProps {
  id: string;
  onBack: () => void;
}

export function DetailsPage({ id, onBack }: DetailsPageProps) {
  const fallback = getById(id);
  const [item, setItem] = useState<MediaItem | undefined>(fallback);
  const [playing, setPlaying] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const { has, toggle } = useWatchlist();

  // Reset on navigation, then try to enrich with live TMDB data.
  useEffect(() => {
    setPlaying(false);
    setSeason(1);
    setEpisode(1);
    setItem(getById(id));

    if (!tmdbReady) return;
    let cancelled = false;
    const cur = getById(id);
    if (!cur) return;

    (async () => {
      const live = await (cur.type === 'movie'
        ? fetchMovie(cur.tmdbId)
        : fetchTv(cur.tmdbId));
      if (!cancelled && live) setItem(live);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oled">
        <p className="text-white/60">Title not found.</p>
      </div>
    );
  }

  const saved = has(item.id);
  const backdrop = tmdbImage.backdropOriginal(
    item.backdrop.replace('https://image.tmdb.org/t/p/original', ''),
  );

  return (
    <div className="relative min-h-screen bg-oled">
      {/* immersive backdrop */}
      <div className="fixed inset-0 -z-10">
        <img
          src={backdrop}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-oled via-oled/70 to-oled/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-oled/80 via-transparent to-transparent" />
      </div>

      {/* back button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl glass-dark text-white/80 hover:text-white hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Back</span>
      </button>

      <main className="relative px-4 sm:px-8 pt-20 sm:pt-24 pb-16 max-w-6xl mx-auto">
        {/* title block */}
        <div className="animate-fade-up" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full glass-strong text-cyan-300 text-xs font-semibold uppercase tracking-widest">
              {item.type === 'tv' ? 'Series' : 'Film'}
            </span>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-cyan-300 fill-cyan-300" />
              <span className="text-white font-semibold">
                {item.rating.toFixed(1)}
              </span>
              <span className="text-white/40 text-sm">
                · {item.voteCount.toLocaleString()} votes
              </span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white text-shadow-lg leading-[1.05] tracking-tight">
            {item.title}
          </h1>
          <p className="mt-3 text-cyan-300/80 text-sm sm:text-base font-light tracking-wide">
            {item.tagline}
          </p>
        </div>

        {/* metadata chips */}
        <div
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60 animate-fade-up"
          style={{ opacity: 0, animationDelay: '120ms' }}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> {item.year}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {item.runtime}
          </span>
          <span>{item.genres.join(' · ')}</span>
          {item.director && (
            <span className="text-white/50">Dir. {item.director}</span>
          )}
        </div>

        {/* PLAYER + content sheet */}
        <div
          className="mt-8 animate-fade-up"
          style={{ opacity: 0, animationDelay: '200ms' }}
        >
          {playing ? (
            <StreamPlayer
              item={item}
              season={season}
              episode={episode}
              onClose={() => setPlaying(false)}
            />
          ) : (
            <GlassCard variant="dark" className="overflow-hidden">
              {/* facade preview */}
              <div className="relative aspect-video w-full">
                <img
                  src={backdrop}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center group"
                  aria-label={`Play ${item.title}`}
                >
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-pulse-ring" />
                    <span className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full glass-strong flex items-center justify-center cyan-glow-strong transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                      <Play className="w-9 h-9 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                    </span>
                  </div>
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg glass-dark text-white/80 text-xs font-medium">
                    Ready to stream
                  </span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* season/episode selector for TV */}
        {item.type === 'tv' && !playing && (
          <div
            className="mt-6 flex flex-wrap items-center gap-4 animate-fade-up"
            style={{ opacity: 0, animationDelay: '280ms' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Season</span>
              <select
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                className="glass-dark rounded-lg px-3 py-2 text-white text-sm border border-white/10 focus:border-cyan-400/50 focus:outline-none cursor-pointer"
              >
                {[1, 2].map((s) => (
                  <option key={s} value={s} className="bg-oled-200">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Episode</span>
              <select
                value={episode}
                onChange={(e) => setEpisode(Number(e.target.value))}
                className="glass-dark rounded-lg px-3 py-2 text-white text-sm border border-white/10 focus:border-cyan-400/50 focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((ep) => (
                  <option key={ep} value={ep} className="bg-oled-200">
                    {ep}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* frosted glass content sheet */}
        <GlassCard
          variant="dark"
          className="mt-6 p-6 sm:p-8 animate-fade-up"
          style={{ opacity: 0, animationDelay: '340ms' }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* overview */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                {item.overview}
              </p>

              <h3 className="mt-6 text-sm font-semibold text-white/90 uppercase tracking-wider mb-3">
                Cast
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.cast.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-lg glass text-white/70 text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* actions + score */}
            <div className="space-y-4">
              {/* score ring */}
              <div className="flex items-center gap-4 glass rounded-xl p-4">
                <div className="relative w-14 h-14 shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(item.rating / 10) * 150.8} 150.8`}
                      className="cyan-glow"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                    {Math.round(item.rating * 10)}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">User Score</p>
                  <p className="text-white/40 text-xs">
                    {item.voteCount.toLocaleString()} ratings
                  </p>
                </div>
              </div>

              {/* watchlist toggle */}
              <button
                onClick={() =>
                  toggle(item.id, {
                    media_type: item.type,
                    title: item.title,
                    poster: item.poster,
                  })
                }
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  saved
                    ? 'glass-strong text-cyan-300'
                    : 'glass text-white/80 hover:bg-white/10'
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" /> In My List
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" /> Add to List
                  </>
                )}
              </button>

              {/* play trigger */}
              <button
                onClick={() => setPlaying(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all duration-300 cyan-glow-strong hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-5 h-5 fill-black" /> Play Now
              </button>

              <div className="flex items-center gap-2 px-2 text-white/30 text-xs">
                <Server className="w-3.5 h-3.5" />
                Multi-server fallback enabled
              </div>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
