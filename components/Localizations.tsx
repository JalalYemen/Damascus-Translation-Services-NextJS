import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Localizations: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const data = (t as any).localizationsPage;

  if (!data) return null;

  return (
    <main>
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
        </div>
      </header>

      {/* Layout: Cards (Usually English "Expert Interpretation") */}
      {data.layout === 'cards' && (
        <section className="service-detail-section">
            <div className="container">
                {/* Centered Image Row */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-8 text-center">
                        <img src={data.heroImage} className="img-fluid rounded-3 shadow-sm" alt={data.title} />
                    </div>
                </div>

                <div className="row g-4">
                    {data.items?.map((item: any, index: number) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="feature-card h-100">
                                <h5 className="category-title">{item.title}</h5>
                                <p className="category-items" style={{whiteSpace: 'pre-line'}}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* Layout: Sections (Usually Arabic "Digital Localization") */}
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
                            {section.list && (
                                <ul className="list-unstyled">
                                    {section.list.map((item: string, idx: number) => (
                                        <li className="mb-2" key={idx}>
                                            <strong className="text-secondary me-2">•</strong>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>
            ))}
        </div>
      )}

      {/* Commitment Section */}
      <section className="service-detail-section">
        <div className="container">
            <div className="text-center mb-5">
                <h2 className="section-title" style={{ color: 'var(--dark)', fontSize: '2.2rem' }}>
                    {data.commitment.title}
                </h2>
            </div>
            <div className="row g-4">
                {data.commitment.items.map((item: any, index: number) => (
                    <div className="col-lg-3 col-md-6" key={index}>
                        <div className="feature-card text-center">
                            <div className="icon"><i className={item.icon}></i></div>
                            <h5>{item.title}</h5>
                            <p className="mb-0">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
            <h2>{data.ctaTitle}</h2>
            <p>{data.ctaText}</p>
            <button 
                onClick={() => navigate('quote')} 
                className="btn btn-primary btn-lg px-5 py-3"
            >
                {data.ctaButton}
            </button>
        </div>
      </section>
    </main>
  );
};