import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuoteSummary {
  isCertified: boolean;
  fromLang: string;
  toLang: string;
  count: number;
  urgency: 'normal' | 'priority';
  totalPrice: string;
  serviceName: string;
}

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  summary: QuoteSummary;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, files, summary }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'sending' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      // SIMULATED UPLOAD (Visual only)
      for (let i = 0; i <= 100; i += 20) {
         setProgress(i);
         await new Promise(resolve => setTimeout(resolve, 200));
      }

      setStatus('sending');

      // SIMULATED EMAIL SENDING (Visual only)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus('success');
      
      // Reset and close after success message
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setName('');
        setEmail('');
        setMessage('');
      }, 2500);

    } catch (err) {
      console.error(err);
      setErrorMsg("Simulation failed");
      setStatus('error');
    }
  };

  return (
    <>
      <div className="overlay" style={{ display: 'block' }} onClick={onClose}></div>
      <div id="quoteContactModal" className="modal" style={{ display: 'block' }}>
        <div className="modal-content">
          <span className="close-button" onClick={onClose} style={{cursor: 'pointer', float: 'right', fontSize: '1.5rem'}}>&times;</span>
          
          <h3 style={{textAlign: 'center', marginBottom: '20px'}}>{t.quote.modal.title}</h3>
          
          {status === 'success' ? (
             <div className="text-center text-success py-4">
               <i className="fas fa-check-circle fa-3x mb-3"></i>
               <h4>{t.contact.success}</h4>
             </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t.quote.modal.service}: <strong>{summary.serviceName}</strong></label>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">{t.quote.modal.name}</label>
                    <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">{t.quote.modal.email}</label>
                    <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">{t.quote.modal.message}</label>
                <textarea className="form-control" rows={3} value={message} onChange={e => setMessage(e.target.value)}></textarea>
              </div>

              {status === 'uploading' && (
                <div className="mb-3">
                   <small>{t.quote.modal.sendingFiles} {Math.round(progress)}%</small>
                   <div className="progress" style={{height: '20px', backgroundColor: '#e9ecef', borderRadius: '5px', overflow: 'hidden'}}>
                     <div className="progress-bar" style={{width: `${progress}%`, height: '100%', backgroundColor: '#0d6efd', transition: 'width 0.5s ease'}}></div>
                   </div>
                </div>
              )}
              
              {status === 'sending' && (
                 <div className="text-center mb-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">{t.quote.modal.sendingEmail}</div>
                 </div>
              )}

              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

              <button type="submit" className="btn btn-primary w-100 py-2 mt-3" disabled={status !== 'idle' && status !== 'error'}>
                {status === 'sending' ? t.quote.modal.sendingEmail : t.quote.modal.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
