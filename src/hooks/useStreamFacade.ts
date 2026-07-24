import { useCallback, useEffect, useRef, useState } from 'react';
import { STREAM_SERVERS, PRECONNECT_ORIGINS } from '@/data/catalog';
import { usePreconnect } from '@/hooks/usePreconnect';
import type { MediaType, StreamServer } from '@/types';

export type StreamPhase = 'idle' | 'poster' | 'loading' | 'playing' | 'failed';

export interface StreamState {
  phase: StreamPhase;
  serverIndex: number;
  server: StreamServer | null;
  url: string;
  attempts: number;
  error: string | null;
}

const LOAD_TIMEOUT_MS = 8000;

/**
 * The streaming facade controller.
 *
 * Lifecycle:
 *   poster     -> showing the high-res backdrop facade, preconnects warmed.
 *   loading    -> iframe mounted, waiting for the onLoad / timeout race.
 *   playing    -> iframe reported load; facade unmounted, stream live.
 *   failed     -> timeout elapsed without load; auto-switch to next server.
 *
 * The circuit breaker races an onLoad callback against a timer. If the current
 * server doesn't hydrate within LOAD_TIMEOUT_MS we trip the breaker, advance to
 * the next server, and remount the iframe. After all servers are exhausted we
 * surface a user-facing error state.
 */
export function useStreamFacade(
  tmdbId: number,
  type: MediaType,
  season?: number,
  episode?: number,
) {
  const warm = usePreconnect();
  const [state, setState] = useState<StreamState>({
    phase: 'poster',
    serverIndex: 0,
    server: STREAM_SERVERS[0],
    url: '',
    attempts: 0,
    error: null,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // Preconnect to ALL streaming origins up front (cheap — they share CDN edges),
  // plus the primary server gets warmed immediately.
  useEffect(() => {
    warm(PRECONNECT_ORIGINS);
  }, [warm]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const mountServer = useCallback(
    (index: number) => {
      const server = STREAM_SERVERS[index];
      if (!server) return;
      const url = server.build(type, tmdbId, season, episode);
      setState({
        phase: 'loading',
        serverIndex: index,
        server,
        url,
        attempts: index + 1,
        error: null,
      });

      clearTimer();
      // Circuit breaker: if no onLoad fires within the window, trip it.
      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setState((prev) => {
          if (prev.phase !== 'loading') return prev; // already playing
          return { ...prev, phase: 'failed', error: 'Stream timed out' };
        });
      }, LOAD_TIMEOUT_MS);
    },
    [type, tmdbId, season, episode],
  );

  const play = useCallback(() => {
    warm(PRECONNECT_ORIGINS);
    mountServer(0);
  }, [mountServer, warm]);

  const onIframeLoad = useCallback(() => {
    clearTimer();
    if (!mountedRef.current) return;
    setState((prev) =>
      prev.phase === 'loading' ? { ...prev, phase: 'playing', error: null } : prev,
    );
  }, []);

  // When the breaker trips to 'failed', auto-advance to the next server once.
  useEffect(() => {
    if (state.phase !== 'failed') return;
    const next = state.serverIndex + 1;
    if (next < STREAM_SERVERS.length) {
      const t = setTimeout(() => mountServer(next), 600);
      return () => clearTimeout(t);
    }
    // All servers exhausted — keep the failed state with a retry option.
  }, [state.phase, state.serverIndex, mountServer]);

  const stop = useCallback(() => {
    clearTimer();
    setState({
      phase: 'poster',
      serverIndex: 0,
      server: STREAM_SERVERS[0],
      url: '',
      attempts: 0,
      error: null,
    });
  }, []);

  const retry = useCallback(() => {
    clearTimer();
    mountServer(0);
  }, [mountServer]);

  const manualSwitch = useCallback(() => {
    const next = (state.serverIndex + 1) % STREAM_SERVERS.length;
    mountServer(next);
  }, [state.serverIndex, mountServer]);

  return { state, play, stop, retry, manualSwitch, onIframeLoad };
}
