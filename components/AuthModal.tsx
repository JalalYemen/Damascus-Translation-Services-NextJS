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
  const [errorMessage, setErrorMessage] = useState('');

  // TODO: Import Firebase methods here in the future
  // import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  // import { auth } from '../firebaseConfig'; // Your future firebase config

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
        if (type === 'signup') {
            // TODO: Add Firebase Signup Logic Here
            // await createUserWithEmailAndPassword(auth, email, password);
            // console.log("Firebase Signup Success");
        } else {
            // TODO: Add Firebase Login Logic Here
            // await signInWithEmailAndPassword(auth, email, password);
            // console.log("Firebase Login Success");
        }
        
        // Mock success for now until you add Firebase
        if (email) {
            onLogin(email);
        }

    } catch (error: any) {
        console.error("Auth Error", error);
        setErrorMessage(error.message || "Authentication failed");
    }
  };

  const handleGoogleSignIn = async () => {
      // TODO: Add Google Sign In Logic Here
      // const provider = new GoogleAuthProvider();
      // try {
      //    const result = await signInWithPopup(auth, provider);
      //    onLogin(result.user.email || '');
      // } catch (error) {
      //    setErrorMessage(error.message);
      // }
      console.log("Google Sign In Clicked - Mock");
      onLogin("google-user@example.com");
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
            
            {/* Error Message Area */}
            <div
              id="auth-error"
              style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}
            >
                {errorMessage}
            </div>

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
          <button id="google-signin" className="google-btn" onClick={handleGoogleSignIn}>
            <i className="fab fa-google"></i> {t.auth.google}
          </button>
        </div>
      </div>
    </>
  );
};