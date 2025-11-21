import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    if (email) {
      // Mock Login Logic
      onLogin(email);
    }
  };

  return (
    <>
      <div id="overlay" className="overlay" style={{ display: 'block' }} onClick={onClose}></div>
      <div id="auth-modal" style={{ display: 'flex' }}>
        <div className="modal-content">
          <button id="auth-close" className="close-btn" aria-label="Close" onClick={onClose}>×</button>
          <h2>{t.auth.welcome}</h2>
          <form id="auth-form">
            <input
              type="email"
              id="auth-email"
              className="form-control mb-3"
              placeholder={t.auth.email}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              id="auth-password"
              className="form-control mb-3"
              placeholder={t.auth.password}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              id="auth-error"
              style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}
            ></div>
            <button
              type="button"
              id="signup-button"
              className="btn btn-warning w-100 mb-3"
              onClick={(e) => handleSubmit(e, 'signup')}
            >
              {t.auth.signup}
            </button>
            <button
              type="button"
              id="login-button"
              className="btn btn-primary w-100 mb-3"
              onClick={(e) => handleSubmit(e, 'login')}
            >
              {t.auth.login}
            </button>
          </form>
          <hr />
          <div className="or-text">{t.auth.or}</div>
          <button id="google-signin" className="google-btn">
            <i className="fab fa-google"></i> {t.auth.google}
          </button>
        </div>
      </div>
    </>
  );
};