import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { navigate, currentRoute } = useRouter();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    if (href === '#') {
        navigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
        // If it's a section link (e.g. #services)
        if (currentRoute !== 'home') {
            navigate('home');
            // Allow render to happen then scroll
            setTimeout(() => {
                const element = document.querySelector(href);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(href);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // It's likely a route or external link if we had them
        console.log("Navigating to", href);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          {t.footer.links.map((link, index) => (
             <a 
                href={link.href} 
                className="footer-link" 
                key={index}
                onClick={(e) => handleLinkClick(e, link.href)}
             >
                {link.text}
             </a>
          ))}
        </div>
        <div className="social-icons">
          <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
        </div>
        <p className="mb-0 text-center">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
};
