import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const Translations: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();
  const data = t.translationsPage;

  return (
    <main>
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
        </div>
      </header>

      {/* Document Translation Section */}
      <section className="service-detail-section">
        <div className="container">
            {/* Centered Image */}
            <div className="row justify-content-center mb-5">
                <div className="col-md-8 text-center">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" className="img-fluid rounded-3 shadow-sm" alt="Official document translation" />
                </div>
            </div>

            {/* Separate Boxes for Each Category */}
            <div className="row g-4">
                {data.categories.map((cat, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                        <div className="feature-card h-100">
                            <h5 className="category-title">{cat.title}</h5>
                            <p className="category-items">{cat.items}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="service-detail-section">
        <div className="container">
            <div className="text-center mb-5">
                <h2 className="section-title" style={{ color: 'var(--dark)', fontSize: '2.2rem' }}>
                    {data.commitment.title}
                </h2>
            </div>
            <div className="row g-4">
                {data.commitment.items.map((item, index) => (
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