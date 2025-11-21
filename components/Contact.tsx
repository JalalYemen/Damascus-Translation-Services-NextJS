import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_service: '',
    user_message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Mock sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Contact form submitted:", formData);
      
      setStatus('success');
      setFormData({ user_name: '', user_email: '', user_service: '', user_message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Contact form failed:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">{t.contact.title}</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form">
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">{t.contact.name}</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="user_name"
                      required
                      value={formData.user_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">{t.contact.email}</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="user_email"
                      required
                      value={formData.user_email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="service" className="form-label">{t.contact.serviceLabel}</label>
                  <select 
                    className="form-select" 
                    id="service" 
                    name="user_service" 
                    required
                    value={formData.user_service}
                    onChange={handleChange}
                  >
                    <option value="" disabled>{t.contact.servicePlaceholder}</option>
                    {t.contact.services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">{t.contact.message}</label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows={5}
                    name="user_message"
                    required
                    value={formData.user_message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                {status === 'success' && <div className="alert alert-success text-center">{t.contact.success}</div>}
                {status === 'error' && <div className="alert alert-danger text-center">{t.contact.error}</div>}
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold"
                  id="contactSubmitBtn"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? t.contact.sending : t.contact.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};