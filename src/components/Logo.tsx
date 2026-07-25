interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeClass = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-7xl sm:text-8xl',
};

/**
 * The Eidos wordmark. Tracked-out uppercase with a breathing cyan glow.
 * The "I" carries a subtle accent to echo the favicon's core.
 */
export function Logo({ size = 'md', animated = true, className = '' }: LogoProps) {
  return (
    <span
      className={`text-brand select-none text-white ${sizeClass[size]} ${
        animated ? 'animate-logo-glow' : ''
      } ${className}`}
      aria-label="Eidos"
    >
      <span className="text-white">E</span>
      <span className="text-cyan-300 mx-[0.3em]">I</span>
      <span className="text-white">D</span>
      <span className="text-white">O</span>
      <span className="text-cyan-300/90">S</span>
    </span>
  );
}
