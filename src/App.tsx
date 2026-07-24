import { useEffect, useState } from 'react';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { LandingPage } from '@/pages/LandingPage';
import { HomePage } from '@/pages/HomePage';
import { DetailsPage } from '@/pages/DetailsPage';
import { WatchlistPage } from '@/pages/WatchlistPage';

type View = 'landing' | 'home' | 'movies' | 'series' | 'watchlist' | 'details';

interface Route {
  view: View;
  detailId?: string;
}

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (!h) return { view: 'landing' };
  const [seg, id] = h.split('/');
  if (seg === 'details' && id) return { view: 'details', detailId: id };
  if (seg === 'home') return { view: 'home' };
  if (seg === 'movies') return { view: 'movies' };
  if (seg === 'series') return { view: 'series' };
  if (seg === 'watchlist') return { view: 'watchlist' };
  return { view: 'landing' };
}

const setHash = (path: string) => {
  if (window.location.hash !== `#/${path}`) window.location.hash = `#/${path}`;
};

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.view, route.detailId]);

  const goHome = () => setHash('home');
  const openDetails = (id: string) => setHash(`details/${id}`);

  const navCurrent =
    route.view === 'details' ? 'home' : route.view;

  let content: React.ReactNode;
  if (route.view === 'landing') {
    content = <LandingPage onEnter={goHome} />;
  } else if (route.view === 'details' && route.detailId) {
    content = <DetailsPage id={route.detailId} onBack={goHome} />;
  } else if (route.view === 'watchlist') {
    content = (
      <WatchlistPage onOpen={openDetails} onNavigate={(v) => setHash(v)} current={navCurrent} />
    );
  } else {
    // home / movies / series all render HomePage with filtered context
    content = (
      <HomePage
        onOpen={openDetails}
        onPlay={openDetails}
        onNavigate={(v) => setHash(v)}
        current={navCurrent}
      />
    );
  }

  return <WatchlistProvider>{content}</WatchlistProvider>;
}
