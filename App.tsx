import React, { useState, ErrorInfo, ReactNode, Component } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { About } from './components/About';
import { Quotation } from './components/Quotation';
import { Translations } from './components/Translations';
import { Solutions } from './components/Solutions';
import { Localizations } from './components/Localizations';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { QuoteSlideButton } from './components/QuoteSlideButton';
import { LanguageProvider } from './contexts/LanguageContext';
import { RouterProvider, useRouter } from './contexts/RouterContext';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// User interface matching Firebase structure for easy integration later
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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
const AppContent: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { currentRoute } = useRouter();

  const handleLogin = (email: string) => {
    // MOCK LOGIN: simulating a Firebase user object
    // When you implement Firebase, this will be handled by onAuthStateChanged in a useEffect
    const mockUser: User = {
        uid: 'mock-uid-' + Date.now(),
        email: email,
        displayName: email.split('@')[0] // simulating a display name
    };
    setUser(mockUser);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    // When you implement Firebase, call signOut(auth) here
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
      {currentRoute === 'solutions' && <Solutions />}
      {currentRoute === 'localizations' && <Localizations />}
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