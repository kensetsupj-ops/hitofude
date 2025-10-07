'use client';

import { useState } from 'react';

interface WelcomeGuideProps {
  onClose: () => void;
}

export default function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'ステップ1: 基本情報の入力',
      content: '上部の「編集」ボタンをクリックして、現場名・住所・日時などの基本情報を入力してください。',
      icon: '📝',
    },
    {
      title: 'ステップ2: 地図上に経路を描画',
      content: 'ツールバーから矢印や線を選んで、搬入経路を地図上に描いてください。',
      icon: '🗺️',
    },
    {
      title: 'ステップ3: 印刷・共有',
      content: '印刷ボタンでPDF出力、URLコピーで共有ができます。',
      icon: '🖨️',
    },
  ];

  return (
    <div className="welcome-guide">
      <div className="guide-overlay" onClick={onClose} />
      <div className="guide-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>搬入経路図ツールへようこそ</h2>

        <div className="steps-container">
          <div className="step">
            <div className="step-icon">{steps[currentStep].icon}</div>
            <h3>{steps[currentStep].title}</h3>
            <p>{steps[currentStep].content}</p>
          </div>
        </div>

        <div className="step-indicators">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <div className="guide-actions">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep(currentStep - 1)}>
              前へ
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button className="primary" onClick={() => setCurrentStep(currentStep + 1)}>
              次へ
            </button>
          ) : (
            <button className="primary" onClick={onClose}>
              始める
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .welcome-guide {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .guide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .guide-content {
          position: relative;
          background: white;
          padding: 32px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .close-btn:hover {
          color: #000;
        }

        h2 {
          margin: 0 0 24px;
          font-size: 24px;
          text-align: center;
        }

        .steps-container {
          margin: 24px 0;
        }

        .step {
          text-align: center;
          min-height: 150px;
        }

        .step-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .step h3 {
          margin: 0 0 12px;
          font-size: 18px;
        }

        .step p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .step-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 24px 0;
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          padding: 0;
        }

        .indicator.active {
          background: #333;
        }

        .guide-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .guide-actions button {
          padding: 8px 24px;
          border: 1px solid #ccc;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .guide-actions button.primary {
          background: #333;
          color: white;
          border-color: #333;
        }

        .guide-actions button:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}