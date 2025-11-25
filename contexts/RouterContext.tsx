
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Route = 'home' | 'about' | 'quote' | 'translations' | 'solutions' | 'localizations';

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from URL query param ?page=... or default to 'home'
  const getInitialRoute = (): Route => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') as Route;
      const validRoutes: Route[] = ['home', 'about', 'quote', 'translations', 'solutions', 'localizations'];
      return validRoutes.includes(page) ? page : 'home';
    }
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<Route>(getInitialRoute);

  useEffect(() => {
    // Handler for browser Back/Forward buttons
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    // Update URL without reloading
    const url = new URL(window.location.href);
    if (route === 'home') {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', route);
    }
    window.history.pushState({}, '', url);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
