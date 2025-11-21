import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="how" className="how-section">
      <div className="container">
        <h2 className="section-title">{t.how.title}</h2>
        <div className="row g-4">
          {t.how.steps.map((step, index) => (
            <div className="col-md-4" key={index}>
              <div className="how-step">
                <div className="step-icon"><i className={step.icon}></i></div>
                <div className="how-step-title">{step.title}</div>
                <div>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};