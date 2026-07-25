import { useEffect, useRef } from 'react';
import { Play, Loader2, AlertTriangle, RefreshCw, Server, X, Shield } from 'lucide-react';
import { useStreamFacade } from '@/hooks/useStreamFacade';
import { useIntentPreconnect } from '@/hooks/usePreconnect';
import { PRECONNECT_ORIGINS } from '@/data/catalog';
import type { MediaItem } from '@/types';

interface StreamPlayerProps {
  item: MediaItem;
  season?: number;
  episode?: number;
  onClose?: () => void;
  /** compact = used inline in the details sheet; full = standalone player page */
  variant?: 'compact' | 'full';
}

/**
 * The Facade + Instant Hydration player.
 *
 * Phase poster  -> high-res backdrop with a play button overlay (no iframe).
 * Phase loading -> iframe mounts with autoplay; a spinner shows while hydrating.
 * Phase playing -> facade fully unmounted, iframe fills the frame.
 * Phase failed  -> circuit-breaker UI: auto-switching servers + manual retry.
 *
 * Intent-driven pre-connection warms DNS/TLS the moment the user hovers or
 * the facade scrolls into view, so the click-to-hydrate gap is near zero.
 */
export function StreamPlayer({
  item,
  season = 1,
  episode = 1,
  onClose,
  variant = 'full',
}: StreamPlayerProps) {
  const facadeSeason = item.type === 'tv' ? season : undefined;
  const facadeEpisode = item.type === 'tv' ? episode : undefined;
  const { state, play, stop, retry, manualSwitch, onIframeLoad } =
    useStreamFacade(item.tmdbId, item.type, facadeSeason, facadeEpisode);

  const facadeRef = useRef<HTMLDivElement>(null);
  useIntentPreconnect(facadeRef, PRECONNECT_ORIGINS, state.phase === 'poster');

  const isFull = variant === 'full';

  // ── POPUP / AD-REDIRECT BLOCKER ───────────────────────────────
  // While a stream is live, intercept window.open so embedded ad scripts
  // can't pop new tabs. We only override the parent window's open — this
  // is safe and restored on unmount. VidLink (the default server) is
  // ad-free; this is extra insurance for the fallback servers.
  useEffect(() => {
    if (state.phase === 'poster') return;
    const originalOpen = window.open;
    window.open = function () {
      return null;
    };
    return () => {
      window.open = originalOpen;
    };
  }, [state.phase]);

  // ── POSTER FACADE ─────────────────────────────────────────────
  if (state.phase === 'poster') {
    return (
      <div
        ref={facadeRef}
        className={`relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-oled-200 ${
          isFull ? 'aspect-video' : 'aspect-video'
        }`}
      >
        <img
          src={item.backdrop}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

        {/* play trigger */}
        <button
          onClick={play}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
          aria-label={`Play ${item.title}`}
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-pulse-ring" />
            <span className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full glass-strong flex items-center justify-center cyan-glow-strong transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
              <Play className="w-9 h-9 sm:w-10 sm:h-10 text-white fill-white ml-1" />
            </span>
          </div>
          <span className="text-white text-sm sm:text-base font-medium tracking-wider uppercase opacity-90 group-hover:opacity-100 group-hover:text-cyan-300 transition-colors">
            Play Now
          </span>
        </button>

        {/* hint tag */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg glass-dark text-[11px] text-white/60 uppercase tracking-wider">
          Tap to stream
        </div>
      </div>
    );
  }

  // ── LOADING / PLAYING / FAILED ────────────────────────────────
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-black ${
        isFull ? 'aspect-video' : 'aspect-video'
      }`}
    >
      {/* iframe — mounted only after play()
          No sandbox attribute: streaming providers detect sandbox and refuse
          to play ("disable sandbox" error). allow-popups is omitted from the
          allow list to suppress popup redirects from ad-heavy fallback servers. */}
      {state.phase !== 'failed' && (
        <iframe
          key={`${state.serverIndex}-${state.attempts}`}
          src={state.url}
          title={item.title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer"
          onLoad={onIframeLoad}
          className="absolute inset-0 w-full h-full border-0 transition-opacity duration-500"
          style={{ opacity: state.phase === 'playing' ? 1 : 0 }}
        />
      )}

      {/* loading overlay */}
      {state.phase === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-cyan-300 animate-spin-slow" />
          <div className="text-center">
            <p className="text-white/80 text-sm font-medium">Connecting to stream</p>
            <p className="text-cyan-300/70 text-xs mt-1">
              Server {state.attempts} · {state.server?.name}
            </p>
          </div>
        </div>
      )}

      {/* failed / circuit-breaker UI */}
      {state.phase === 'failed' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-md p-6 text-center">
          <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="text-white font-medium">Stream unavailable</p>
            <p className="text-white/50 text-sm mt-1">
              Switching servers automatically — or pick one below.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={retry}
              className="px-4 py-2 rounded-xl glass-strong text-white text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={manualSwitch}
              className="px-4 py-2 rounded-xl glass text-white/80 text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <Server className="w-4 h-4" />
              Next server
            </button>
          </div>
        </div>
      )}

      {/* top control bar (playing / loading) */}
      {(state.phase === 'playing' || state.phase === 'loading') && onClose && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-dark text-[11px] text-cyan-300/80 uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            Ad-Shield
          </span>
          <span className="hidden sm:inline px-3 py-1.5 rounded-lg glass-dark text-[11px] text-white/60 uppercase tracking-wider">
            {state.server?.name}
          </span>
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            className="p-2 rounded-lg glass-dark text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
