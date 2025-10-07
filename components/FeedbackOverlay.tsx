'use client';

import { useState } from 'react';

interface FeedbackOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackOverlay({ isOpen, onClose }: FeedbackOverlayProps) {
  const [formData, setFormData] = useState({
    email: '',
    type: 'feedback',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setFormData({ email: '', type: 'feedback', message: '' });
          setStatus('idle');
          onClose();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      setStatus('error');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-overlay" onClick={handleOverlayClick}>
      <div className="feedback-modal">
        <button className="close-button" onClick={onClose}>×</button>

        <h2 className="feedback-title">フィードバック</h2>
        <p className="feedback-description">
          ご意見・ご要望・不具合報告などをお聞かせください
        </p>

        {status === 'success' ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>送信完了しました</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="email">メールアドレス（任意）</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="返信が必要な場合はご記入ください"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">種類</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={status === 'submitting'}
              >
                <option value="feedback">ご意見・ご要望</option>
                <option value="bug">不具合報告</option>
                <option value="question">質問</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">内容 <span className="required">*</span></label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                placeholder="具体的な内容をご記入ください"
                disabled={status === 'submitting'}
              />
            </div>

            <button type="submit" className="submit-button" disabled={status === 'submitting'}>
              {status === 'submitting' ? '送信中...' : '送信する'}
            </button>

            {status === 'error' && (
              <div className="error-message">
                送信に失敗しました。しばらくしてから再度お試しください。
              </div>
            )}
          </form>
        )}
      </div>

      <style jsx>{`
        .feedback-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .feedback-modal {
          background: white;
          border-radius: 8px;
          padding: 32px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 32px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #000;
        }

        .feedback-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }

        .feedback-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .required {
          color: #c00;
          font-size: 12px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0066cc;
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          background: #f0f0f0;
          cursor: not-allowed;
        }

        .form-group textarea {
          resize: vertical;
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          background: #333;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #555;
        }

        .submit-button:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .success-message {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          font-size: 64px;
          color: #4caf50;
          margin-bottom: 16px;
        }

        .success-message p {
          font-size: 18px;
          color: #333;
          font-weight: 600;
        }

        .error-message {
          margin-top: 12px;
          padding: 12px;
          background: #ffebee;
          border: 1px solid #f44336;
          border-radius: 4px;
          color: #c62828;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .feedback-modal {
            padding: 24px;
            max-height: 95vh;
          }

          .feedback-title {
            font-size: 20px;
          }

          .close-button {
            top: 12px;
            right: 12px;
          }
        }

        @media print {
          .feedback-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}