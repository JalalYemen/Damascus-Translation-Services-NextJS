import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          {t.footer.links.map((link, index) => (
             <a href={link.href} className="footer-link" key={index}>{link.text}</a>
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