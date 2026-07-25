import { useState } from 'react';
import { Play, Search, Bookmark, Home, Film, Tv, Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface NavBarProps {
  onNavigate: (view: 'home' | 'movies' | 'series' | 'watchlist') => void;
  current: string;
  watchlistCount: number;
}

const links = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'series', label: 'Series', icon: Tv },
] as const;

export function NavBar({ onNavigate, current, watchlistCount }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (view: 'home' | 'movies' | 'series' | 'watchlist') => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 sm:pt-4">
      <nav className="mx-auto max-w-[1600px] glass-dark rounded-2xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between shadow-glass">
        {/* Brand */}
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2 shrink-0 group"
          aria-label="Eidos home"
        >
          <Logo size="sm" animated={false} />
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = current === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  active
                    ? 'text-cyan-300'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-cyan-400 cyan-glow" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => go('watchlist')}
            className={`relative p-2.5 rounded-xl transition-all duration-300 ${
              current === 'watchlist'
                ? 'text-cyan-300 bg-cyan-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            aria-label="My List"
          >
            <Bookmark className="w-5 h-5" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center cyan-glow">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            className="hidden sm:flex p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2.5 rounded-xl text-white/70 hover:bg-white/5 transition-all"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mx-auto max-w-[1600px] mt-2 glass-dark rounded-2xl p-2 animate-scale-in origin-top">
          {links.map((l) => {
            const Icon = l.icon;
            const active = current === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                  active
                    ? 'text-cyan-300 bg-cyan-500/10'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
