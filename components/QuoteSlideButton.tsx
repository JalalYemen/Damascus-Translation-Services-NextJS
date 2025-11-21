
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const QuoteSlideButton: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Logic from ui.js: Show after Hero, hide before Contact
      const hero = document.querySelector(".hero-section") as HTMLElement;
      const contact = document.getElementById("contact") as HTMLElement;
      
      if (hero && contact) {
        const navbarHeight = 80; // Approx
        const heroBottom = hero.offsetHeight;
        const contactTop = contact.offsetTop;
        const scrollY = window.scrollY;

        const shouldShow = scrollY > heroBottom && scrollY < contactTop - navbarHeight;
        setIsVisible(shouldShow);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => navigate('quote')}
      className={`btn btn-primary px-4 py-2 fw-bold quote-slide-btn ${isVisible ? 'show' : ''}`}
      id="quoteSlideBtn"
      aria-label={t.nav?.quote || "Get Quote"}
    >
      {t.nav?.quote || "Get Quote"}
    </button>
  );
};
