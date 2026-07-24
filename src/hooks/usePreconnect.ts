import { useCallback, useEffect, useRef } from 'react';

/**
 * Injects <link rel="preconnect"> and <link rel="dns-prefetch"> tags for the
 * given streaming origins so the browser opens warm TCP/TLS connections and
 * resolves DNS ahead of time — before any iframe is ever rendered.
 *
 * Idempotent: each origin is only injected once per page lifetime.
 */
const injected = new Set<string>();

function injectOrigin(origin: string) {
  if (injected.has(origin)) return;
  injected.add(origin);

  const dns = document.createElement('link');
  dns.rel = 'dns-prefetch';
  dns.href = origin;
  document.head.appendChild(dns);

  const pc = document.createElement('link');
  pc.rel = 'preconnect';
  pc.href = origin;
  // crossorigin hints the browser to do an anonymous TLS handshake
  (pc as HTMLLinkElement).crossOrigin = 'anonymous';
  document.head.appendChild(pc);
}

/**
 * Returns a stable callback that preconnects to one or more streaming origins.
 * Safe to call multiple times — origins already warmed are skipped.
 */
export function usePreconnect() {
  return useCallback((origins: string | string[]) => {
    const list = Array.isArray(origins) ? origins : [origins];
    list.forEach(injectOrigin);
  }, []);
}

/**
 * Intent-driven pre-connection. Attaches to a container ref and warms the
 * streaming origins when:
 *   - the container enters the viewport (IntersectionObserver — best for mobile),
 *   - the pointer enters the container (desktop hover),
 *   - a touchstart occurs on the container (mobile tap intent, before click fires).
 *
 * This is the "Facade with Intent-Driven Pre-connection" pattern: we never load
 * the iframe until the user explicitly clicks play, but we *do* warm the network
 * paths the moment intent is detected so the eventual hydration is near-instant.
 */
export function useIntentPreconnect(
  ref: React.RefObject<HTMLElement>,
  origins: string[],
  enabled = true,
) {
  const warm = usePreconnect();
  const warmedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !ref.current || warmedRef.current) return;

    const el = ref.current;
    let observer: IntersectionObserver | undefined;

    const maybeWarm = () => {
      if (warmedRef.current) return;
      warmedRef.current = true;
      warm(origins);
    };

    // Mobile / lazy: warm when the facade scrolls into view.
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) maybeWarm();
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);

    // Desktop hover intent.
    const onPointerEnter = () => maybeWarm();
    // Mobile touch intent — fires before click, giving a head start.
    const onTouchStart = () => maybeWarm();

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      observer?.disconnect();
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('touchstart', onTouchStart);
    };
  }, [ref, origins, enabled, warm]);
}
