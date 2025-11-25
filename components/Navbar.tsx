import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';
import { User } from '../App';

interface NavbarProps {
  onOpenAuth: () => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t, toggleLanguage } = useLanguage();
  const { navigate, currentRoute } = useRouter();
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Logic from auth.js: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleNavClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (target.startsWith('#')) {
        // If on home page, scroll. If not, go to home then scroll.
        if (currentRoute !== 'home') {
            navigate('home');
            setTimeout(() => {
                const element = document.querySelector(target);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(target);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    } else if (target === 'home') {
        navigate('home');
    } else if (target === 'about') {
        navigate('about');
    } else if (target === 'quote') {
        navigate('quote');
    }
  };

  // Logic from auth.js: Determine Avatar Initial
  const getAvatarInitial = () => {
    if (!user) return '';
    const nameSource = user.displayName || user.email || '?';
    return nameSource.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-3" href="#" onClick={(e) => handleNavClick(e, 'home')}>
          <img
            src="https://placehold.co/80x80/png"
            alt="Logo"
            width="80"
            height="80"
            style={{ objectFit: 'cover' }}
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            <li className="nav-item">
              <a className={`nav-link ${currentRoute === 'home' ? 'active' : ''}`} href="#" onClick={(e) => handleNavClick(e, 'home')}>{t.nav.home}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services" onClick={(e) => handleNavClick(e, '#services')}>{t.nav.services}</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${currentRoute === 'about' ? 'active' : ''}`} href="#" onClick={(e) => handleNavClick(e, 'about')}>{t.nav.about}</a>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link text-decoration-none border-0" 
                onClick={toggleLanguage}
              >
                {t.nav.langLabel}
              </button>
            </li>

            {user ? (
              <li
                className="nav-item"
                id="user-nav"
                ref={dropdownRef}
                style={{ position: 'relative', cursor: 'pointer', display: 'block' }}
                onClick={(e) => {
                    // Logic from auth.js: e.stopPropagation();
                    // React's onClick doesn't strictly need this for the window listener to work 
                    // if we attach the listener in useEffect, but good for safety.
                    setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <div
                  id="user-avatar"
                  className="user-avatar-circle"
                >
                  {getAvatarInitial()}
                </div>

                <div 
                  id="user-dropdown-menu" 
                  className={`user-dropdown ${isDropdownOpen ? 'show-dropdown' : ''}`}
                >
                  <div id="dropdown-user-email" className="dropdown-email">{user.email}</div>
                  <button 
                    id="logout-button" 
                    className="btn btn-outline-danger w-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        onLogout();
                        setIsDropdownOpen(false);
                    }}
                  >
                    {t.nav.logout}
                  </button>
                </div>
              </li>
            ) : (
              <li className="nav-item" id="auth-toggle-li" style={{ display: 'block' }}>
                <button 
                  id="auth-toggle" 
                  className="btn btn-outline-primary"
                  onClick={onOpenAuth}
                >
                  {t.nav.login}
                </button>
              </li>
            )}
            
            <li className="nav-item">
              <button onClick={(e) => handleNavClick(e, 'quote')} className="btn btn-primary px-4 py-2 fw-bold" id="quoteBtnNav">{t.nav.quote}</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};