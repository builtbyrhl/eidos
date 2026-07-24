import { useEffect, useState } from 'react';

interface BackgroundProps {
  image: string;
  /** blur radius in px applied to the backdrop */
  blur?: number;
  /** overlay darkness 0-100 */
  dim?: number;
  /** subtle scale/pan ken-burns effect */
  kenBurns?: boolean;
  children?: React.ReactNode;
}

/**
 * Full-bleed cinematic backdrop with progressive fade-in, gradient scrims,
 * and an optional slow ken-burns pan. Used as the immersive base layer behind
 * the landing, hero, and details pages.
 */
export function Background({
  image,
  blur = 0,
  dim = 60,
  kenBurns = true,
  children,
}: BackgroundProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = image;
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-oled">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-out ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } ${kenBurns ? 'animate-[spin-slow_60s_linear_infinite]' : ''}`}
        style={{
          backgroundImage: `url(${image})`,
          filter: blur ? `blur(${blur}px)` : undefined,
          // counter-scale so blur edges don't show transparent gaps
          transform: blur ? 'scale(1.08)' : undefined,
          animation: kenBurns
            ? 'kenburns 40s ease-in-out infinite alternate'
            : undefined,
        }}
      />
      {/* color wash towards OLED black */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${dim / 100 * 0.3}) 0%, rgba(0,0,0,${dim / 100 * 0.5}) 40%, rgba(0,0,0,${dim / 100 * 0.95}) 100%)`,
        }}
      />
      {/* horizontal scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
      {children}
    </div>
  );
}
