'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Guide, Tool, PageView, Shape } from '@/lib/types';
import Toolbar from '@/components/Toolbar';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PrintLayout from '@/components/PrintLayout';
import TextContentSection from '@/components/TextContentSection';
import FeedbackOverlay from '@/components/FeedbackOverlay';

// Dynamic import for MapView to avoid SSR issues with Google Maps
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="loading">地図を読み込んでいます...</div>
});

export default function DeliveryGuidePage() {
  // JSON-LD構造化データ for HowTo
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: '搬入経路図の作成方法',
    description: 'Googleマップ上に経路を描いて、A4横向きPDFとして印刷・保存する手順',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: '住所を入力して地図を表示',
        text: '右側の「現場情報」パネルで住所を入力し、エンターキーを押します。Googleマップが自動で該当地点へ移動します。',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: '経路や重要箇所を描画',
        text: 'ツールバーの「矢印」「円」「テキスト」などで、搬入経路・目印・注意点を地図上に描きます。「詳細設定」を開けば、色・太さ・塗りつぶしなども変更可能です。',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: '印刷・URL共有',
        text: '「印刷」ボタンでA4横向きの高品質PDFを生成・保存できます。「URL」ボタンで共有リンクをコピーし、関係者へメールやチャットで送信可能。URLには案内図の全データが含まれます。',
      },
    ],
  };

  // JSON-LD構造化データ for FAQPage
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ログインは必要ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'いいえ、ログイン不要で全機能を無料で利用できます。',
        },
      },
      {
        '@type': 'Question',
        name: '地図が表示されません',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ブラウザのJavaScriptが有効か確認してください。また、一時的な通信エラーの可能性があるため、ページを再読み込みしてみてください。',
        },
      },
      {
        '@type': 'Question',
        name: '作成した案内図を保存できますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ツールバーの「URL」ボタンで共有URLをコピーし、ブックマークやメモに保存してください。URLには案内図の全データが含まれているため、後から同じURLを開くだけで作成した案内図を再現できます。',
        },
      },
      {
        '@type': 'Question',
        name: 'スマホでも使えますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい、スマートフォン・タブレットでも利用可能です。タッチ操作にも対応しています。',
        },
      },
      {
        '@type': 'Question',
        name: '商用利用は可能ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい、利用規約の範囲内で商用利用も可能です。ただし、地図データはGoogleマップの利用規約に従います。',
        },
      },
    ],
  };

  const [guide, setGuide] = useState<Guide>({
    meta: {
      title: '',
      date: '',
      time: '',
      address: '',
      site: '',
      supervisor: '',
      phone: '',
      gather: '',
      arrive: '',
      unload: '',
      leave: '',
      vehicle: '',
      units: 0,
      gross_t: 0,
      load: '',
      h_limit_mm: 0,
      w_limit_m: 0,
      notes: '',
    },
    map: {
      center: { lat: 35.681236, lng: 139.767125 }, // 東京駅付近（初期位置）
      zoom: 13,
      type: 'roadmap',
    },
    shapes: [],
  });

  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<1 | 2 | 3>(2);
  const [currentPage, setCurrentPage] = useState<PageView>('p1');
  const [undoStack, setUndoStack] = useState<Shape[][]>([]);
  const [redoStack, setRedoStack] = useState<Shape[][]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [mapContainerSize, setMapContainerSize] = useState({ width: 640, height: 400 });
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [printMapCenter, setPrintMapCenter] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [capturedShapesImage, setCapturedShapesImage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontBold, setFontBold] = useState(false);
  const [fontItalic, setFontItalic] = useState(false);
  const [fontUnderline, setFontUnderline] = useState(false);
  const [textBackground, setTextBackground] = useState<'transparent' | 'white'>('transparent');
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [searchAddressTrigger, setSearchAddressTrigger] = useState(0); // 検索トリガー
  const getMapCenterRef = useRef<(() => { lat: number; lng: number; zoom: number } | null) | null>(null);
  const previousSelectedIdRef = useRef<string | null>(null); // 印刷前の選択状態を保持
  const [fillColor, setFillColor] = useState<string>('');
  const [fillOpacity, setFillOpacity] = useState<number>(0.3);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // スクロール位置を監視してトップに戻るボタンの表示を制御
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 500;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const shouldShow = scrollY > threshold;
      setShowScrollToTop(shouldShow);
    };

    // 初回チェック
    handleScroll();

    // windowのスクロールを監視
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 選択された図形のプロパティをツールバーに反映
  useEffect(() => {
    if (selectedShapeId) {
      const selectedShape = guide.shapes.find(s => s.id === selectedShapeId);
      if (selectedShape) {
        // 色と線幅は全図形共通
        setStrokeColor(selectedShape.stroke);
        setStrokeWidth(selectedShape.width);

        // 塗りつぶし設定（circle, rect, polygon）
        if (selectedShape.type === 'circle' || selectedShape.type === 'rect' || selectedShape.type === 'polygon') {
          setFillColor(selectedShape.fill || '');
          setFillOpacity(selectedShape.fillOpacity || 0.3);
        }

        // テキスト固有のプロパティ
        if (selectedShape.type === 'text') {
          const width = selectedShape.width;
          if (width === 1) setFontSize('small');
          else if (width === 2) setFontSize('medium');
          else if (width === 3) setFontSize('large');

          setFontBold(selectedShape.bold || false);
          setFontItalic(selectedShape.italic || false);
          setFontUnderline(selectedShape.underline || false);
          setTextBackground(selectedShape.background || 'transparent');
        }
      }
    }
  }, [selectedShapeId, guide.shapes]);

  // 印刷終了時に選択を復元
  useEffect(() => {
    if (!isPrinting && previousSelectedIdRef.current) {
      const idToRestore = previousSelectedIdRef.current;
      previousSelectedIdRef.current = null;
      // 少し遅延させて、印刷モードの終了処理が完全に終わってから復元
      setTimeout(() => {
        setSelectedShapeId(idToRestore);
      }, 100);
    }
  }, [isPrinting]);

  // ツールバーの値が変更されたら、選択された図形を更新
  useEffect(() => {
    if (selectedShapeId) {
      const selectedShape = guide.shapes.find(s => s.id === selectedShapeId);
      if (selectedShape) {
        const updatedShapes = guide.shapes.map(shape => {
          if (shape.id === selectedShapeId) {
            // 全図形共通: 色と線幅
            const baseUpdate = {
              ...shape,
              stroke: strokeColor as '#000' | '#666' | '#c00',
              width: strokeWidth,
            };

            // 塗りつぶし設定（circle, rect, polygon）
            if (shape.type === 'circle' || shape.type === 'rect' || shape.type === 'polygon') {
              return {
                ...baseUpdate,
                fill: fillColor || undefined,
                fillOpacity: fillColor ? fillOpacity : undefined,
              };
            }

            // テキスト固有のプロパティ
            if (shape.type === 'text') {
              let width: 1 | 2 | 3 = 2;
              if (fontSize === 'small') width = 1;
              else if (fontSize === 'large') width = 3;

              return {
                ...baseUpdate,
                width: width,
                bold: fontBold,
                italic: fontItalic,
                underline: fontUnderline,
                background: textBackground,
              };
            }

            return baseUpdate;
          }
          return shape;
        });

        setGuide({ ...guide, shapes: updatedShapes });
      }
    }
  }, [fontSize, strokeColor, strokeWidth, fontBold, fontItalic, fontUnderline, textBackground, fillColor, fillOpacity]);

  // Load from URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // チュートリアルは表示しない（削除）
    const newGuide = { ...guide };

    // Parse meta data from URL
    if (params.get('title')) newGuide.meta.title = params.get('title')!;
    if (params.get('address')) newGuide.meta.address = params.get('address')!;
    if (params.get('date')) newGuide.meta.date = params.get('date')!;
    if (params.get('time')) newGuide.meta.time = params.get('time')!;
    if (params.get('site')) newGuide.meta.site = params.get('site')!;
    if (params.get('supervisor')) newGuide.meta.supervisor = params.get('supervisor')!;
    if (params.get('phone')) newGuide.meta.phone = params.get('phone')!;
    if (params.get('gather')) newGuide.meta.gather = params.get('gather')!;
    if (params.get('arrive')) newGuide.meta.arrive = params.get('arrive')!;
    if (params.get('unload')) newGuide.meta.unload = params.get('unload')!;
    if (params.get('leave')) newGuide.meta.leave = params.get('leave')!;
    if (params.get('vehicle')) newGuide.meta.vehicle = params.get('vehicle')!;
    if (params.get('units')) newGuide.meta.units = parseInt(params.get('units')!);
    if (params.get('gross_t')) newGuide.meta.gross_t = parseFloat(params.get('gross_t')!);
    if (params.get('load')) newGuide.meta.load = params.get('load')!;
    if (params.get('h_limit_mm')) newGuide.meta.h_limit_mm = parseInt(params.get('h_limit_mm')!);
    if (params.get('w_limit_m')) newGuide.meta.w_limit_m = parseFloat(params.get('w_limit_m')!);
    if (params.get('notes')) newGuide.meta.notes = params.get('notes')!;

    // Parse map data
    if (params.get('map_center')) {
      const [lat, lng] = params.get('map_center')!.split(',').map(Number);
      newGuide.map.center = { lat, lng };
    }
    if (params.get('map_zoom')) {
      newGuide.map.zoom = parseInt(params.get('map_zoom')!);
    }

    setGuide(newGuide);
  }, []);

  const handleShapesChange = (newShapes: Shape[]) => {
    setUndoStack([...undoStack, guide.shapes]);
    setRedoStack([]);
    setGuide({ ...guide, shapes: newShapes });
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousShapes = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, guide.shapes]);
      setUndoStack(undoStack.slice(0, -1));
      setGuide({ ...guide, shapes: previousShapes });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextShapes = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, guide.shapes]);
      setRedoStack(redoStack.slice(0, -1));
      setGuide({ ...guide, shapes: nextShapes });
    }
  };

  const handleClearAll = () => {
    handleShapesChange([]);
  };


  const handleMapBoundsChange = (bounds: { north: number; south: number; east: number; west: number }) => {
    setMapBounds(bounds);
  };

  const handlePrint = async () => {
    // 選択を一時的に解除（印刷に選択枠が写らないように）
    previousSelectedIdRef.current = selectedShapeId;
    if (selectedShapeId) {
      setSelectedShapeId(null);
      // 選択解除の描画が反映されるまで待機（十分な時間を確保）
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // **最初に**Canvasを高解像度で画像としてキャプチャ
    const canvas = document.querySelector('.map-container canvas') as HTMLCanvasElement;
    let capturedSize = { width: 640, height: 400 };
    let shapesImageDataUrl: string | null = null;

    if (canvas) {
      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      // 印刷用に超高解像度（4倍 = 編集画面の2倍 × 追加の4倍 = 合計8倍 = 約600dpi相当）でキャプチャ
      const SCALE_FACTOR = 4;

      try {
        // 一時的な高解像度Canvasを作成
        const highResCanvas = document.createElement('canvas');
        highResCanvas.width = originalWidth * SCALE_FACTOR;
        highResCanvas.height = originalHeight * SCALE_FACTOR;
        const highResCtx = highResCanvas.getContext('2d');

        if (highResCtx) {
          // 高解像度Canvasにスケーリングして描画
          highResCtx.scale(SCALE_FACTOR, SCALE_FACTOR);
          highResCtx.drawImage(canvas, 0, 0);

          // 高解像度画像を取得
          shapesImageDataUrl = highResCanvas.toDataURL('image/png');
        }
      } catch (error) {
        // フォールバック：通常解像度でキャプチャ
        try {
          shapesImageDataUrl = canvas.toDataURL('image/png');
        } catch (e) {
          // Failed to capture canvas
        }
      }

      // 元のCanvasサイズを記録
      if (originalWidth > 0 && originalHeight > 0) {
        capturedSize = { width: originalWidth, height: originalHeight };
      } else if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
        capturedSize = { width: canvas.clientWidth, height: canvas.clientHeight };
      }
    } else {
      // フォールバック：地図コンテナのサイズを取得
      const mapContainer = document.querySelector('.map-container') as HTMLElement;
      if (mapContainer) {
        capturedSize = { width: mapContainer.clientWidth, height: mapContainer.clientHeight };
      }
    }

    setMapContainerSize(capturedSize);
    setCapturedShapesImage(shapesImageDataUrl);

    // 編集画面の実際の地図中心とズームを取得して保存
    if (getMapCenterRef.current) {
      const actualMapState = getMapCenterRef.current();
      if (actualMapState) {
        setPrintMapCenter(actualMapState);

        // guideの状態も同期（Static Maps APIで使用）
        setGuide(prev => ({
          ...prev,
          map: {
            ...prev.map,
            center: { lat: actualMapState.lat, lng: actualMapState.lng },
            zoom: actualMapState.zoom
          }
        }));
      }
    }

    // 印刷表示（この後にCanvasがリサイズされる）
    setIsPrinting(true);
  };

  // 印刷時の同期はhandlePrint内で実行するため、このuseEffectは不要
  // useEffect(() => {
  //   if (isPrinting && getMapCenterRef.current) {
  //     const actualMapState = getMapCenterRef.current();
  //     if (actualMapState) {
  //       console.log('Syncing map state for print:', actualMapState);
  //       setGuide(prev => ({
  //         ...prev,
  //         map: {
  //           ...prev.map,
  //           center: { lat: actualMapState.lat, lng: actualMapState.lng },
  //           zoom: actualMapState.zoom
  //         }
  //       }));
  //     }
  //   }
  // }, [isPrinting]);

  const handleClosePrint = () => {
    setIsPrinting(false);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(guide, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `delivery-guide-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setGuide(imported);
        } catch (error) {
          alert('JSONファイルの読み込みに失敗しました');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* PrintLayout component - 印刷時は1ページ目に表示 */}
      <PrintLayout
        guide={guide}
        isPrinting={isPrinting}
        onClose={handleClosePrint}
        mapZoom={guide.map.zoom}
        mapContainerSize={mapContainerSize}
        mapBounds={mapBounds}
        printMapCenter={printMapCenter}
        capturedShapesImage={capturedShapesImage}
      />

      {/* JSON-LD構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="app-container">
        <Header onFeedbackClick={() => setShowFeedback(true)} />

      <div className="main-content">
        <Toolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          strokeColor={strokeColor}
          onStrokeColorChange={setStrokeColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onClearAll={handleClearAll}
          onPrint={handlePrint}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          fontBold={fontBold}
          onFontBoldChange={setFontBold}
          fontItalic={fontItalic}
          onFontItalicChange={setFontItalic}
          fontUnderline={fontUnderline}
          onFontUnderlineChange={setFontUnderline}
          textBackground={textBackground}
          onTextBackgroundChange={setTextBackground}
          fillColor={fillColor}
          onFillColorChange={setFillColor}
          fillOpacity={fillOpacity}
          onFillOpacityChange={setFillOpacity}
        />

        <div className="content-wrapper">
          <div className="ads-and-center-container">
            {/* 左側広告スペース（非表示だが幅は確保） */}
            <div className="ad-sidebar-left"></div>

            <div className="center-content">
              <div className="map-container">
                <MapView
                  guide={guide}
                  onGuideChange={setGuide}
                  currentTool={currentTool}
                  onToolChange={setCurrentTool}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  currentPage={currentPage}
                  onShapesChange={handleShapesChange}
                  onMapBoundsChange={handleMapBoundsChange}
                  searchAddressTrigger={searchAddressTrigger}
                  fontSize={fontSize}
                  fontBold={fontBold}
                  fontItalic={fontItalic}
                  fontUnderline={fontUnderline}
                  textBackground={textBackground}
                  fillColor={fillColor}
                  fillOpacity={fillOpacity}
                  selectedShapeId={selectedShapeId}
                  onSelectedShapeChange={setSelectedShapeId}
                  onMapInstanceReady={(getCenter) => { getMapCenterRef.current = getCenter; }}
                  onStrokeColorChange={setStrokeColor}
                  onFontSizeChange={setFontSize}
                  onFontBoldChange={setFontBold}
                  onFontItalicChange={setFontItalic}
                  onFontUnderlineChange={setFontUnderline}
                  onTextBackgroundChange={setTextBackground}
                />
              </div>

              <Sidebar
                guide={guide}
                onGuideChange={setGuide}
                onSearchAddress={() => setSearchAddressTrigger(prev => prev + 1)}
              />
            </div>

            {/* 右側広告スペース（非表示だが幅は確保） */}
            <div className="ad-sidebar-right"></div>
          </div>
        </div>
      </div>


      {/* Text Content Section (HowTo, FAQ, Use Cases, Changelog) */}
      <TextContentSection />

      <style jsx>{`
        .app-container {
          display: flex;
          flex-direction: column;
          width: 100vw;
          min-height: 100vh;
          background: #fff;
          font-family: system-ui, "Noto Sans JP", sans-serif;
          padding-top: 52px; /* Headerの高さ分 */
        }

        .main-content {
          position: relative;
          width: 100%;
          flex-shrink: 0;
        }

        .content-wrapper {
          display: flex;
          flex: 0 0 auto;
          overflow: visible;
          width: 100%;
          padding: 0 10px 10px 10px;
        }

        .ads-and-center-container {
          display: flex;
          width: 100%;
          gap: 10px;
          height: calc(100vh - 114px); /* center-contentと同じ高さ */
          min-height: 620px; /* 左右広告の最低高さを確保 */
        }

        .ad-sidebar-left,
        .ad-sidebar-right {
          width: 160px;
        }

        .center-content {
          flex: 1;
          display: flex;
          overflow: hidden;
          height: calc(100vh - 114px); /* ヘッダー(52px) + ツールバー(52px) + パディング(10px) */
          gap: 10px;
        }

        .map-container {
          flex: 1;
          position: relative;
          background: #f0f0f0;
          height: 100%;
          overflow: hidden;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }

        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 56px;
          height: 56px;
          background: #333;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          z-index: 999;
        }

        .scroll-to-top:hover {
          background: #000;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .scroll-to-top:active {
          transform: translateY(-1px);
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          .app-container {
            height: auto;
            width: auto;
          }

          .main-content {
            height: auto;
          }
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          .app-container {
            height: auto;
            width: auto;
          }

          .main-content {
            height: auto;
          }
        }

        @media (max-width: 768px) {
          .app-container {
            font-size: 12px;
          }

          .content-wrapper {
            flex-direction: column;
          }

          .ads-and-center-container {
            flex-direction: column;
            height: auto;
          }

          .ad-sidebar-left,
          .ad-sidebar-right {
            display: none;
          }

          .center-content {
            flex-direction: column;
            height: auto;
          }

          .map-container {
            height: 60vh;
          }

          .scroll-to-top {
            width: 48px;
            height: 48px;
            bottom: 20px;
            right: 20px;
          }

          .scroll-to-top svg {
            width: 20px;
            height: 20px;
          }
        }

        /* Scroll to Top Button Animations */
        @keyframes slideUpBounce {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1.1);
          }
          70% {
            transform: translateY(5px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        :global(.scroll-to-top-btn:hover svg) {
          transform: translateY(-2px);
        }

        :global(.scroll-to-top-btn:active) {
          transform: scale(0.9) !important;
        }
      `}</style>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          className="scroll-to-top-btn no-print"
          onClick={scrollToTop}
          aria-label="ページ最上部に戻る"
          title="ページ最上部に戻る"
          style={{
            display: 'flex',
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '56px',
            height: '56px',
            background: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            animation: 'slideUpBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            transition: 'background 0.3s ease, transform 0.2s ease'
          }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#000';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#333';
          e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ transition: 'transform 0.3s ease' }}
        >
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
      )}

      {/* Feedback Overlay */}
      <FeedbackOverlay isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
}