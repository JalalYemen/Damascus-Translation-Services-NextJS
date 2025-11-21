
import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { About } from './components/About';
import { Quotation } from './components/Quotation';
import { Translations } from './components/Translations';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { QuoteSlideButton } from './components/QuoteSlideButton';
import { LanguageProvider } from './contexts/LanguageContext';
import { RouterProvider, useRouter } from './contexts/RouterContext';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <h2 className="text-danger">Something went wrong.</h2>
          <p className="lead">The application encountered an unexpected error.</p>
          <pre className="bg-light p-3 text-start" style={{overflow: 'auto'}}>
            {this.state.error?.message}
          </pre>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main content component separated to use contexts
const AppContent = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const { currentRoute } = useRouter();

  const handleLogin = (email: string) => {
    setUser(email);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      {currentRoute === 'home' && <Home />}
      {currentRoute === 'about' && <About />}
      {currentRoute === 'translations' && <Translations />}
      {currentRoute === 'quote' && <Quotation />}

      <QuoteSlideButton />

      <Footer />

      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}