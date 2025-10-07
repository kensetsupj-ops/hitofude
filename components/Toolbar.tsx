'use client';

import { Tool, PageView } from '@/lib/types';
import { useEffect, useState } from 'react';

interface ToolbarProps {
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
  onExportJSON: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fontSize?: 'small' | 'medium' | 'large';
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  fontBold?: boolean;
  onFontBoldChange?: (bold: boolean) => void;
  fontItalic?: boolean;
  onFontItalicChange?: (italic: boolean) => void;
  fontUnderline?: boolean;
  onFontUnderlineChange?: (underline: boolean) => void;
  textBackground?: 'transparent' | 'white';
  onTextBackgroundChange?: (background: 'transparent' | 'white') => void;
  fillColor?: string;
  onFillColorChange?: (color: string) => void;
  fillOpacity?: number;
  onFillOpacityChange?: (opacity: number) => void;
}

export default function Toolbar({
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
  onExportJSON,
  onImportJSON,
  fontSize = 'medium',
  onFontSizeChange,
  fontBold = false,
  onFontBoldChange,
  fontItalic = false,
  onFontItalicChange,
  fontUnderline = false,
  onFontUnderlineChange,
  textBackground = 'transparent',
  onTextBackgroundChange,
  fillColor = '',
  onFillColorChange,
  fillOpacity = 0.3,
  onFillOpacityChange,
}: ToolbarProps) {
  const [expandedTool, setExpandedTool] = useState<'arrow' | 'rect' | null>(null);
  const [showP2Message, setShowP2Message] = useState(false);
  const [isP2MessageFading, setIsP2MessageFading] = useState(false);
  const [isSecondRowOpen, setIsSecondRowOpen] = useState(false);

  // メッセージ表示後、自動的にフェードアウトして消す
  useEffect(() => {
    if (showP2Message) {
      // 3秒後にフェードアウト開始
      const fadeTimer = setTimeout(() => {
        setIsP2MessageFading(true);
      }, 3000);

      // 3.5秒後に完全に非表示
      const hideTimer = setTimeout(() => {
        setShowP2Message(false);
        setIsP2MessageFading(false);
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showP2Message]);

  // ショートカットキーの実装
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // テキスト入力中は無効
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + Z: 元に戻す
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) onUndo();
        return;
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: やり直し
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (canRedo) onRedo();
        return;
      }

      // ツールのショートカット
      const key = e.key.toLowerCase();
      switch (key) {
        case 'v':
          e.preventDefault();
          onToolChange('select');
          break;
        case 'e':
          e.preventDefault();
          onToolChange('edit');
          break;
        case 'a':
          e.preventDefault();
          onToolChange('arrow');
          break;
        case 'l':
          e.preventDefault();
          onToolChange('line');
          break;
        case 'c':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            onToolChange('circle');
          }
          break;
        case 'r':
          e.preventDefault();
          onToolChange('rect');
          break;
        case 't':
          e.preventDefault();
          onToolChange('text');
          break;
        case 'f':
          e.preventDefault();
          onToolChange('freehand');
          break;
        case 'd':
          e.preventDefault();
          onToolChange('delete');
          break;
        case 'm':
          e.preventDefault();
          onToolChange('marker');
          break;
        case '1':
          e.preventDefault();
          onPageChange('p1');
          break;
        case '2':
          e.preventDefault();
          setShowP2Message(true);
          break;
        case 'p':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onPrint();
          }
          break;
        case 'delete':
        case 'backspace':
          if (currentTool === 'select') {
            e.preventDefault();
            // 選択中の図形を削除する機能を後で実装
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToolChange, onUndo, onRedo, canUndo, canRedo, onPrint, onPageChange, currentTool]);

  const tools: {
    id: Tool;
    label: string;
    icon: React.ReactNode;
    shortcut?: string;
    submenu?: { id: Tool; label: string; icon: React.ReactNode }[];
  }[] = [
    {
      id: 'select',
      label: '地図移動',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
        </svg>
      ),
      shortcut: 'V'
    },
    {
      id: 'edit',
      label: '編集',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
        </svg>
      ),
      shortcut: 'E'
    },
    {
      id: 'arrow',
      label: '矢印',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      ),
      shortcut: 'A',
      submenu: [
        {
          id: 'arrow',
          label: '直線矢印',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          ),
        },
        {
          id: 'polyarrow',
          label: '折れ線矢印',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 17L10 12L15 15L19 7M19 7l-4 0M19 7l0 4"/>
            </svg>
          ),
        },
      ]
    },
    {
      id: 'line',
      label: '直線',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 19L19 5"/>
        </svg>
      ),
      shortcut: 'L'
    },
    {
      id: 'circle',
      label: '円',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8"/>
        </svg>
      ),
      shortcut: 'C'
    },
    {
      id: 'rect',
      label: '四角',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="5" width="14" height="14"/>
        </svg>
      ),
      shortcut: 'R',
      submenu: [
        {
          id: 'rect',
          label: '四角',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="5" width="14" height="14"/>
            </svg>
          ),
        },
        {
          id: 'polygon',
          label: '多角形',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L22 8.5L18 19.5L6 19.5L2 8.5L12 2Z"/>
            </svg>
          ),
        },
      ]
    },
    {
      id: 'text',
      label: 'テキスト',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
        </svg>
      ),
      shortcut: 'T'
    },
    {
      id: 'freehand',
      label: 'フリー',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 17s3-6 9-4 9 4 9 4"/>
        </svg>
      ),
      shortcut: 'F'
    },
    {
      id: 'delete',
      label: '削除',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      ),
      shortcut: 'D'
    },
    {
      id: 'marker',
      label: 'マーカー',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      shortcut: 'M'
    },
  ];

  const colors: { value: string; label: string }[] = [
    { value: '#000000', label: '黒' },
    { value: '#FF0000', label: '赤' },
    { value: '#0066FF', label: '青' },
    { value: '#00AA00', label: '緑' },
    { value: '#FF6600', label: '橙' },
    { value: '#9933FF', label: '紫' },
    { value: '#666666', label: '灰' },
    { value: '#FFCC00', label: '黄' },
  ];

  const widths: { value: 1 | 2 | 3; label: string }[] = [
    { value: 1, label: '細' },
    { value: 2, label: '中' },
    { value: 3, label: '太' },
  ];

  return (
    <div className="toolbar no-print">
      <div className="toolbar-row toolbar-row-1">
        <div className="toolbar-section">
          <div className="page-tabs">
            <button
              className={currentPage === 'p1' ? 'active' : ''}
              onClick={() => onPageChange('p1')}
              title="詳細図 (1)"
            >
              詳細図
            </button>
            <button
              className="disabled-p2"
              onClick={(e) => {
                e.preventDefault();
                setShowP2Message(true);
                setIsP2MessageFading(false);
              }}
              title="周辺図 (2) - 現在未実装"
            >
              周辺図
            </button>
          </div>
          {showP2Message && (
            <div className={`p2-message ${isP2MessageFading ? 'fading' : ''}`}>
              周辺図機能は現在未実装です。将来のバージョンで対応予定です。
            </div>
          )}
        </div>

        <div className="toolbar-section toolbar-toggle-section">
          <button
            className="toggle-settings-button"
            onClick={() => setIsSecondRowOpen(!isSecondRowOpen)}
            title={isSecondRowOpen ? "詳細設定を閉じる" : "詳細設定を開く"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
            </svg>
            <span className="toggle-label">詳細設定</span>
            <span className="toggle-icon">{isSecondRowOpen ? '▲' : '▼'}</span>
          </button>
        </div>

        <div className="toolbar-section tools-main">
          <div className="tool-group">
            {tools.map((tool) => (
              <div key={tool.id} className="tool-wrapper">
                <button
                  className={`tool-button ${currentTool === tool.id || (tool.submenu && tool.submenu.some(sub => sub.id === currentTool)) ? 'active' : ''}`}
                  onClick={() => {
                    if (tool.submenu) {
                      setExpandedTool(expandedTool === tool.id ? null : tool.id as 'arrow' | 'rect');
                    } else {
                      onToolChange(tool.id);
                      setExpandedTool(null);
                    }
                  }}
                  title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
                >
                  <span className="tool-icon">
                    {(() => {
                      // サブメニューがある場合、選択されているサブツールのアイコンを表示
                      if (tool.submenu) {
                        const selectedSubTool = tool.submenu.find(sub => sub.id === currentTool);
                        if (selectedSubTool) {
                          return selectedSubTool.icon;
                        }
                      }
                      return tool.icon;
                    })()}
                  </span>
                  <span className="tool-label">{tool.label}</span>
                  {tool.shortcut && (
                    <span className="tool-shortcut">{tool.shortcut}</span>
                  )}
                  {tool.submenu && (
                    <span className="submenu-indicator">▼</span>
                  )}
                </button>
                {tool.submenu && expandedTool === tool.id && (
                  <div className="submenu">
                    {tool.submenu.map((subTool) => (
                      <button
                        key={subTool.id}
                        className={`submenu-item ${currentTool === subTool.id ? 'active' : ''}`}
                        onClick={() => {
                          onToolChange(subTool.id);
                          setExpandedTool(null);
                        }}
                        title={subTool.label}
                      >
                        <span className="tool-icon">{subTool.icon}</span>
                        <span className="submenu-label">{subTool.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="toolbar-divider" />

          <div className="tool-group">
            <button onClick={onUndo} disabled={!canUndo} title="元に戻す (Ctrl+Z)">
              戻る
            </button>
            <button onClick={onRedo} disabled={!canRedo} title="やり直し (Ctrl+Y)">
              進む
            </button>
            <button onClick={onClearAll} title="すべて削除">
              全消去
            </button>
          </div>
        </div>

        <div className="toolbar-section actions-section">
          <div className="tool-group">
            <button
              onClick={onPrint}
              title="印刷プレビュー (A4横向き)"
              className="print-button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>
              </svg>
              <span>印刷</span>
            </button>
          </div>
        </div>
      </div>

      {isSecondRowOpen && (
      <div className="toolbar-row toolbar-row-2">
        <div className="toolbar-section style-controls">
        <div className="tool-group color-group">
          <label>色:</label>
          {colors.map((color) => (
            <button
              key={color.value}
              className={`color-button ${strokeColor === color.value ? 'active' : ''}`}
              onClick={() => onStrokeColorChange(color.value)}
              title={color.label}
            >
              <span
                className="color-swatch"
                style={{ backgroundColor: color.value }}
              />
            </button>
          ))}
        </div>

        <div className="tool-group width-group">
          <label>線幅:</label>
          {widths.map((w) => (
            <button
              key={w.value}
              className={`width-button ${strokeWidth === w.value ? 'active' : ''}`}
              onClick={() => onStrokeWidthChange(w.value)}
              title={`線幅: ${w.label}`}
            >
              <span
                className="width-line"
                style={{ height: `${w.value * 2}px` }}
              />
            </button>
          ))}
        </div>


        {onFontSizeChange && (
          <>
            <div className="toolbar-divider" />
            <div className="tool-group font-size-group">
              <label>文字:</label>
              <button
                className={`size-button ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => onFontSizeChange('small')}
                title="小さい文字"
              >
                小
              </button>
              <button
                className={`size-button ${fontSize === 'medium' ? 'active' : ''}`}
                onClick={() => onFontSizeChange('medium')}
                title="標準文字"
              >
                中
              </button>
              <button
                className={`size-button ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => onFontSizeChange('large')}
                title="大きい文字"
              >
                大
              </button>
            </div>
            <div className="tool-group font-style-group">
              <button
                className={`style-button ${fontBold ? 'active' : ''}`}
                onClick={() => onFontBoldChange && onFontBoldChange(!fontBold)}
                title="太字"
              >
                <strong>B</strong>
              </button>
              <button
                className={`style-button ${fontItalic ? 'active' : ''}`}
                onClick={() => onFontItalicChange && onFontItalicChange(!fontItalic)}
                title="斜体"
              >
                <em>I</em>
              </button>
              <button
                className={`style-button ${fontUnderline ? 'active' : ''}`}
                onClick={() => onFontUnderlineChange && onFontUnderlineChange(!fontUnderline)}
                title="下線"
              >
                <u>U</u>
              </button>
            </div>
            <div className="tool-group bg-group">
              <label>背景:</label>
              <button
                className={`style-button ${textBackground === 'transparent' ? 'active' : ''}`}
                onClick={() => onTextBackgroundChange && onTextBackgroundChange('transparent')}
                title="背景透明"
              >
                透
              </button>
              <button
                className={`style-button ${textBackground === 'white' ? 'active' : ''}`}
                onClick={() => onTextBackgroundChange && onTextBackgroundChange('white')}
                title="背景白"
              >
                白
              </button>
            </div>
          </>
        )}
        </div>
      </div>
      )}

      <style jsx>{`
        .toolbar {
          position: sticky;
          top: 52px;
          z-index: 99;
          display: flex;
          flex-direction: column;
          background: linear-gradient(to bottom, #ffffff, #f8f9fa);
          border-bottom: 1px solid #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .toolbar-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 16px;
        }

        .toolbar-row-1 {
          border-bottom: 1px solid #e9ecef;
        }

        .toolbar-section {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 8px;
          border-right: 1px solid #dee2e6;
          position: relative;
        }

        .toolbar-section:last-child {
          border-right: none;
        }

        .tools-main {
          flex: 1;
        }

        .actions-section {
          margin-left: auto;
          border-right: none !important;
        }

        .toolbar-toggle-section {
          padding: 0 12px;
        }

        .toggle-settings-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s;
        }

        .toggle-settings-button:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .toggle-settings-button svg {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .toggle-label {
          white-space: nowrap;
        }

        .toggle-icon {
          font-size: 11px;
          opacity: 0.6;
          margin-left: 2px;
        }

        .style-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: nowrap;
          flex: 1;
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: #dee2e6;
          margin: 0 4px;
        }

        .page-tabs {
          display: flex;
          gap: 0;
        }

        .page-tabs button {
          border-radius: 0;
          border-right: none;
          padding: 6px 16px;
          background: #fff;
          border: 1px solid #dee2e6;
          font-size: 13px;
        }

        .page-tabs button:first-child {
          border-radius: 6px 0 0 6px;
        }

        .page-tabs button:last-child {
          border-radius: 0 6px 6px 0;
          border-right: 1px solid #dee2e6;
        }

        .page-tabs button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .page-tabs button.disabled-p2 {
          opacity: 0.6;
          cursor: help;
        }

        .page-tabs button.disabled-p2:hover {
          background: #f0f0f0 !important;
        }

        .p2-message {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          padding: 8px 12px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          font-size: 12px;
          color: #856404;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          opacity: 1;
          transition: opacity 0.5s ease-out;
        }

        .p2-message.fading {
          opacity: 0;
        }

        .tool-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tool-group label {
          margin-right: 4px;
          font-size: 13px;
          color: #495057;
          font-weight: 500;
        }

        button {
          min-width: 40px;
          height: 32px;
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          color: #495057;
        }

        button:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #adb5bd;
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
          box-shadow: 0 2px 4px rgba(0,123,255,0.2);
        }

        button.active:hover:not(:disabled) {
          background: #0056b3;
          color: white;
          border-color: #0056b3;
        }

        /* ツールボタン */
        .tool-wrapper {
          position: relative;
        }

        .tool-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          min-width: 56px;
          height: 48px;
          position: relative;
        }

        .tool-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .tool-label {
          font-size: 10px;
          margin-top: 2px;
        }

        .tool-shortcut {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 9px;
          background: rgba(0,0,0,0.1);
          padding: 1px 3px;
          border-radius: 3px;
          line-height: 1;
        }

        .tool-button.active .tool-shortcut {
          background: rgba(255,255,255,0.2);
        }

        .submenu-indicator {
          position: absolute;
          bottom: 2px;
          right: 4px;
          font-size: 8px;
          color: #666;
        }

        .tool-button.active .submenu-indicator {
          color: white;
        }

        .submenu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          margin-top: 4px;
          min-width: 120px;
        }

        .submenu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 0;
          background: white;
          text-align: left;
          min-width: auto;
          height: auto;
        }

        .submenu-item:first-child {
          border-radius: 6px 6px 0 0;
        }

        .submenu-item:last-child {
          border-radius: 0 0 6px 6px;
        }

        .submenu-item:hover {
          background: #f8f9fa;
        }

        .submenu-item.active {
          background: #007bff;
          color: white;
        }

        .submenu-label {
          font-size: 13px;
          white-space: nowrap;
        }

        /* 塗りつぶし設定 */
        .fill-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .opacity-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .opacity-slider {
          width: 80px;
          height: 4px;
          background: #dee2e6;
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
        }

        .opacity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #007bff;
          border-radius: 50%;
          cursor: pointer;
        }

        .opacity-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #007bff;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .opacity-value {
          font-size: 12px;
          color: #495057;
          min-width: 35px;
          text-align: right;
        }

        /* カラーボタン */
        .color-button {
          width: 32px;
          height: 32px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-swatch {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid transparent;
        }

        .color-button.active .color-swatch {
          border-color: #007bff;
          box-shadow: 0 0 0 2px white, 0 0 0 3px #007bff;
        }

        /* 線幅ボタン */
        .width-button {
          width: 40px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .width-button.active {
          background: white !important;
          border-color: #007bff;
        }

        .width-button:hover:not(:disabled) {
          background: #f8f9fa !important;
        }

        .width-line {
          width: 24px;
          background: #495057;
          border-radius: 1px;
        }

        .width-button.active .width-line {
          background: #007bff;
        }

        .width-button:hover:not(:disabled) .width-line {
          background: #000;
        }

        .width-button.active:hover:not(:disabled) .width-line {
          background: #000;
        }

        /* サイズボタン */
        .size-button {
          min-width: 32px;
          height: 32px;
          padding: 4px 8px;
          font-weight: 500;
        }

        /* スタイルボタン */
        .style-button {
          min-width: 32px;
          height: 32px;
          padding: 4px 8px;
          font-size: 14px;
        }

        /* 印刷ボタン */
        .print-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #28a745;
          color: white;
          border-color: #28a745;
          padding: 6px 16px;
          min-width: auto;
        }

        .print-button:hover:not(:disabled) {
          background: #218838;
          border-color: #1e7e34;
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(40, 167, 69, 0.3);
        }

        .print-button svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .toolbar {
            padding: 8px;
            gap: 8px;
          }

          .toolbar-section {
            padding: 0 4px;
          }

          .tool-button {
            min-width: 48px;
            height: 42px;
          }

          .tool-label {
            display: none;
          }

          .tool-icon {
            width: 20px;
            height: 20px;
          }

          button {
            min-width: 36px;
            height: 28px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}