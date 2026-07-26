import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { MediaItem } from '@/types';
import { useCatalog } from '@/hooks/useCatalog';
import { CATALOG as STATIC_CATALOG, getById as staticGetById } from '@/data/catalog';

interface CatalogContextValue {
  hero: MediaItem;
  rows: { title: string; items: MediaItem[] }[];
  catalog: MediaItem[];
  loading: boolean;
  getById: (id: string) => MediaItem | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { hero, rows, catalog, loading } = useCatalog();

  const getById = useMemo(
    () => (id: string): MediaItem | undefined => {
      return catalog.find((m) => m.id === id) ?? staticGetById(id);
    },
    [catalog],
  );

  const value: CatalogContextValue = {
    hero,
    rows,
    catalog: catalog.length ? catalog : STATIC_CATALOG,
    loading,
    getById,
  };

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalogContext(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalogContext must be used within CatalogProvider');
  return ctx;
}
