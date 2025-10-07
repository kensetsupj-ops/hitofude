'use client';

import { useState, useEffect, useRef } from 'react';

interface TextPaletteProps {
  position: { x: number; y: number };
  strokeColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontBold: boolean;
  fontItalic: boolean;
  fontUnderline: boolean;
  textBackground: 'transparent' | 'white';
  onStrokeColorChange: (color: string) => void;
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  onFontBoldChange: (bold: boolean) => void;
  onFontItalicChange: (italic: boolean) => void;
  onFontUnderlineChange: (underline: boolean) => void;
  onTextBackgroundChange: (background: 'transparent' | 'white') => void;
  onClose: () => void;
  mapBounds?: { left: number; top: number; right: number; bottom: number };
}

export default function TextPalette({
  position,
  strokeColor,
  fontSize,
  fontBold,
  fontItalic,
  fontUnderline,
  textBackground,
  onStrokeColorChange,
  onFontSizeChange,
  onFontBoldChange,
  onFontItalicChange,
  onFontUnderlineChange,
  onTextBackgroundChange,
  onClose,
  mapBounds,
}: TextPaletteProps) {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const paletteRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true); // 初回マウントかどうかを記録
  const justFinishedDragging = useRef(false); // ドラッグ終了直後かどうか

  const colors = [
    { value: '#000000', label: '黒' },
    { value: '#FF0000', label: '赤' },
    { value: '#0066FF', label: '青' },
    { value: '#00AA00', label: '緑' },
    { value: '#FF6600', label: '橙' },
    { value: '#9933FF', label: '紫' },
    { value: '#666666', label: '灰' },
    { value: '#FFCC00', label: '黄' },
  ];

  const sizes = [
    { value: 'small' as const, label: '小' },
    { value: 'medium' as const, label: '中' },
    { value: 'large' as const, label: '大' },
  ];

  // 位置が変更されたら更新（地図範囲内に調整）
  // 初回マウント時のみ位置を設定し、その後はユーザーのドラッグを尊重
  useEffect(() => {
    if (!isInitialMount.current) return; // 初回以降は親からの位置更新を無視

    if (!mapBounds || !paletteRef.current) {
      setCurrentPosition(position);
      isInitialMount.current = false;
      return;
    }

    const paletteRect = paletteRef.current.getBoundingClientRect();
    let adjustedX = position.x;
    let adjustedY = position.y;

    // 左端
    if (adjustedX < mapBounds.left) adjustedX = mapBounds.left;
    // 右端
    if (adjustedX + paletteRect.width > mapBounds.right) {
      adjustedX = mapBounds.right - paletteRect.width;
    }
    // 上端
    if (adjustedY < mapBounds.top) adjustedY = mapBounds.top;
    // 下端
    if (adjustedY + paletteRect.height > mapBounds.bottom) {
      adjustedY = mapBounds.bottom - paletteRect.height;
    }

    setCurrentPosition({ x: adjustedX, y: adjustedY });
    isInitialMount.current = false;
  }, [position, mapBounds]);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // テキストパレット、テキスト入力フィールド、地図のcanvas内をクリックした場合は何もしない
      if (target.closest('.text-palette') ||
          target.closest('input[type="text"]') ||
          target.tagName === 'CANVAS') {
        return;
      }

      // 上記以外（ツールバー、サイドバーなど）をクリックしたら閉じる
      onClose();
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
    // パレットをクリックしたときにテキスト入力フィールドのフォーカスが外れないようにする
    e.preventDefault();

    // ボタンやインプット要素の場合はドラッグしない
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button') || target.closest('input')) {
      return;
    }

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

      // ドラッグ終了直後フラグを立てる
      justFinishedDragging.current = true;

      // 200ms後にフラグをリセット
      setTimeout(() => {
        justFinishedDragging.current = false;
      }, 200);
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
      className="text-palette"
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="palette-content">
        {/* 文字色 */}
        <div className="palette-section">
          <label>文字色</label>
          <div className="color-grid">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`color-item ${strokeColor === color.value ? 'active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onStrokeColorChange(color.value)}
                title={color.label}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        {/* 文字サイズ */}
        <div className="palette-section">
          <label>サイズ</label>
          <div className="size-buttons">
            {sizes.map((size) => (
              <button
                key={size.value}
                className={`size-btn ${fontSize === size.value ? 'active' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onFontSizeChange(size.value)}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* スタイル */}
        <div className="palette-section">
          <label>スタイル</label>
          <div className="style-buttons">
            <button
              className={`style-btn ${fontBold ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onFontBoldChange(!fontBold)}
              title="太字"
            >
              <strong>B</strong>
            </button>
            <button
              className={`style-btn ${fontItalic ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onFontItalicChange(!fontItalic)}
              title="斜体"
            >
              <em>I</em>
            </button>
            <button
              className={`style-btn ${fontUnderline ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onFontUnderlineChange(!fontUnderline)}
              title="下線"
            >
              <u>U</u>
            </button>
          </div>
        </div>

        {/* 背景 */}
        <div className="palette-section">
          <label>背景</label>
          <div className="background-buttons">
            <button
              className={`bg-btn ${textBackground === 'transparent' ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onTextBackgroundChange('transparent')}
              title="透明"
            >
              なし
            </button>
            <button
              className={`bg-btn ${textBackground === 'white' ? 'active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onTextBackgroundChange('white')}
              title="白"
            >
              白
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-palette {
          background: white;
          border: 1px solid #222;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          padding: 8px;
          min-width: 130px;
          user-select: none;
        }

        .palette-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .palette-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .palette-section label {
          font-size: 10px;
          font-weight: 600;
          color: #333;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
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

        .size-buttons,
        .style-buttons,
        .background-buttons {
          display: flex;
          gap: 4px;
        }

        .size-btn,
        .style-btn,
        .bg-btn {
          flex: 1;
          padding: 6px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.1s;
        }

        .size-btn:hover,
        .style-btn:hover,
        .bg-btn:hover {
          border-color: #000;
          background: #f5f5f5;
        }

        .size-btn.active,
        .style-btn.active,
        .bg-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .style-btn {
          min-width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}