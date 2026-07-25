import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from '@/types';
import { PosterCard } from '@/components/PosterCard';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  onOpen: (id: string) => void;
}

/**
 * Horizontally scrolling media row with masked edges and arrow controls.
 * Scroll snapping for touch + button scroll for pointer devices.
 */
export function MediaRow({ title, items, onOpen }: MediaRowProps) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="relative group/row py-2">
      <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
          {title}
        </h2>
        <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scrollBy(-1)}
            className="p-1.5 rounded-lg glass-dark text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="p-1.5 rounded-lg glass-dark text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scroller}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 sm:px-8 pb-4 mask-fade-edges"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {items.map((item, i) => (
            <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
              <PosterCard item={item} onOpen={onOpen} index={i} />
            </div>
          ))}
          {/* trailing spacer so last card isn't clipped by mask */}
          <div className="shrink-0 w-1" />
        </div>
      </div>
    </section>
  );
}
