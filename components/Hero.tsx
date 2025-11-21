import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-4 mb-lg-0 hero-text-col">
            <h1 className="hero-title mb-3 fw-bold">
              {t.hero.title}
            </h1>
            <p className="lead mb-4">
              {t.hero.subtitle}
            </p>
            <ul className="list-unstyled mb-4">
              {t.hero.items.map((item, index) => (
                <li className="mb-2" key={index}>
                  <i className="fas fa-check-circle me-2 ms-2 text-success"></i>
                  {item}
                </li>
              ))}
            </ul>
            
            <a href="#" className="btn btn-primary px-4 py-2 fw-bold">{t.hero.cta}</a>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src="https://placehold.co/600x600"
              className="img-fluid hero-image"
              alt="Translation Illustration"
            />
          </div>
        </div>
      </div>
    </section>
  );
};