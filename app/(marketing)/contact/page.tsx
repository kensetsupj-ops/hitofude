'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', category: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <Link href="/" className="back-link">← ホームに戻る</Link>
        <h1>お問い合わせ・フィードバック</h1>
        <p className="description">
          ひとふでに関するご質問、ご要望、不具合報告、フィードバックなど、お気軽にお送りください。<br />
          皆様のご意見がサービス改善の大きな力になります。
        </p>
      </header>

      <main className="contact-content">
        {status === 'success' ? (
          <div className="success-message">
            <h2>✓ 送信完了</h2>
            <p>お問い合わせありがとうございます。内容を確認次第、ご連絡いたします。</p>
            <button onClick={() => setStatus('idle')} className="reset-btn">
              もう一度送信する
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">お名前 <span className="required">必須</span></label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="山田 太郎"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">メールアドレス <span className="required">必須</span></label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="example@example.com"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">カテゴリ <span className="required">必須</span></label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                disabled={status === 'submitting'}
              >
                <option value="">選択してください</option>
                <option value="不具合報告">🐛 不具合報告</option>
                <option value="機能の要望">💡 機能の要望</option>
                <option value="フィードバック・感想">💬 フィードバック・感想</option>
                <option value="使い方の質問">❓ 使い方の質問</option>
                <option value="その他">📝 その他</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">件名 <span className="required">必須</span></label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="例：地図が表示されない、矢印の色を変更したい"
                disabled={status === 'submitting'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">お問い合わせ内容 <span className="required">必須</span></label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={8}
                placeholder="具体的な内容をご記入ください"
                disabled={status === 'submitting'}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
              {status === 'submitting' ? '送信中...' : '送信する'}
            </button>

            {status === 'error' && (
              <div className="error-message">
                送信に失敗しました。しばらくしてから再度お試しください。
              </div>
            )}
          </form>
        )}

        <section className="contact-info">
          <h2>その他のお問い合わせ方法</h2>
          <p>
            フォームでのお問い合わせが難しい場合は、以下のメールアドレスに直接ご連絡ください：
          </p>
          <p className="email-address">
            <a href="mailto:support@hitofude.net">support@hitofude.net</a>
          </p>
          <p className="note">
            ※ お問い合わせへの返信には数日かかる場合があります。あらかじめご了承ください。
          </p>
        </section>
      </main>

      <footer className="contact-footer">
        <Link href="/">← ホームに戻る</Link>
      </footer>

      <style jsx>{`
        .contact-page {
          max-width: 700px;
          margin: 0 auto;
          padding: 80px 20px;
          font-family: system-ui, "Noto Sans JP", sans-serif;
          line-height: 1.8;
        }

        .contact-header {
          margin-bottom: 40px;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #0066cc;
          text-decoration: none;
          font-size: 14px;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        h1 {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #333;
        }

        .description {
          font-size: 15px;
          color: #666;
        }

        .contact-form {
          background: #fafafa;
          padding: 30px;
          border: 1px solid #ddd;
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #333;
        }

        .required {
          color: #c00;
          font-size: 12px;
          margin-left: 4px;
        }

        input[type="text"],
        input[type="email"],
        select,
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          font-size: 15px;
          font-family: inherit;
          box-sizing: border-box;
        }

        select {
          cursor: pointer;
          background: white;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #0066cc;
        }

        input:disabled,
        select:disabled,
        textarea:disabled {
          background: #f0f0f0;
          cursor: not-allowed;
        }

        textarea {
          resize: vertical;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #333;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #555;
        }

        .submit-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .success-message {
          background: #e8f5e9;
          border: 2px solid #4caf50;
          padding: 40px;
          text-align: center;
          margin-bottom: 40px;
        }

        .success-message h2 {
          font-size: 24px;
          color: #2e7d32;
          margin-bottom: 12px;
        }

        .success-message p {
          font-size: 15px;
          color: #555;
          margin-bottom: 20px;
        }

        .reset-btn {
          padding: 10px 24px;
          background: #333;
          color: white;
          border: none;
          font-size: 14px;
          cursor: pointer;
        }

        .reset-btn:hover {
          background: #555;
        }

        .error-message {
          margin-top: 16px;
          padding: 12px;
          background: #ffebee;
          border: 1px solid #f44336;
          color: #c62828;
          font-size: 14px;
        }

        .contact-info {
          padding: 24px;
          background: #f9f9f9;
          border-left: 4px solid #333;
        }

        .contact-info h2 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #333;
        }

        .contact-info p {
          font-size: 15px;
          color: #555;
          margin-bottom: 12px;
        }

        .email-address {
          font-size: 16px;
          font-weight: 600;
        }

        .email-address a {
          color: #0066cc;
          text-decoration: none;
        }

        .email-address a:hover {
          text-decoration: underline;
        }

        .note {
          font-size: 13px;
          color: #888;
        }

        .contact-footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
        }

        @media (max-width: 768px) {
          .contact-page {
            padding: 60px 16px;
          }

          h1 {
            font-size: 28px;
          }

          .contact-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}