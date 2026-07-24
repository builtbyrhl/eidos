import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

const DEVICE_KEY = 'eidos.deviceId';

export interface WatchEntry {
  id: string;
  media_id: string;
  media_type: string;
  title: string;
  poster: string;
}

interface WatchlistContextValue {
  ids: Set<string>;
  entries: WatchEntry[];
  loading: boolean;
  toggle: (mediaId: string, meta?: Partial<WatchEntry>) => Promise<void>;
  has: (mediaId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const deviceId = useMemo(getDeviceId, []);

  const fetchEntries = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('watchlist')
      .select('id, media_id, media_type, title, poster')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });
    if (error) {
      setLoading(false);
      return;
    }
    setEntries((data ?? []) as WatchEntry[]);
    setLoading(false);
  }, [deviceId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const toggle = useCallback(
    async (mediaId: string, meta?: Partial<WatchEntry>) => {
      if (!supabase) return;
      const exists = entries.find((e) => e.media_id === mediaId);
      if (exists) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('device_id', deviceId)
          .eq('media_id', mediaId);
        setEntries((prev) => prev.filter((e) => e.media_id !== mediaId));
      } else {
        const row = {
          device_id: deviceId,
          media_id: mediaId,
          media_type: meta?.media_type ?? null,
          title: meta?.title ?? null,
          poster: meta?.poster ?? null,
        };
        const { data } = await supabase
          .from('watchlist')
          .insert(row)
          .select('id, media_id, media_type, title, poster')
          .maybeSingle();
        if (data) setEntries((prev) => [data as WatchEntry, ...prev]);
      }
    },
    [deviceId, entries],
  );

  const has = useCallback(
    (mediaId: string) => entries.some((e) => e.media_id === mediaId),
    [entries],
  );

  const ids = useMemo(
    () => new Set(entries.map((e) => e.media_id)),
    [entries],
  );

  const value: WatchlistContextValue = {
    ids,
    entries,
    loading,
    toggle,
    has,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}

export const watchlistReady = supabaseReady;
