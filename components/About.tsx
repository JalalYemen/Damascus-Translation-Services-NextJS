import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';

export const About: React.FC = () => {
  const { t } = useLanguage();
  const { navigate } = useRouter();

  return (
    <main>
      {/* Page Header */}
      <header className="page-header">
        <div className="container">
            <h1 className="page-title">{t.about.title}</h1>
            <p className="page-subtitle">{t.about.subtitle}</p>
        </div>
      </header>

      {/* Our Mission Section */}
      <section className="service-detail-section">
        <div className="container">
            <div className="row align-items-center g-5">
                <div className="col-lg-6">
                    <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80" className="img-fluid rounded-3 shadow-sm" alt="A diverse team collaborating" />
                </div>
                <div className="col-lg-6">
                    <h2>{t.about.missionTitle}</h2>
                    <p>{t.about.missionText1}</p>
                    <p>{t.about.missionText2}</p>
                </div>
            </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="team-section">
        <div className="container">
            <h2 className="section-title">{t.about.teamTitle}</h2>
            <div className="row g-4">
                {t.about.team.map((member, index) => (
                    <div className="col-lg-4 col-md-6" key={index}>
                        <div className="team-card">
                            <img src={member.img} className="team-card-img" alt={member.name} />
                            <h5 className="team-card-name">{member.name}</h5>
                            <p className="team-card-role">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
            <h2>{t.about.ctaTitle}</h2>
            <p>{t.about.ctaText}</p>
            <button 
                onClick={() => {
                    navigate('home');
                    // Simple timeout to allow route change before scrolling
                    setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }} 
                className="btn btn-primary btn-lg px-5 py-3"
            >
                {t.about.ctaButton}
            </button>
        </div>
      </section>
    </main>
  );
};