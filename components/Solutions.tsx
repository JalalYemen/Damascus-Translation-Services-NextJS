import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Solutions: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  // We cast to any here because the data structure differs between languages (layout: 'cards' vs 'sections')
  const data = t.solutionsPage as any;

  return (
    <main>
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
        </div>
      </header>

      {/* Layout 1: Cards (Used in English) */}
      {data.layout === 'cards' && (
        <section className="service-detail-section">
          <div className="container">
             {/* Hero Image for this section */}
             <div className="row justify-content-center mb-5">
                <div className="col-md-8 text-center">
                    <img src={data.heroImage} className="img-fluid rounded-3 shadow-sm" alt="Creative Solutions" />
                </div>
            </div>

            <div className="row g-4">
                {data.cards?.map((card: any, index: number) => (
                    <div className="col-md-4" key={index}>
                        <div className="feature-card h-100 text-center">
                            <div className="icon mb-3"><i className="fas fa-lightbulb"></i></div>
                            <h3 className="h4 mb-3">{card.title}</h3>
                            <p style={{whiteSpace: 'pre-line'}}>{card.items}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Layout 2: Alternating Sections (Used in Arabic) */}
      {data.layout === 'sections' && (
        <div className="container pb-5">
            {data.sections?.map((section: any, index: number) => (
                <section className="py-5" key={index}>
                    <div className={`row align-items-center g-5 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                        <div className="col-lg-6">
                            <img src={section.image} className="img-fluid rounded-3 shadow-sm" alt={section.title} />
                        </div>
                        <div className="col-lg-6">
                            <h2 className="mb-3 text-primary fw-bold">{section.title}</h2>
                            <p className="lead mb-4">{section.text}</p>
                            <ul className="list-unstyled">
                                {section.list?.map((item: string, idx: number) => (
                                    <li className="mb-2" key={idx}>
                                        <i className="fas fa-check-circle text-success me-2 ms-2"></i>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            ))}
        </div>
      )}

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
            <h2>{data.ctaTitle}</h2>
            <p>{data.ctaText}</p>
            <button 
                onClick={() => {
                    navigate('quote');
                }} 
                className="btn btn-primary btn-lg px-5 py-3"
            >
                {data.ctaButton}
            </button>
        </div>
      </section>
    </main>
  );
};
