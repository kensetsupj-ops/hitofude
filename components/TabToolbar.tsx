'use client';

import { useState } from 'react';
import { Tool, PageView } from '@/lib/types';

interface TabToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  strokeColor: string;
  onStrokeColorChange: (color: string) => void;
  strokeWidth: 1 | 2 | 3;
  onStrokeWidthChange: (width: 1 | 2 | 3) => void;
  currentPage: PageView;
  onPageChange: (page: PageView) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClearAll: () => void;
  onPrint: () => void;
  onCopyURL: () => void;
  onExportJSON: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type TabType = 'draw' | 'style' | 'page' | 'actions';

export default function TabToolbar({
  currentTool,
  onToolChange,
  strokeColor,
  onStrokeColorChange,
  strokeWidth,
  onStrokeWidthChange,
  currentPage,
  onPageChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearAll,
  onPrint,
  onCopyURL,
  onExportJSON,
  onImportJSON,
}: TabToolbarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('draw');
  const [showP2Message, setShowP2Message] = useState(false);

  const tools: { value: Tool; label: string; icon: string; key: string }[] = [
    { value: 'select', label: '選択', icon: '↖', key: 'V' },
    { value: 'arrow', label: '矢印', icon: '→', key: 'A' },
    { value: 'line', label: '直線', icon: '／', key: 'L' },
    { value: 'circle', label: '円', icon: '○', key: 'C' },
    { value: 'rect', label: '四角', icon: '□', key: 'R' },
    { value: 'text', label: 'テキスト', icon: 'T', key: 'T' },
    { value: 'freehand', label: 'フリー', icon: '✐', key: 'F' },
    { value: 'delete', label: '削除', icon: '🗑', key: 'D' },
  ];

  const colors = [
    { value: '#000000', label: '黒' },
    { value: '#FF0000', label: '赤' },
    { value: '#0066FF', label: '青' },
    { value: '#00AA00', label: '緑' },
  ];

  const widths: { value: 1 | 2 | 3; label: string }[] = [
    { value: 1, label: '細' },
    { value: 2, label: '中' },
    { value: 3, label: '太' },
  ];

  return (
    <div className="tab-toolbar no-print">
      {/* タブヘッダー */}
      <div className="tab-headers">
        <button
          className={`tab-header ${activeTab === 'draw' ? 'active' : ''}`}
          onClick={() => setActiveTab('draw')}
        >
          描画ツール
        </button>
        <button
          className={`tab-header ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          スタイル
        </button>
        <button
          className={`tab-header ${activeTab === 'page' ? 'active' : ''}`}
          onClick={() => setActiveTab('page')}
        >
          ページ
        </button>
        <button
          className={`tab-header ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          操作
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="tab-content">
        {activeTab === 'draw' && (
          <div className="tool-grid">
            {tools.map((tool) => (
              <button
                key={tool.value}
                className={`tool-button ${currentTool === tool.value ? 'active' : ''}`}
                onClick={() => onToolChange(tool.value)}
                title={`${tool.label} (${tool.key})`}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-label">{tool.label}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="style-controls">
            <div className="control-group">
              <label>色:</label>
              <div className="button-group">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    className={strokeColor === color.value ? 'active' : ''}
                    onClick={() => onStrokeColorChange(color.value)}
                    style={{
                      backgroundColor: color.value,
                      color: color.value === '#000000' ? 'white' : 'white',
                    }}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label>線幅:</label>
              <div className="button-group">
                {widths.map((width) => (
                  <button
                    key={width.value}
                    className={strokeWidth === width.value ? 'active' : ''}
                    onClick={() => onStrokeWidthChange(width.value)}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '20px',
                        height: `${width.value * 2}px`,
                        backgroundColor: '#333',
                      }}
                    />
                    <span style={{ marginLeft: '4px' }}>{width.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'page' && (
          <div className="page-controls-wrapper">
            <div className="button-group">
              <button
                className={currentPage === 'p1' ? 'active' : ''}
                onClick={() => onPageChange('p1')}
                title="詳細図 (1)"
              >
                詳細図 (P1)
              </button>
              <button
                className="disabled-p2"
                onClick={(e) => {
                  e.preventDefault();
                  setShowP2Message(!showP2Message);
                }}
                title="周辺図 (2) - 現在未実装"
              >
                周辺図 (P2)
              </button>
            </div>
            {showP2Message && (
              <div className="p2-message">
                周辺図機能は現在未実装です。将来のバージョンで対応予定です。
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="action-controls">
            <div className="button-group">
              <button onClick={onUndo} disabled={!canUndo} title="元に戻す (Ctrl+Z)">
                ↶ 元に戻す
              </button>
              <button onClick={onRedo} disabled={!canRedo} title="やり直し (Ctrl+Y)">
                ↷ やり直し
              </button>
              <button onClick={onClearAll} title="全消去">
                🗑 全消去
              </button>
            </div>

            <div className="separator" />

            <div className="button-group">
              <button onClick={onPrint} title="印刷 (Ctrl+P)" className="primary">
                🖨 印刷
              </button>
              <button onClick={onCopyURL} title="URL共有">
                📋 URL
              </button>
              <button onClick={onExportJSON} title="保存">
                💾 保存
              </button>
              <label className="file-button">
                📂 開く
                <input
                  type="file"
                  accept="application/json"
                  onChange={onImportJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-toolbar {
          background: #f9f9f9;
          border-bottom: 1px solid #ddd;
          display: flex;
          flex-direction: column;
        }

        .tab-headers {
          display: flex;
          background: #e0e0e0;
          border-bottom: 1px solid #ccc;
        }

        .tab-header {
          flex: 1;
          padding: 8px;
          background: transparent;
          border: none;
          border-right: 1px solid #ccc;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }

        .tab-header:last-child {
          border-right: none;
        }

        .tab-header:hover {
          background: #d0d0d0;
        }

        .tab-header.active {
          background: #f9f9f9;
          font-weight: bold;
          border-bottom: 2px solid #333;
        }

        .tab-content {
          padding: 8px;
          min-height: 60px;
        }

        .tool-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
        }

        .tool-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool-button:hover {
          background: #f0f0f0;
        }

        .tool-button.active {
          background: #333;
          color: white;
          border-color: #333;
        }

        .tool-icon {
          font-size: 18px;
          margin-bottom: 2px;
        }

        .tool-label {
          font-size: 10px;
        }

        .style-controls,
        .action-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .page-controls-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-group label {
          font-size: 12px;
          color: #666;
        }

        .button-group {
          display: flex;
          gap: 4px;
        }

        .button-group button,
        .file-button {
          padding: 4px 12px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .button-group button:hover,
        .file-button:hover {
          background: #f0f0f0;
        }

        .button-group button.active {
          background: #333;
          color: white;
          border-color: #333;
        }

        .button-group button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-group button.primary {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .button-group button.primary:hover {
          background: #45a049;
        }

        .file-button {
          display: inline-block;
          position: relative;
        }

        .separator {
          width: 1px;
          height: 30px;
          background: #ccc;
        }

        .disabled-p2 {
          opacity: 0.6;
          cursor: help;
        }

        .disabled-p2:hover {
          background: #f0f0f0 !important;
        }

        .p2-message {
          margin-top: 8px;
          padding: 8px 12px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          font-size: 12px;
          color: #856404;
        }

        @media (max-width: 768px) {
          .tool-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .style-controls,
          .action-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .control-group {
            flex-direction: column;
            align-items: stretch;
          }

          .button-group {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}