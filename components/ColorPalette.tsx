'use client';

import { useState, useEffect, useRef } from 'react';

interface ColorPaletteProps {
  position: { x: number; y: number };
  strokeColor: string;
  strokeWidth?: 1 | 2 | 3;
  strokeOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange?: (width: 1 | 2 | 3) => void;
  onStrokeOpacityChange?: (opacity: number) => void;
  onFillColorChange?: (color: string) => void;
  onFillOpacityChange?: (opacity: number) => void;
  onClose: () => void;
  showFill?: boolean;
  hideOpacity?: boolean; // 濃さ調整を非表示にするオプション
  mapBounds?: { left: number; top: number; right: number; bottom: number };
}

export default function ColorPalette({
  position,
  strokeColor,
  strokeWidth = 2,
  strokeOpacity = 1.0,
  fillColor = '',
  fillOpacity = 0.3,
  onStrokeColorChange,
  onStrokeWidthChange,
  onStrokeOpacityChange,
  onFillColorChange,
  onFillOpacityChange,
  onClose,
  showFill = false,
  hideOpacity = false,
  mapBounds,
}: ColorPaletteProps) {
  const [activeTab, setActiveTab] = useState<'stroke' | 'fill'>('stroke');
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const paletteRef = useRef<HTMLDivElement>(null);

  const colors = [
    { value: '', label: 'なし' },
    { value: '#000000', label: '黒' },
    { value: '#FF0000', label: '赤' },
    { value: '#0066FF', label: '青' },
    { value: '#00AA00', label: '緑' },
    { value: '#FF6600', label: '橙' },
    { value: '#9933FF', label: '紫' },
    { value: '#666666', label: '灰' },
    { value: '#FFCC00', label: '黄' },
  ];

  // 位置が変更されたら更新
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.color-palette')) {
        onClose();
      }
    };

    // 少し遅延させてから登録（描画完了直後のクリックを無視）
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // ドラッグ開始
  const handleMouseDown = (e: React.MouseEvent) => {
    // ボタンやインプット要素の場合はドラッグしない
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button') || target.closest('input')) {
      return;
    }

    // パレットをクリックしたときにテキスト入力フィールドのフォーカスが外れないようにする
    e.preventDefault();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  };

  // ドラッグ中
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!paletteRef.current) return;

      const paletteRect = paletteRef.current.getBoundingClientRect();
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // 地図範囲内に制限（絶対座標で制限）
      if (mapBounds) {
        // 左端
        if (newX < mapBounds.left) newX = mapBounds.left;
        // 右端
        if (newX + paletteRect.width > mapBounds.right) {
          newX = mapBounds.right - paletteRect.width;
        }
        // 上端
        if (newY < mapBounds.top) newY = mapBounds.top;
        // 下端
        if (newY + paletteRect.height > mapBounds.bottom) {
          newY = mapBounds.bottom - paletteRect.height;
        }
      }

      setCurrentPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, mapBounds]);

  return (
    <div
      ref={paletteRef}
      className="color-palette"
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {showFill && (
        <div className="palette-tabs">
          <button
            className={activeTab === 'stroke' ? 'active' : ''}
            onClick={() => setActiveTab('stroke')}
          >
            線の色
          </button>
          <button
            className={activeTab === 'fill' ? 'active' : ''}
            onClick={() => setActiveTab('fill')}
          >
            塗りつぶし
          </button>
        </div>
      )}

      <div className="palette-content">
        {activeTab === 'stroke' ? (
          <>
            <div className="color-grid">
              {colors.map((color) => (
                <button
                  key={color.value || 'none'}
                  className={`color-item ${strokeColor === color.value ? 'active' : ''} ${color.value === '' ? 'none-color' : ''}`}
                  onClick={() => {
                    onStrokeColorChange(color.value);
                  }}
                  title={color.label}
                  style={{ backgroundColor: color.value || 'white' }}
                />
              ))}
            </div>
            {onStrokeWidthChange && (
              <div className="width-control">
                <label>線幅</label>
                <div className="width-options">
                  {[1, 2, 3].map((w) => (
                    <button
                      key={w}
                      className={`width-option ${strokeWidth === w ? 'active' : ''}`}
                      onClick={() => onStrokeWidthChange(w as 1 | 2 | 3)}
                    >
                      <div className="width-preview" style={{ height: `${w * 2}px` }} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!hideOpacity && (
              <div className="opacity-control">
                <label>濃さ: {Math.round(strokeOpacity * 100)}%</label>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={strokeOpacity}
                  onChange={(e) => onStrokeOpacityChange?.(parseFloat(e.target.value))}
                />
              </div>
            )}
          </>
        ) : (
          <div className="fill-controls">
            <div className="color-grid">
              {colors.map((color) => (
                <button
                  key={color.value || 'none'}
                  className={`color-item ${fillColor === color.value ? 'active' : ''} ${color.value === '' ? 'none-color' : ''}`}
                  onClick={() => onFillColorChange?.(color.value)}
                  title={color.label}
                  style={{ backgroundColor: color.value || 'white' }}
                />
              ))}
            </div>
            <div className="opacity-control">
              <label>濃さ: {Math.round(fillOpacity * 100)}%</label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={fillOpacity}
                onChange={(e) => onFillOpacityChange?.(parseFloat(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .color-palette {
          background: white;
          border: 1px solid #222;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          padding: 8px;
          min-width: 130px;
          user-select: none;
        }

        .palette-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 8px;
          border-bottom: 1px solid #ddd;
        }

        .palette-tabs button {
          flex: 1;
          padding: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
          color: #000;
        }

        .palette-tabs button.active {
          border-bottom-color: #000;
          font-weight: 600;
          color: #000;
        }

        .palette-tabs button:hover {
          background: #f5f5f5;
          color: #000;
        }

        .palette-content {
          min-height: 60px;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 8px;
        }

        .color-item {
          width: 24px;
          height: 24px;
          border: 2px solid #ccc;
          cursor: pointer;
          transition: all 0.1s;
          position: relative;
        }

        .color-item:hover {
          border-color: #000;
        }

        .color-item.active {
          border-color: #000;
          border-width: 3px;
        }

        .color-item.none-color {
          background: white !important;
          position: relative;
          overflow: hidden;
        }

        .color-item.none-color::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -50%;
          width: 200%;
          height: 2px;
          background: #cc0000;
          transform: translateY(-50%) rotate(-45deg);
        }

        .width-control {
          padding-top: 6px;
          border-top: 1px solid #ddd;
        }

        .width-control label {
          display: block;
          font-size: 10px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .width-options {
          display: flex;
          gap: 4px;
        }

        .width-option {
          flex: 1;
          padding: 6px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
        }

        .width-option:hover {
          border-color: #000;
        }

        .width-option.active {
          background: #000;
          border-color: #000;
        }

        .width-preview {
          width: 100%;
          background: #666;
          transition: all 0.1s;
        }

        .width-option.active .width-preview {
          background: white;
        }

        .fill-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .opacity-control {
          padding-top: 6px;
          border-top: 1px solid #ddd;
        }

        .opacity-control label {
          display: block;
          font-size: 10px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .opacity-control input[type="range"] {
          width: 100%;
        }
      `}</style>
    </div>
  );
}