import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="container">
        {/* Use align-items-stretch to make columns equal height */}
        <div className="row align-items-stretch g-0"> 
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="hero-text-col">
                <h1 className="hero-title">
                {t.hero.title}
                </h1>
                <p className="hero-subtitle">
                {t.hero.subtitle}
                </p>
                <ul className="list-unstyled">
                {t.hero.items.map((item, index) => (
                    <li key={index}>
                    <i className="fas fa-check"></i>
                    {item}
                    </li>
                ))}
                </ul>
                
                <div>
                    <a href="#" className="btn btn-primary btn-lg shadow-sm">{t.hero.cta}</a>
                </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image-wrapper">
                <img
                src="https://placehold.co/600x600"
                className="img-fluid hero-image"
                alt="Translation Illustration"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};