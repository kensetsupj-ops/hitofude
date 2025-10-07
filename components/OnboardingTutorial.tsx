'use client';

import { useState, useEffect } from 'react';
import { Guide } from '@/lib/types';

interface OnboardingTutorialProps {
  guide: Guide;
  onClose: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: '🚚 ひとふで案内図へようこそ！',
    content: '建設現場の搬入経路図を簡単に作成・共有できるツールです。\n\n3ステップで経路図を作成しましょう：\n① 住所入力 → ② 地図に描画 → ③ 印刷・共有',
    target: null,
    action: null
  },
  {
    id: 'sidebar-info',
    title: 'ステップ 1: 右側で案件情報を入力',
    content: '右側のサイドバーで、案件名・住所・スケジュールなどを入力します。\n\n特に「現場住所」は必須です！\n住所を入力してEnterキーを押すと、地図が自動的にその場所に移動します。',
    target: '.sidebar',
    action: null
  },
  {
    id: 'address',
    title: 'ステップ 1-1: 現場住所を設定',
    content: '現場住所欄（黄色の背景）に住所を入力してください。\n\n例: 東京都千代田区丸の内1-1-1\n\nEnterキーまたは🔍ボタンで地図が移動します。',
    target: '.address-group',
    action: 'focus-address'
  },
  {
    id: 'drawing',
    title: 'ステップ 2: 経路を描画',
    content: 'ツールバーから矢印や図形を選んで、地図上に搬入経路や重要なポイントを描きます。\n\n・矢印：進行方向を示す\n・円：搬入口やポイントを囲む\n・テキスト：注意事項を記入\n\nショートカット: A=矢印、C=円、T=テキスト',
    target: '.toolbar',
    action: null
  },
  {
    id: 'pages',
    title: 'ステップ 2-1: 詳細図と周辺図',
    content: 'ツールバー左側で「詳細図」と「周辺図」を切り替えられます。\n\n・詳細図：現場付近の拡大図\n・周辺図：広域の進入経路図\n\n両方に描画して、分かりやすい経路図を作りましょう！',
    target: '.page-tabs',
    action: null
  },
  {
    id: 'share',
    title: 'ステップ 3: 印刷・共有',
    content: '「印刷プレビュー」ボタンでA4横向きのPDFを生成できます。\n\n「URLコピー」でリンクを共有すれば、協力会社やドライバーに簡単に情報を共有できます。\n\n「保存」ボタンでJSONファイルとして保存し、後から読み込むこともできます。',
    target: '.print-button',
    action: null
  },
  {
    id: 'complete',
    title: '✨ 準備完了！',
    content: 'これで基本的な使い方は完璧です！\n\nさっそく搬入経路図を作成してみましょう。\n\n困った時は、右側のサイドバーから始めると分かりやすいですよ。',
    target: null,
    action: null
  }
];

export default function OnboardingTutorial({ guide, onClose }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // ハイライト対象要素にクラスを追加
    const step = steps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.classList.add('tutorial-highlight');

        // スクロールして要素を表示
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // クリーンアップ
    return () => {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = steps[currentStep];

  if (isMinimized) {
    return (
      <div className="tutorial-minimized">
        <button
          onClick={() => setIsMinimized(false)}
          className="tutorial-restore-btn"
        >
          💡 チュートリアルを再開
        </button>
        <button
          onClick={onClose}
          className="tutorial-close-btn"
        >
          ×
        </button>

        <style jsx>{`
          .tutorial-minimized {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 9999;
          }

          .tutorial-restore-btn {
            padding: 6px 14px;
            background: rgba(255, 255, 255, 0.95);
            color: #667eea;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .tutorial-restore-btn:hover {
            background: white;
            transform: translateY(-1px);
          }

          .tutorial-close-btn {
            width: 28px;
            height: 28px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 18px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .tutorial-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="tutorial-overlay">
        <div className="tutorial-modal">
          <div className="tutorial-header">
            <h3>{step.title}</h3>
            <div className="tutorial-actions">
              <button
                onClick={() => setIsMinimized(true)}
                className="tutorial-minimize-btn"
                title="最小化"
              >
                _
              </button>
              <button
                onClick={handleSkip}
                className="tutorial-close-btn"
                title="閉じる"
              >
                ×
              </button>
            </div>
          </div>

          <div className="tutorial-content">
            <p>{step.content}</p>
          </div>

          <div className="tutorial-footer">
            <div className="tutorial-progress">
              <span>ステップ {currentStep + 1} / {steps.length}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="tutorial-buttons">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="tutorial-btn tutorial-btn-secondary"
                >
                  ← 前へ
                </button>
              )}
              <button
                onClick={handleSkip}
                className="tutorial-btn tutorial-btn-skip"
              >
                スキップ
              </button>
              <button
                onClick={handleNext}
                className="tutorial-btn tutorial-btn-primary"
              >
                {currentStep < steps.length - 1 ? '次へ →' : '始める！'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .tutorial-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 560px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .tutorial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid #f0f0f0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px 12px 0 0;
        }

        .tutorial-header h3 {
          margin: 0;
          font-size: 19px;
          font-weight: bold;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .tutorial-actions {
          display: flex;
          gap: 4px;
        }

        .tutorial-minimize-btn,
        .tutorial-close-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .tutorial-minimize-btn:hover,
        .tutorial-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .tutorial-content {
          padding: 32px 24px;
          min-height: 140px;
        }

        .tutorial-content p {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: #333;
          white-space: pre-line;
        }

        .tutorial-footer {
          padding: 20px 24px;
          border-top: 2px solid #f0f0f0;
          background: #fafafa;
          border-radius: 0 0 12px 12px;
        }

        .tutorial-progress {
          margin-bottom: 16px;
        }

        .tutorial-progress span {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .progress-bar {
          margin-top: 8px;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          border-radius: 3px;
        }

        .tutorial-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .tutorial-btn {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tutorial-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .tutorial-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .tutorial-btn-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .tutorial-btn-secondary:hover {
          background: #f8f9ff;
        }

        .tutorial-btn-skip {
          background: transparent;
          color: #999;
          border: 1px solid #ddd;
        }

        .tutorial-btn-skip:hover {
          background: #f5f5f5;
          color: #666;
        }
      `}</style>

      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 9998;
          box-shadow: 0 0 0 4px #667eea, 0 0 24px rgba(102, 126, 234, 0.6);
          border-radius: 6px;
          animation: tutorial-pulse 2s infinite;
        }

        @keyframes tutorial-pulse {
          0% {
            box-shadow: 0 0 0 4px #667eea, 0 0 24px rgba(102, 126, 234, 0.6);
          }
          50% {
            box-shadow: 0 0 0 6px #667eea, 0 0 32px rgba(102, 126, 234, 0.8);
          }
          100% {
            box-shadow: 0 0 0 4px #667eea, 0 0 24px rgba(102, 126, 234, 0.6);
          }
        }
      `}</style>
    </>
  );
}