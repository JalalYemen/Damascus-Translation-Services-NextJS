import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Resources: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="resources" className="resources-section">
      <div className="container">
        <h2 className="section-title">{t.resources.title}</h2>
        
        <div id="resourcesCarousel" className="carousel slide" data-bs-interval="false">
          <div className="carousel-inner">
            
            {t.resources.items.map((item, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                <div className="resource-card">
                  <img src={item.img} className="resource-logo" alt="Resource Logo" />
                  <h5 className="resource-name">{item.name}</h5>
                  <p className="resource-desc">
                    {item.desc}
                  </p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="resource-link">
                    <span>{t.resources.visit}</span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              </div>
            ))}

          </div>

          <button className="carousel-control-prev custom-carousel-control-prev-resources" type="button" data-bs-target="#resourcesCarousel" data-bs-slide="prev">
            <span className="visually-hidden">Previous</span>
          </button>

          <button className="carousel-control-next custom-carousel-control-resources" type="button" data-bs-target="#resourcesCarousel" data-bs-slide="next">
            <span className="visually-hidden">Next</span>
          </button>

        </div>
      </div>
    </section>
  );
};