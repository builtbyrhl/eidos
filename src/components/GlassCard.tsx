import { type HTMLAttributes, type ReactNode, type CSSProperties } from 'react';

type Variant = 'default' | 'dark' | 'strong';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: Variant;
  hover?: boolean;
  glow?: boolean;
  style?: CSSProperties;
}

const variantClass: Record<Variant, string> = {
  default: 'glass',
  dark: 'glass-dark',
  strong: 'glass-strong',
};

/**
 * Frosted glass surface — the base building block of the glassmorphism system.
 * Semi-transparent, backdrop-blurred, with a subtle top highlight border.
 */
export function GlassCard({
  children,
  variant = 'default',
  hover = false,
  glow = false,
  className = '',
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl ${variantClass[variant]} ${hover ? 'glass-hover' : ''} ${
        glow ? 'cyan-glow' : ''
      } shadow-glass ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
