import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { GlassCard } from '@/components/GlassCard';
import { HERO, tmdbImage } from '@/data/catalog';

interface LandingPageProps {
  onEnter: () => void;
}

/**
 * The entry experience — a centered glass card with the Eidos logo over an
 * immersive cinematic backdrop. A staggered fade-up reveals the brand, then
 * the tagline, then the entry button.
 */
export function LandingPage({ onEnter }: LandingPageProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150);
    return () => clearTimeout(t);
  }, []);

  const bg = tmdbImage.backdropOriginal(
    HERO.backdrop.replace('https://image.tmdb.org/t/p/original', ''),
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-oled">
      {/* ambient backdrop */}
      <div className="absolute inset-0">
        <img
          src={bg}
          alt=""
          className="w-full h-full object-cover opacity-40"
          style={{ animation: 'kenburns 60s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.12),transparent_60%)]" />
      </div>

      {/* centered glass card */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <GlassCard
          variant="dark"
          className={`px-8 sm:px-16 py-12 sm:py-20 text-center transition-all duration-700 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className={`transition-all duration-700 delay-200 ${
              revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-6">
              Welcome to
            </p>
            <Logo size="xl" />
          </div>

          <p
            className={`mt-6 text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed transition-all duration-700 delay-500 ${
              revealed ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Stream the cinematic. A luxury viewing experience with instant
            playback and immersive visuals.
          </p>

          <button
            onClick={onEnter}
            className={`group mt-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all duration-300 cyan-glow-strong hover:scale-105 active:scale-95 ${
              revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: revealed ? '700ms' : '0ms' }}
          >
            Enter Eidos
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </GlassCard>

        <p
          className={`mt-8 text-white/25 text-xs transition-opacity duration-1000 delay-1000 ${
            revealed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Powered by intent-driven streaming
        </p>
      </div>
    </div>
  );
}
