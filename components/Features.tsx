
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Features: React.FC = () => {
  const { t, dir } = useLanguage();
  const { navigate } = useRouter();
  const arrowIcon = dir === 'rtl' ? 'fa-arrow-left' : 'fa-arrow-right';

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="section-title">{t.services.title}</h2>
        <div className="row g-4">
          {t.services.items.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="service-card">
                <div className="service-icon">
                  <i className={item.icon}></i>
                </div>
                <h3 className="service-title">{item.title}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>
                  {item.desc}
                </p>
                <a 
                  href={item.link} 
                  className="service-card-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.link === 'translations') {
                      navigate('translations');
                    } else if (item.link === 'solutions') {
                      navigate('solutions');
                    } else if (item.link === 'localizations') {
                      navigate('localizations');
                    } else if (item.link !== '#') {
                        console.log("Navigating to:", item.link);
                    }
                  }}
                >
                  <span>{t.services.more}</span>
                  <i className={`fas ${arrowIcon}`}></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
