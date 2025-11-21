
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { QuotationModal } from './QuotationModal';
import { useRouter } from '../contexts/RouterContext';

type Urgency = 'normal' | 'priority';
type Tab = 'certified' | 'professional';

export const Quotation: React.FC = () => {
  const { t, language } = useLanguage();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('certified');
  
  // Form States
  const [certifiedPages, setCertifiedPages] = useState<number>(0);
  const [certifiedUrgency, setCertifiedUrgency] = useState<Urgency>('normal');
  const [certifiedFiles, setCertifiedFiles] = useState<File[]>([]);
  
  const [profWords, setProfWords] = useState<number>(0);
  const [profUrgency, setProfUrgency] = useState<Urgency>('normal');
  const [profFiles, setProfFiles] = useState<File[]>([]);

  const [fromLang, setFromLang] = useState(language === 'ar' ? 'Arabic' : 'English');
  const [toLang, setToLang] = useState('German'); // Default example

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Constants
  const CERTIFIED_RATE = 31.75;
  const CERTIFIED_URGENCY_FEE = 7.94;
  const PROF_RATE = 0.10;
  const PROF_URGENCY_FEE = 4.75;

  // Ensure translation object exists to prevent crash
  if (!t || !t.quote || !t.quote.form) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  // Calculated Values
  const calculateTotal = () => {
    if (activeTab === 'certified') {
      let total = certifiedPages * CERTIFIED_RATE;
      if (certifiedUrgency === 'priority' && certifiedPages > 0) {
        total += CERTIFIED_URGENCY_FEE;
      }
      return total;
    } else {
      let total = profWords * PROF_RATE;
      if (profUrgency === 'priority' && profWords > 0) {
        total += PROF_URGENCY_FEE;
      }
      return total;
    }
  };

  const getDeliveryDate = () => {
    const urgency = activeTab === 'certified' ? certifiedUrgency : profUrgency;
    const days = urgency === 'priority' ? 1 : 2;
    const date = new Date();
    date.setDate(date.getDate() + days);
    try {
        return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: "long", month: "long", day: "numeric" });
    } catch (e) {
        return date.toLocaleDateString();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files) as File[];
      // Validation (Size limit 50MB per file)
      const hasLargeFile = fileList.some(f => f.size > 50 * 1024 * 1024);
      if (hasLargeFile) {
        setError(t.quote.errors?.fileSize || "File too large");
        return;
      }
      setError('');
      if (activeTab === 'certified') setCertifiedFiles(fileList);
      else setProfFiles(fileList);
    }
  };

  const handleContinue = () => {
    setError('');
    const files = activeTab === 'certified' ? certifiedFiles : profFiles;
    const count = activeTab === 'certified' ? certifiedPages : profWords;
    
    if (files.length === 0) {
      setError(t.quote.errors?.noFiles || "Please select files");
      return;
    }
    if (count <= 0) {
      setError(t.quote.errors?.invalidCount || "Invalid count");
      return;
    }
    if (fromLang === toLang) {
      setError(t.quote.errors?.langMismatch || "Languages must be different");
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      {/* Step Indicator matching quotation.html */}
      <div className="step-indicator pt-4">
        <div className="step active">{t.quote.steps?.step1}</div>
        <div className="step">{t.quote.steps?.step2}</div>
        <div className="step">{t.quote.steps?.step3}</div>
      </div>

      <div className="content-wrapper mb-5">
        
        {/* Tabs matching quotation.html */}
        <div className="tabs">
          <div
            className={`tab ${activeTab === 'certified' ? 'active' : ''}`}
            onClick={() => setActiveTab('certified')}
          >
            {t.quote.tabs?.certified}
          </div>
          <div
            className={`tab ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            {t.quote.tabs?.professional}
          </div>
        </div>

        <div className="main-container">
          
          {/* Form Section */}
          <div className="form-section">
            {activeTab === 'certified' ? (
                <div id="certifiedForm">
                    <div className="form-group">
                        <label>{t.quote.form?.from}</label>
                        <select
                            value={fromLang}
                            onChange={(e) => setFromLang(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Arabic">Arabic</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.to}</label>
                        <select
                            value={toLang}
                            onChange={(e) => setToLang(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Arabic">Arabic</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.upload}</label>
                        <input type="file" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip" />
                        <div className="error-message">{error}</div>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.pages}</label>
                        <input
                            type="number"
                            min="1"
                            value={certifiedPages}
                            onChange={(e) => setCertifiedPages(parseInt(e.target.value) || 0)}
                        />
                        <small className="text-muted d-block mt-1">{t.quote.form?.pagesHint}</small>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.urgency}</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="certifiedUrgency"
                                    value="normal"
                                    checked={certifiedUrgency === 'normal'}
                                    onChange={() => setCertifiedUrgency('normal')}
                                />
                                {t.quote.form?.normal}
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="certifiedUrgency"
                                    value="priority"
                                    checked={certifiedUrgency === 'priority'}
                                    onChange={() => setCertifiedUrgency('priority')}
                                />
                                {t.quote.form?.priorityCertified}
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div id="professionalForm">
                    <div className="form-group">
                        <label>{t.quote.form?.from}</label>
                        <select
                            value={fromLang}
                            onChange={(e) => setFromLang(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Arabic">Arabic</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.to}</label>
                        <select
                            value={toLang}
                            onChange={(e) => setToLang(e.target.value)}
                        >
                            <option value="English">English</option>
                            <option value="Arabic">Arabic</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.upload}</label>
                        <input type="file" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip" />
                        <div className="error-message">{error}</div>
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.words}</label>
                        <input
                            type="number"
                            min="1"
                            value={profWords}
                            onChange={(e) => setProfWords(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.quote.form?.urgency}</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="professionalUrgency"
                                    value="normal"
                                    checked={profUrgency === 'normal'}
                                    onChange={() => setProfUrgency('normal')}
                                />
                                {t.quote.form?.normal}
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="professionalUrgency"
                                    value="priority"
                                    checked={profUrgency === 'priority'}
                                    onChange={() => setProfUrgency('priority')}
                                />
                                {t.quote.form?.priorityProfessional}
                            </label>
                        </div>
                    </div>
                </div>
            )}
            
            <button className="continue-btn" onClick={handleContinue}>{t.quote.form?.continue}</button>
            <button className="goback-btn" onClick={() => navigate('home')}>{t.quote.form?.back}</button>
          </div>

          {/* Quote Summary Section */}
          <div className="quote-summary">
            <h3>{t.quote.title}</h3>
            <div>{t.quote.summary?.service}: <strong>{activeTab === 'certified' ? t.quote.tabs?.certified : t.quote.tabs?.professional}</strong></div>
            <div>{t.quote.summary?.type}: {activeTab === 'certified' ? `$${CERTIFIED_RATE} / ${t.quote.email?.page || 'page'}` : `$${PROF_RATE} / ${t.quote.email?.word || 'word'}`}</div>
            
            <div className="mt-3">
                <strong>{t.quote.summary?.files}:</strong>
                <ul className="uploaded-files-list" style={{listStyle: 'none', padding: 0, marginTop: '5px'}}>
                   {(activeTab === 'certified' ? certifiedFiles : profFiles).map((f, i) => (
                       <li key={i} style={{fontSize: '0.9em'}}><i className="fas fa-file me-2 text-muted"></i>{f.name}</li>
                   ))}
                   {(activeTab === 'certified' ? certifiedFiles : profFiles).length === 0 && <li className="text-muted font-italic">-</li>}
                </ul>
            </div>
            
            <div className="mt-3">{t.quote.summary?.delivery}: <span style={{color: '#004e64'}}>{getDeliveryDate()}</span></div>
            
            <div className="quote-total">
                {t.quote.summary?.total}: ${calculateTotal().toFixed(2)} 💰
            </div>
          </div>

        </div>
      </div>

      <QuotationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        files={activeTab === 'certified' ? certifiedFiles : profFiles}
        summary={{
          isCertified: activeTab === 'certified',
          fromLang,
          toLang,
          count: activeTab === 'certified' ? certifiedPages : profWords,
          urgency: activeTab === 'certified' ? certifiedUrgency : profUrgency,
          totalPrice: calculateTotal().toFixed(2),
          serviceName: activeTab === 'certified' ? (t.quote.tabs?.certified || 'Certified') : (t.quote.tabs?.professional || 'Professional')
        }}
      />
    </>
  );
};
