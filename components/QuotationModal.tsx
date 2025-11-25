
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuoteSummary {
  isCertified: boolean;
  fromLang: string;
  toLang: string;
  count: number;
  urgency: 'normal' | 'priority';
  totalPrice: string;
  serviceName: string;
  selectedFilesCount: number;
}

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  summary: QuoteSummary;
}

// Configuration from ui.js
const CLOUDINARY_CLOUD_NAME = "drxvjsnm2";
const CLOUDINARY_UPLOAD_PRESET = "Damascus Translation";
const UPLOAD_MAX_PER_FILE_MB = 50;

export const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, files, summary }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'sending' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sessionId, setSessionId] = useState('');

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(`quote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Initialize EmailJS if not already
  useEffect(() => {
    if (window.emailjs) {
        window.emailjs.init("YWr00jt06-K5B1xtt");
    }
  }, []);

  if (!isOpen) return null;

  // Cloudinary Upload Logic (Ported from ui.js)
  const uploadFilesToCloudinary = async (filesToUpload: File[]): Promise<{name: string, url: string}[]> => {
    if (filesToUpload.length === 0) return [];

    const uploadedFileDetails: {name: string, url: string}[] = [];
    let filesProcessed = 0;

    const uploadPromises = filesToUpload.map(file => {
        return new Promise<void>((resolve, reject) => {
            if (file.size > UPLOAD_MAX_PER_FILE_MB * 1024 * 1024) {
                reject(new Error(t.ui.fileSizeLimit.replace('{size}', UPLOAD_MAX_PER_FILE_MB.toString())));
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            // Add context (metadata)
            let contextString = `uploader_email=${email || 'anonymous'}`;
            contextString += `|quote_session_id=${sessionId}`;
            contextString += `|quote_type=${summary.isCertified ? 'certified' : 'professional'}`;
            formData.append('context', contextString);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const singleFileProgress = (event.loaded / event.total) * 100;
                    const overallProgress = ((filesProcessed * 100) + singleFileProgress) / filesToUpload.length;
                    setProgress(overallProgress);
                    setStatusMessage(t.ui.uploading.replace('{fileName}', file.name).replace('{progress}', Math.round(singleFileProgress).toString()));
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    uploadedFileDetails.push({ name: data.original_filename || file.name, url: data.secure_url });
                    filesProcessed++;
                    resolve();
                } else {
                    reject(new Error(`Cloudinary upload failed for ${file.name}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error(t.ui.uploadFailed.replace('{fileName}', file.name).replace('{error}', 'Network Error')));
            });

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
            xhr.send(formData);
        });
    });

    await Promise.all(uploadPromises);
    return uploadedFileDetails;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');
    setStatusMessage(t.quote.modal.sendingFiles);

    try {
      // 1. Upload Files
      let uploadedFiles: {name: string, url: string}[] = [];
      if (files.length > 0) {
          uploadedFiles = await uploadFilesToCloudinary(files);
      }

      setStatus('sending');
      setStatusMessage(t.quote.modal.sendingEmail);

      // 2. Prepare Email Params (matching ui.js template logic)
      const count = Number(summary.count);
      const isCertified = summary.isCertified;
      const basePriceRate = isCertified ? 31.75 : 0.10;
      const urgencyFeeRate = isCertified ? 7.94 : 4.75;
      const serviceBasePriceCalculated = (count * basePriceRate).toFixed(2);
      const urgencyFeeCalculated = (summary.urgency === 'priority' && count > 0) ? urgencyFeeRate : 0;
      
      const unitType = isCertified ? (count === 1 ? t.quote.email.page : t.quote.email.pages) : (count === 1 ? t.quote.email.word : t.quote.email.words);
      const urgencyType = summary.urgency === 'priority' ? t.quote.email.urgent : t.quote.email.normal;

      // Construct Order Items for Template Loop
      const orderItems = [];
      orderItems.push({
          image_url: t.ui.serviceIconUrl,
          name: `${summary.serviceName} (${count} ${unitType})`,
          units: 1,
          price: serviceBasePriceCalculated
      });

      if (summary.urgency === 'priority' && count > 0) {
          orderItems.push({
              image_url: t.ui.serviceIconUrl,
              name: `${t.quote.email.fee} (${urgencyType})`,
              units: 1,
              price: urgencyFeeCalculated.toFixed(2)
          });
      }

      const fileLinksFormatted = uploadedFiles.length > 0 ?
          uploadedFiles.map(f => `${f.name}: ${f.url}`).join('\n') :
          t.ui.noFilesYet;

      const templateParams = {
        // User Contact
        user_name: name,
        user_email: email,
        user_service: summary.serviceName,
        user_message: message,

        // Order Summary
        order_id: sessionId,
        orders: orderItems,
        cost: {
            shipping: "0.00",
            tax: "0.00",
            total: summary.totalPrice
        },
        email: email, // For footer

        // Extra Context
        uploaded_file_links: fileLinksFormatted,
        uploaded_file_urls_raw: uploadedFiles.map(f => f.url).join(', ') || t.ui.noFilesYet,
        uploaded_file_names: uploadedFiles.map(f => f.name).join(', ') || t.ui.noFilesYet,
        service_name_for_subject: summary.serviceName
      };

      // 3. Send Email
      if (!window.emailjs) throw new Error("EmailJS SDK not loaded");
      
      await window.emailjs.send(
        "service_oo9vipi", 
        "template_aq0gztz", 
        templateParams
      );

      setStatus('success');
      
      setTimeout(() => {
        onClose();
        // Reset state
        setStatus('idle');
        setName('');
        setEmail('');
        setMessage('');
        setProgress(0);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t.quote.modal.error);
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
                   <small>{statusMessage}</small>
                   <div className="progress" style={{height: '20px', backgroundColor: '#e9ecef', borderRadius: '5px', overflow: 'hidden'}}>
                     <div className="progress-bar" style={{width: `${progress}%`, height: '100%', backgroundColor: '#0d6efd', transition: 'width 0.2s ease'}}>
                        {Math.round(progress)}%
                     </div>
                   </div>
                </div>
              )}
              
              {status === 'sending' && (
                 <div className="text-center mb-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">{statusMessage}</div>
                 </div>
              )}

              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

              <button type="submit" className="btn btn-primary w-100 py-2 mt-3" disabled={status !== 'idle' && status !== 'error'}>
                {status === 'sending' || status === 'uploading' ? statusMessage : t.quote.modal.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
