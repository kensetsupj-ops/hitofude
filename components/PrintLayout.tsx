'use client';

import { Guide, Shape } from '@/lib/types';
import { useEffect, useState, useRef, useCallback } from 'react';

interface PrintLayoutProps {
  guide: Guide;
  isPrinting?: boolean;
  onClose?: () => void;
  mapZoom?: number;
  mapContainerSize?: { width: number; height: number };
  mapBounds?: { north: number; south: number; east: number; west: number } | null;
  printMapCenter?: { lat: number; lng: number; zoom: number } | null;
  capturedShapesImage?: string | null;
}

export default function PrintLayout({
  guide,
  isPrinting = false,
  onClose,
  mapZoom = 15,
  mapContainerSize = { width: 640, height: 400 },
  mapBounds,
  printMapCenter,
  capturedShapesImage
}: PrintLayoutProps) {
  const [mapImage, setMapImage] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState(1.6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);

  // デバッグ用ログ（削除済み）

  // Draw shapes on canvas overlay - キャプチャした画像を使用
  const drawShapesOnCanvas = () => {
    const canvas = canvasRef.current;
    const mapImg = mapImageRef.current;

    if (!canvas || !mapImg) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 編集画面と同じCanvasサイズを使用（mapContainerSizeから取得）
    const canvasWidth = mapContainerSize?.width || 640;
    const canvasHeight = mapContainerSize?.height || 400;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // キャプチャした画像があればそれを使用（高解像度画像を元のサイズに縮小表示）
    if (capturedShapesImage) {
      const img = new Image();
      img.onload = () => {
        // 高解像度画像を元のCanvasサイズにフィットさせて描画
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = (error) => {
        // Failed to load captured image
      };
      img.src = capturedShapesImage;
      return;
    }

    // 編集画面と同じ地図の中心とズームを使用
    const center = printMapCenter ? { lat: printMapCenter.lat, lng: printMapCenter.lng } : guide.map.center;
    const zoom = printMapCenter?.zoom ?? guide.map.zoom;

    // Mercator投影の正確な計算（Google Mapsと同じ）
    const TILE_SIZE = 256;
    const scale = 1 << zoom; // 2^zoom

    function project(lat: number, lng: number) {
      let siny = Math.sin(lat * Math.PI / 180);
      siny = Math.min(Math.max(siny, -0.9999), 0.9999);

      return {
        x: TILE_SIZE * (0.5 + lng / 360),
        y: TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
      };
    }

    const centerPoint = project(center.lat, center.lng);

    // LatLngをピクセル座標に変換（Google OverlayView.fromLatLngToDivPixelと同じ）
    // 地図の左上を(0,0)とする座標系
    const latLngToPixel = (lat: number, lng: number) => {
      const point = project(lat, lng);
      const centerPixelX = centerPoint.x * scale;
      const centerPixelY = centerPoint.y * scale;
      const pointPixelX = point.x * scale;
      const pointPixelY = point.y * scale;

      // 地図の中心がCanvas中央に来るように配置
      const mapCenterX = canvas.width / 2;
      const mapCenterY = canvas.height / 2;

      // ポイントの位置 = 中心からのオフセット + Canvas中央
      const pixelX = (pointPixelX - centerPixelX) + mapCenterX;
      const pixelY = (pointPixelY - centerPixelY) + mapCenterY;

      return { x: pixelX, y: pixelY };
    };

    // Filter shapes for current page (p1)
    const visibleShapes = guide.shapes.filter(
      s => !s.renderOn || s.renderOn === 'p1' || s.renderOn === 'both'
    );

    if (visibleShapes.length === 0) return;

    visibleShapes.forEach((shape) => {
      ctx.strokeStyle = shape.stroke;
      ctx.fillStyle = shape.stroke;
      ctx.lineWidth = shape.width;

      switch (shape.type) {
        case 'arrow':
        case 'line': {
          const start = latLngToPixel(shape.a.lat, shape.a.lng);
          const end = latLngToPixel(shape.b.lat, shape.b.lng);

          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();

          if (shape.type === 'arrow') {
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const arrowLength = 15;
            const arrowAngle = Math.PI / 6;

            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle - arrowAngle),
              end.y - arrowLength * Math.sin(angle - arrowAngle)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle + arrowAngle),
              end.y - arrowLength * Math.sin(angle + arrowAngle)
            );
            ctx.stroke();
          }
          break;
        }

        case 'circle': {
          const centerPx = latLngToPixel(shape.center.lat, shape.center.lng);
          const metersPerPixel = 156543.03392 * Math.cos((shape.center.lat * Math.PI) / 180) / Math.pow(2, zoom);
          const radiusPixels = shape.radiusM / metersPerPixel;

          ctx.beginPath();
          ctx.arc(centerPx.x, centerPx.y, radiusPixels, 0, 2 * Math.PI);

          if (shape.fill) {
            ctx.fillStyle = shape.fill;
            ctx.globalAlpha = shape.fillOpacity || 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          ctx.stroke();
          break;
        }

        case 'rect': {
          const a = latLngToPixel(shape.a.lat, shape.a.lng);
          const b = latLngToPixel(shape.b.lat, shape.b.lng);

          const x = Math.min(a.x, b.x);
          const y = Math.min(a.y, b.y);
          const width = Math.abs(b.x - a.x);
          const height = Math.abs(b.y - a.y);

          if (shape.fill) {
            ctx.fillStyle = shape.fill;
            ctx.globalAlpha = shape.fillOpacity || 0.3;
            ctx.fillRect(x, y, width, height);
            ctx.globalAlpha = 1;
          }

          ctx.strokeRect(x, y, width, height);
          break;
        }

        case 'text': {
          const pos = latLngToPixel(shape.at.lat, shape.at.lng);

          if (pos.x < -100 || pos.x > canvas.width + 100 || pos.y < -100 || pos.y > canvas.height + 100) {
            break;
          }

          let baseFontSize = 16;
          if (shape.width === 1) baseFontSize = 12;
          else if (shape.width === 2) baseFontSize = 16;
          else if (shape.width === 3) baseFontSize = 24;

          const fontStyle = shape.italic ? 'italic' : 'normal';
          const fontWeight = shape.bold ? 'bold' : 'normal';
          ctx.font = `${fontStyle} ${fontWeight} ${baseFontSize}px system-ui, "Noto Sans JP", sans-serif`;

          if (shape.background === 'white') {
            const textMetrics = ctx.measureText(shape.text);
            const textWidth = textMetrics.width;
            const textHeight = baseFontSize;
            const padding = 2;

            ctx.fillStyle = 'white';
            ctx.fillRect(
              pos.x - padding,
              pos.y - textHeight - padding,
              textWidth + padding * 2,
              textHeight + padding * 2
            );
          }

          ctx.fillStyle = shape.stroke;
          ctx.fillText(shape.text, pos.x, pos.y);

          if (shape.underline) {
            const textMetrics = ctx.measureText(shape.text);
            ctx.beginPath();
            ctx.strokeStyle = shape.stroke;
            ctx.lineWidth = Math.max(1, baseFontSize / 16);
            ctx.moveTo(pos.x, pos.y + 2);
            ctx.lineTo(pos.x + textMetrics.width, pos.y + 2);
            ctx.stroke();
          }

          break;
        }

        case 'freehand': {
          if (shape.pts.length > 1) {
            ctx.beginPath();
            const firstPoint = latLngToPixel(shape.pts[0].lat, shape.pts[0].lng);
            ctx.moveTo(firstPoint.x, firstPoint.y);

            for (let i = 1; i < shape.pts.length; i++) {
              const point = latLngToPixel(shape.pts[i].lat, shape.pts[i].lng);
              ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
          }
          break;
        }

        case 'polyarrow': {
          if (shape.pts.length > 1) {
            ctx.beginPath();
            const points = shape.pts.map(pt => latLngToPixel(pt.lat, pt.lng));
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
              ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            const lastPt = points[points.length - 1];
            const prevPt = points[points.length - 2];
            const angle = Math.atan2(lastPt.y - prevPt.y, lastPt.x - prevPt.x);
            const arrowLength = 15;
            const arrowAngle = Math.PI / 6;

            ctx.beginPath();
            ctx.moveTo(lastPt.x, lastPt.y);
            ctx.lineTo(
              lastPt.x - arrowLength * Math.cos(angle - arrowAngle),
              lastPt.y - arrowLength * Math.sin(angle - arrowAngle)
            );
            ctx.moveTo(lastPt.x, lastPt.y);
            ctx.lineTo(
              lastPt.x - arrowLength * Math.cos(angle + arrowAngle),
              lastPt.y - arrowLength * Math.sin(angle + arrowAngle)
            );
            ctx.stroke();
          }
          break;
        }

        case 'polygon': {
          if (shape.pts.length > 2) {
            ctx.beginPath();
            const firstPoint = latLngToPixel(shape.pts[0].lat, shape.pts[0].lng);
            ctx.moveTo(firstPoint.x, firstPoint.y);

            for (let i = 1; i < shape.pts.length; i++) {
              const point = latLngToPixel(shape.pts[i].lat, shape.pts[i].lng);
              ctx.lineTo(point.x, point.y);
            }
            ctx.closePath();

            if (shape.fill) {
              ctx.fillStyle = shape.fill;
              ctx.globalAlpha = shape.fillOpacity || 0.3;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            ctx.stroke();
          }
          break;
        }
      }
    });
  };

  useEffect(() => {
    if (isPrinting) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

      // マーカーは住所検索時の位置に配置（住所がある場合）
      const markerPosition = guide.map.markerPosition || guide.map.center;
      const markerParam = guide.meta.address
        ? `&markers=color:red%7Csize:mid%7C${markerPosition.lat},${markerPosition.lng}`
        : '';

      // APIキーの確認
      if (!apiKey) {
        setMapImage('');
        return;
      }

      let mapUrl;

      // 編集画面と同じ見た目にするためのスタイル設定
      // 道路や建物のラベルを表示し、見やすいスタイルを適用
      const styleParams = '&style=feature:road|element:labels|visibility:on' +
                         '&style=feature:poi|element:labels|visibility:on' +
                         '&style=feature:transit|element:labels|visibility:on';

      const centerLat = guide.map.center.lat;
      const centerLng = guide.map.center.lng;
      const zoomLevel = guide.map.zoom;

      // 編集画面の地図コンテナサイズを取得（1:1スケール）
      const editMapWidth = Math.round(mapContainerSize?.width || 640);
      const editMapHeight = Math.round(mapContainerSize?.height || 400);
      const currentAspectRatio = editMapWidth / editMapHeight;
      setAspectRatio(currentAspectRatio);

      // Static Maps APIは1:1スケール（scale=1）
      // 最大サイズ制限：640x640
      let staticMapWidth = editMapWidth;
      let staticMapHeight = editMapHeight;

      // 640x640を超える場合は縮小（アスペクト比維持）
      if (staticMapWidth > 640 || staticMapHeight > 640) {
        const scaleFactor = Math.min(640 / staticMapWidth, 640 / staticMapHeight);
        staticMapWidth = Math.round(staticMapWidth * scaleFactor);
        staticMapHeight = Math.round(staticMapHeight * scaleFactor);
      }

      // scale=1で編集画面と同じサイズの地図を取得
      mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=${zoomLevel}&size=${staticMapWidth}x${staticMapHeight}&scale=1&maptype=roadmap${markerParam}${styleParams}&language=ja&key=${apiKey}`;
      setMapImage(mapUrl);
    }
  }, [isPrinting, guide.map.center.lat, guide.map.center.lng, guide.map.zoom, guide.meta.address]);

  // Draw shapes when map image loads or shapes change
  useEffect(() => {
    if (isPrinting && mapImage) {
      // Wait for image to load before drawing shapes
      const img = mapImageRef.current;
      if (img && img.complete) {
        drawShapesOnCanvas();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrinting, mapImage, guide.shapes, guide.map.center.lat, guide.map.center.lng, guide.map.zoom]);

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  // 印刷中のみ表示
  if (!isPrinting) {
    return null;
  }

  return (
    <>
      <div
        className="print-layout-wrapper"
        style={{
          display: isPrinting ? 'block' : 'none'
        }}
      >
        {/* 画面表示時のみ表示するボタン */}
        <div className="print-controls no-print" style={{
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
          padding: '16px 24px',
          borderBottom: '2px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#212529'
            }}>
              印刷プレビュー
            </h2>
            <span style={{
              padding: '4px 12px',
              background: '#e7f3ff',
              color: '#0066cc',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              A4横向き
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                // 印刷時のファイル名を案件名に設定
                const originalTitle = document.title;
                const fileName = guide.meta.title || '搬入案内';
                document.title = fileName;

                // 印刷ダイアログを開く
                window.print();

                // タイトルを元に戻す（印刷ダイアログが閉じられた後）
                setTimeout(() => {
                  document.title = originalTitle;
                }, 100);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                border: 'none',
                background: '#28a745',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#218838';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#28a745';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.2)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/>
              </svg>
              印刷する
            </button>
            <button
              onClick={() => {
                if (onClose) onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                border: '1px solid #dee2e6',
                background: 'white',
                color: '#495057',
                cursor: 'pointer',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#adb5bd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#dee2e6';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              閉じる
            </button>
          </div>
        </div>

        <div className="print-layout" style={{
          maxWidth: '1050px',
          margin: '10px auto',
          background: 'white',
          padding: '10px 15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          fontFamily: "'メイリオ', Meiryo, 'ヒラギノ角ゴ Pro W3', sans-serif",
          fontSize: '9px'
        }}>
          {/* ヘッダー部：現場の基本情報 */}
          <div className="print-header" style={{
            borderBottom: '2px solid #333',
            paddingBottom: '6px',
            marginBottom: '8px'
          }}>
            <div className="print-title-row" style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'baseline',
              marginBottom: '6px',
              position: 'relative'
            }}>
              <div></div>
              <h1 className="print-title" style={{
                fontSize: '14px',
                fontWeight: 'bold',
                margin: 0,
                textAlign: 'center'
              }}>{guide.meta.title || '搬入案内'}</h1>
              <div style={{ textAlign: 'right' }}>
                {guide.meta.date && (
                  <div className="print-date" style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    搬入日：{formatDate(guide.meta.date)}
                  </div>
                )}
              </div>
            </div>

            <div className="print-info-row" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}>
              <div className="print-address-section">
                <div className="print-item" style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span className="print-label" style={{ fontSize: '9px', color: '#666' }}>現場住所：</span>
                  <span className="print-value" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                    {guide.meta.address || ''}
                  </span>
                </div>
                <div className="print-item" style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span className="print-label" style={{ fontSize: '9px', color: '#666' }}>現場名：</span>
                  <span className="print-value" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                    {guide.meta.site || ''}
                  </span>
                </div>
              </div>

              <div className="print-contact-section">
                <div className="print-item" style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span className="print-label" style={{ fontSize: '9px', color: '#666' }}>責任者：</span>
                  <span className="print-value" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                    {guide.meta.supervisor || ''}
                  </span>
                </div>
                <div className="print-item" style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  <span className="print-label" style={{ fontSize: '9px', color: '#666' }}>当日直通：</span>
                  <span className="print-value" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                    {guide.meta.phone ? formatPhone(guide.meta.phone) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ：地図を左上、情報を右と下に配置 */}
          <div className="print-main-content" style={{
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            gap: '15px',
            alignItems: 'start'
          }}>
            {/* 左側：地図エリア */}
            <div className="print-left-column" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}>
              <div className="print-map-section" style={{
                display: 'block',
                width: '100%',
                maxWidth: '100%'
              }}>
                <div className="print-map-label" style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '3px 6px',
                  background: '#f0f0f0',
                  border: '1px solid #999',
                  borderBottom: 'none',
                  display: 'inline-block',
                  marginBottom: 0
                }}>
                  現場詳細地図
                </div>
                <div className="print-map-container" style={{
                  border: '1px solid #999',
                  background: 'white',
                  display: 'block',
                  position: 'relative',
                  width: '100%',
                  paddingBottom: `${(100 / aspectRatio) || 62.5}%`, // アスペクト比を維持
                  overflow: 'hidden',
                  marginTop: 0
                }}>
                  {mapImage ? (
                    <>
                      <img
                        ref={mapImageRef}
                        src={mapImage}
                        alt="現場地図"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        onLoad={() => {
                          drawShapesOnCanvas();
                        }}
                        onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.style.width = '100%';
                        placeholder.style.height = '280px';
                        placeholder.style.display = 'flex';
                        placeholder.style.alignItems = 'center';
                        placeholder.style.justifyContent = 'center';
                        placeholder.style.color = '#999';
                        placeholder.style.fontSize = '11px';
                        placeholder.innerHTML = '地図の読み込みに失敗しました';
                        target.parentNode?.appendChild(placeholder);
                      }}
                      />
                      <canvas
                        ref={canvasRef}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          zIndex: 10,
                          objectFit: 'cover'
                        }}
                      />
                      {/* 地図の枠線（地図の外側に配置、途切れなし） */}
                      <div className="map-border" style={{
                        position: 'absolute',
                        top: '-1px',
                        left: '-1px',
                        width: 'calc(100% + 2px)',
                        height: 'calc(100% + 2px)',
                        border: '1px solid #999',
                        pointerEvents: 'none',
                        boxSizing: 'content-box',
                        zIndex: 20
                      }} />
                    </>
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '11px',
                      gap: '8px'
                    }}>
                      {!guide.meta.address ? (
                        <>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          <span>現場住所が未設定です</span>
                        </>
                      ) : (
                        <span>地図を読み込んでいます...</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右側：スケジュールと車両情報 */}
            <div className="print-right-column">
              {/* スケジュール - 常に表示 */}
              <div className="print-section" style={{ marginBottom: '10px', minHeight: '80px' }}>
                <h3 className="print-section-title" style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 5px',
                  background: '#f5f5f5',
                  borderLeft: '3px solid #333',
                  margin: '0 0 5px 0'
                }}>スケジュール</h3>
                <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>集合</th>
                      <td style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.gather || ''}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>現場着</th>
                      <td style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.arrive || ''}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>荷下ろし</th>
                      <td style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.unload || ''}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>退出</th>
                      <td style={{
                        padding: '3px 5px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.leave || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 車両情報 - 常に表示 */}
              <div className="print-section" style={{ marginBottom: '10px', minHeight: '80px' }}>
                <h3 className="print-section-title" style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 5px',
                  background: '#f5f5f5',
                  borderLeft: '3px solid #333',
                  margin: '0 0 5px 0'
                }}>車両情報</h3>
                <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>車種</th>
                      <td style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.vehicle || ''}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>台数</th>
                      <td style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.units ? `${guide.meta.units}台` : ''}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>総重量</th>
                      <td style={{
                        padding: '3px 5px',
                        borderBottom: '1px solid #ddd',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.gross_t ? `${guide.meta.gross_t}t` : ''}</td>
                    </tr>
                    <tr>
                      <th style={{
                        padding: '3px 5px',
                        textAlign: 'left',
                        fontSize: '9px',
                        width: '35%',
                        fontWeight: 'normal',
                        color: '#666',
                        background: '#fafafa'
                      }}>荷姿</th>
                      <td style={{
                        padding: '3px 5px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>{guide.meta.load || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 制限事項と注意事項を右カラム内に移動 */}
              <div style={{
                marginTop: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '6px'
              }}>
                {/* 制限事項 - 常に表示 */}
                <div className="print-section" style={{ minHeight: '40px' }}>
                  <h3 className="print-section-title" style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    background: '#f5f5f5',
                    borderLeft: '3px solid #333',
                    margin: '0 0 4px 0'
                  }}>制限事項</h3>
                  <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <th style={{
                          padding: '2px 4px',
                          borderBottom: '1px solid #ddd',
                          textAlign: 'left',
                          fontSize: '9px',
                          width: '30%',
                          fontWeight: 'normal',
                          color: '#666',
                          background: '#fafafa'
                        }}>高さ制限</th>
                        <td style={{
                          padding: '2px 4px',
                          borderBottom: '1px solid #ddd',
                          fontSize: '9px',
                          fontWeight: 'bold'
                        }}>{guide.meta.h_limit_mm ? `${guide.meta.h_limit_mm}mm` : ''}</td>
                      </tr>
                      <tr>
                        <th style={{
                          padding: '2px 4px',
                          textAlign: 'left',
                          fontSize: '9px',
                          width: '30%',
                          fontWeight: 'normal',
                          color: '#666',
                          background: '#fafafa'
                        }}>幅員</th>
                        <td style={{
                          padding: '2px 4px',
                          fontSize: '9px',
                          fontWeight: 'bold'
                        }}>{guide.meta.w_limit_m ? `${guide.meta.w_limit_m}m` : ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 注意事項 - 常に表示 */}
                <div className="print-section" style={{ minHeight: '40px' }}>
                  <h3 className="print-section-title" style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    background: '#f5f5f5',
                    borderLeft: '3px solid #333',
                    margin: '0 0 4px 0'
                  }}>注意事項</h3>
                  <div className="print-notes" style={{
                    fontSize: '8px',
                    lineHeight: '1.3',
                    padding: '4px',
                    background: '#fffef0',
                    border: '1px solid #e0e0e0',
                    whiteSpace: 'pre-wrap',
                    minHeight: '40px',
                    maxHeight: '80px',
                    overflow: 'hidden'
                  }}>{guide.meta.notes || ''}</div>
                </div>
              </div>
            </div>
          </div>

          {/* フッター - 印刷時のみ表示 */}
          <div className="print-footer print-only" style={{
            marginTop: 'auto',
            paddingTop: '4px',
            borderTop: '1px solid #dee2e6',
            clear: 'both'
          }}>
            <div className="print-footer-text" style={{
              textAlign: 'center',
              fontSize: '8px',
              color: '#6c757d',
              fontWeight: '500'
            }}>
              ひとふで案内図 - わかりやすい経路図を地図で作成・共有
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* 画面表示時は印刷専用要素を非表示 */
        @media screen {
          .print-only {
            display: none !important;
          }
        }

      `}</style>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .no-print {
            display: none !important;
          }

          .print-layout-wrapper {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-layout {
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            max-width: none !important;
            width: 100% !important;
            min-height: calc(100vh - 20mm) !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 5px !important;
            padding-bottom: 30px !important; /* フッター用のスペース確保 */
            font-size: 9px !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }

          /* 地図コンテナを編集画面と同じアスペクト比に */
          .print-map-container {
            position: relative !important;
            height: auto !important;
            page-break-inside: avoid !important;
            border: 1px solid #999 !important;
            background: white !important;
          }

          .print-map-container img {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center center !important;
          }

          /* 地図の枠線を印刷時も表示（地図の外側） */
          .map-border {
            border: 1px solid #999 !important;
            box-sizing: content-box !important;
            top: -1px !important;
            left: -1px !important;
            width: calc(100% + 2px) !important;
            height: calc(100% + 2px) !important;
          }

          /* グリッドレイアウトを印刷用に最適化 */
          .print-main-content {
            grid-template-columns: 60% 40% !important;
            gap: 15px !important;
            align-items: start !important;
          }

          /* セクション間隔を印刷用に調整 */
          .print-section {
            margin-bottom: 8px !important;
          }


          /* フォントサイズを印刷用に調整 */
          .print-title {
            font-size: 14px !important;
          }

          /* ヘッダーのレイアウトを印刷用に調整 */
          .print-title-row {
            display: grid !important;
            grid-template-columns: 1fr auto 1fr !important;
            align-items: baseline !important;
            margin-bottom: 8px !important;
          }

          .print-date {
            font-size: 12px !important;
          }

          .print-info-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }

          .print-item {
            display: flex !important;
            gap: 6px !important;
            margin-bottom: 4px !important;
          }

          .print-section-title {
            font-size: 12px !important;
            padding: 3px 8px !important;
            margin: 0 0 6px 0 !important;
          }

          .print-label {
            font-size: 10px !important;
          }

          .print-value {
            font-size: 12px !important;
          }

          .print-table th,
          .print-table td {
            font-size: 11px !important;
            padding: 4px 6px !important;
          }

          .print-notes {
            font-size: 11px !important;
            padding: 8px !important;
          }

          /* フッターを印刷時に表示して一番下に配置 */
          .print-footer {
            display: block !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin-top: auto !important;
            padding: 4px 0 !important;
            border-top: 1px solid #dee2e6 !important;
            page-break-inside: avoid !important;
          }

          .print-footer-text {
            font-size: 8px !important;
            text-align: center !important;
            color: #6c757d !important;
          }

          /* 全体を1ページに収める設定 */
          .print-header,
          .print-main-content,
          .print-left-column,
          .print-right-column,
          .print-footer-sections,
          .print-section {
            page-break-inside: avoid !important;
          }

          /* 印刷時の高さ制限 */
          .print-layout * {
            max-height: 100vh !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </>
  );
}