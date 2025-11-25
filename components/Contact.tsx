
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

declare global {
  interface Window {
    emailjs: any;
  }
}

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_service: '',
    user_message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Initialize EmailJS
    if (window.emailjs) {
        window.emailjs.init("YWr00jt06-K5B1xtt");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    if (!window.emailjs) {
        console.error("EmailJS SDK not loaded");
        setStatus('error');
        setErrorMessage("Email service unavailable");
        return;
    }

    try {
      const templateParams = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_service: formData.user_service,
        user_message: formData.user_message,
        isQuoteRequest: "No"
      };

      await window.emailjs.send(
        "service_oo9vipi", // Service ID
        "template_80ep6mu", // General Contact Template ID
        templateParams
      );
      
      setStatus('success');
      setFormData({ user_name: '', user_email: '', user_service: '', user_message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error("Contact form failed:", error);
      setStatus('error');
      setErrorMessage(error.text || error.message || "Unknown error");
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
                {status === 'error' && <div className="alert alert-danger text-center">{t.contact.error} {errorMessage && `(${errorMessage})`}</div>}
                
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
