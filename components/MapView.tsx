'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Guide, Shape, Tool, PageView } from '@/lib/types';
import OverlayCanvas from './OverlayCanvas';

interface MapViewProps {
  guide: Guide;
  onGuideChange: (guide: Guide) => void;
  currentTool: Tool;
  onToolChange?: (tool: Tool) => void;
  strokeColor: string;
  strokeWidth: 1 | 2 | 3;
  currentPage: PageView;
  onShapesChange: (shapes: Shape[]) => void;
  onMapBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  searchAddressTrigger?: number;
  fontSize?: 'small' | 'medium' | 'large';
  fontBold?: boolean;
  fontItalic?: boolean;
  fontUnderline?: boolean;
  textBackground?: 'transparent' | 'white';
  fillColor?: string;
  fillOpacity?: number;
  selectedShapeId?: string | null; // 親から選択状態を受け取る
  onSelectedShapeChange?: (shapeId: string | null) => void;
  onMapInstanceReady?: (getMapCenter: () => { lat: number; lng: number; zoom: number } | null) => void;
  onStrokeColorChange?: (color: string) => void;
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  onFontBoldChange?: (bold: boolean) => void;
  onFontItalicChange?: (italic: boolean) => void;
  onFontUnderlineChange?: (underline: boolean) => void;
  onTextBackgroundChange?: (background: 'transparent' | 'white') => void;
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

export default function MapView({
  guide,
  onGuideChange,
  currentTool,
  onToolChange,
  strokeColor,
  strokeWidth,
  currentPage,
  onShapesChange,
  onMapBoundsChange,
  searchAddressTrigger,
  fontSize = 'medium',
  fontBold = false,
  fontItalic = false,
  fontUnderline = false,
  textBackground = 'transparent',
  fillColor = '',
  fillOpacity = 0.3,
  selectedShapeId,
  onSelectedShapeChange,
  onMapInstanceReady,
  onStrokeColorChange,
  onFontSizeChange,
  onFontBoldChange,
  onFontItalicChange,
  onFontUnderlineChange,
  onTextBackgroundChange,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const [map, setMap] = useState<any>(null);
  const [overlayView, setOverlayView] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMarker, setHasMarker] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const lastGeocodedAddress = useRef<string>('');  // 前回ジオコーディングした住所を記憶
  const guideRef = useRef<Guide>(guide);  // 最新のguideを保持
  const mapInstanceRef = useRef<any>(null);  // 地図インスタンスを保持

  // マーカーを削除する関数
  const removeMarker = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
      setHasMarker(false);
    }
  }, []);

  // Keep guideRef up to date
  useEffect(() => {
    guideRef.current = guide;
  }, [guide]);

  // Initialize Google Maps
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja&region=JP`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.google) {
      setIsLoaded(true);
    }
  }, []);

  // Create map instance
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: guide.map.center,
      zoom: guide.map.zoom,
      mapTypeId: guide.map.type,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy', // 地図操作を有効化
      draggable: true,
      scrollwheel: true,
    });

    mapInstanceRef.current = mapInstance;  // 地図インスタンスを保存
    setMap(mapInstance);

    // 地図インスタンスの中心を取得する関数を親に渡す
    if (onMapInstanceReady) {
      onMapInstanceReady(() => {
        if (!mapInstanceRef.current) return null;
        const center = mapInstanceRef.current.getCenter();
        const zoom = mapInstanceRef.current.getZoom();
        if (!center || !zoom) return null;
        return { lat: center.lat(), lng: center.lng(), zoom };
      });
    }

    // Listen to map events (but prevent feedback loop)
    let isUpdating = false;
    let lastCenter = { lat: guide.map.center.lat, lng: guide.map.center.lng };
    let lastZoom = guide.map.zoom;


    mapInstance.addListener('idle', () => {
      if (isUpdating) return;
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      const bounds = mapInstance.getBounds();

      // マップの表示範囲（bounds）を親コンポーネントに通知のみ
      if (bounds && onMapBoundsChange) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        onMapBoundsChange({
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng()
        });
      }

      // idleイベントでは地図の中心/ズーム変更を記録しない
      // （dragendで履歴記録するため、ここでの更新はshapesが消える原因になる）
      if (center && zoom) {
        const newLat = center.lat();
        const newLng = center.lng();

        // lastCenterとlastZoomを更新して、変更を追跡
        if (Math.abs(newLat - lastCenter.lat) > 0.0001 ||
            Math.abs(newLng - lastCenter.lng) > 0.0001 ||
            zoom !== lastZoom) {
          lastCenter = { lat: newLat, lng: newLng };
          lastZoom = zoom;

          // idleではguideを更新しない（dragendとundoで更新する）
        }
      }
    });

    // 地図クリックで住所プロンプトを非表示
    mapInstance.addListener('click', () => {
      setShowPrompt(false);
    });

    // If address is already set, geocode it immediately
    if (guide.meta.address && guide.meta.address.trim() !== '') {
      setTimeout(() => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { address: guide.meta.address, region: 'JP' },
          (results: any[], status: string) => {
            if (status === 'OK' && results[0]) {
              isUpdating = true;
              const location = results[0].geometry.location;
              const viewport = results[0].geometry.viewport;

              if (viewport) {
                mapInstance.fitBounds(viewport);
                const zoom = mapInstance.getZoom();
                if (zoom < 15) mapInstance.setZoom(15);
                if (zoom > 18) mapInstance.setZoom(18);
              } else {
                mapInstance.setCenter(location);
                mapInstance.setZoom(17);
              }

              // Add initial marker
              if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
              }
              const initialMarker = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                title: guide.meta.address,
                animation: window.google.maps.Animation.DROP
              });
              markerRef.current = initialMarker;
              setHasMarker(true);

              // Save marker position to guide
              onGuideChange({
                ...guide,
                map: {
                  ...guide.map,
                  markerPosition: { lat: location.lat(), lng: location.lng() }
                }
              });

              setTimeout(() => { isUpdating = false; }, 100);
            }
          }
        );
      }, 500);
    }
  }, [isLoaded]);

  // Update map center and zoom when guide.map changes (for undo/redo)
  useEffect(() => {
    if (!map) return;

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    if (!currentCenter || currentZoom === undefined) return;

    const needsCenterUpdate =
      Math.abs(currentCenter.lat() - guide.map.center.lat) > 0.00001 ||
      Math.abs(currentCenter.lng() - guide.map.center.lng) > 0.00001;

    const needsZoomUpdate = currentZoom !== guide.map.zoom;

    if (needsCenterUpdate || needsZoomUpdate) {
      if (needsCenterUpdate) {
        map.setCenter(guide.map.center);
      }
      if (needsZoomUpdate) {
        map.setZoom(guide.map.zoom);
      }
    }
  }, [map, guide.map.center, guide.map.zoom]);

  // Create overlay view for canvas (projection only - no drawing)
  useEffect(() => {
    if (!map || overlayView) return;

    class CanvasOverlay extends window.google.maps.OverlayView {
      onAdd() {
        // Nothing to add - canvas is managed separately
      }

      onRemove() {
        // Nothing to remove
      }

      draw() {
        // OverlayView の draw() は何もしない
        // Canvas は独立して描画される（ピクセル座標使用）
      }

      getProjection() {
        return super.getProjection();
      }
    }

    const overlay = new CanvasOverlay();
    overlay.setMap(map);
    setOverlayView(overlay);

    return () => {
      overlay.setMap(null);
    };
  }, [map]);

  // Handle address geocoding
  const geocodeAddress = useCallback(
    (address: string) => {
      if (!window.google || !map) return;

      setIsSearching(true);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: address, region: 'JP' },
        (results: any[], status: string) => {
          setIsSearching(false);
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const viewport = results[0].geometry.viewport;

            if (viewport) {
              map.fitBounds(viewport);
              // Clamp zoom to 15-18
              const zoom = map.getZoom();
              if (zoom < 15) map.setZoom(15);
              if (zoom > 18) map.setZoom(18);
            } else {
              map.setCenter(location);
              map.setZoom(17);
            }

            // Remove existing marker if any
            if (markerRef.current) {
              markerRef.current.setMap(null);
              markerRef.current = null;
            }

            // Add red marker at the searched location
            const newMarker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: address,
              animation: window.google.maps.Animation.DROP
            });
            markerRef.current = newMarker;
            setHasMarker(true);

            // guideのmap情報を更新 - 実際に変更がある場合のみ
            const newLat = location.lat();
            const newLng = location.lng();
            const newZoom = map.getZoom() || 17;
            const currentGuide = guideRef.current;

            // 現在の値と比較して、実際に変更がある場合のみ更新
            if (Math.abs(currentGuide.map.center.lat - newLat) > 0.0001 ||
                Math.abs(currentGuide.map.center.lng - newLng) > 0.0001 ||
                currentGuide.map.zoom !== newZoom) {
              onGuideChange({
                ...currentGuide,
                map: {
                  ...currentGuide.map,
                  center: { lat: newLat, lng: newLng },
                  zoom: newZoom,
                  markerPosition: { lat: newLat, lng: newLng }
                }
              });
            }
          } else {
            if (status === 'ZERO_RESULTS') {
              alert('指定された住所が見つかりませんでした。\n住所を確認してもう一度お試しください。');
            } else if (status === 'OVER_QUERY_LIMIT') {
              alert('検索制限に達しました。しばらくしてからお試しください。');
            }
          }
        }
      );
    },
    [map, guide, onGuideChange]
  );

  // 自動ジオコーディングは行わない（検索ボタンで明示的に実行）

  // 検索トリガーによるジオコーディング
  useEffect(() => {
    if (searchAddressTrigger && searchAddressTrigger > 0 && guide.meta.address && map && guide.meta.address.trim() !== '') {
      geocodeAddress(guide.meta.address);
    }
  }, [searchAddressTrigger]);

  // ツール選択時に地図の操作を制御
  useEffect(() => {
    if (!map) return;

    // selectツール時のみ地図の操作を有効化
    if (currentTool === 'select') {
      map.setOptions({
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        gestureHandling: 'greedy',
      });
    } else {
      map.setOptions({
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        gestureHandling: 'none',
      });
    }
  }, [currentTool, map]);

  // 早期リターン - すべてのフックの後に配置
  if (!isLoaded) {
    return <div className="map-loading">地図を読み込んでいます...</div>;
  }

  return (
    <div className="map-view">
      <div ref={mapRef} className="map" />
      {map && overlayView && (
        <OverlayCanvas
          map={map}
          overlayView={overlayView}
          shapes={guide.shapes}
          onShapesChange={onShapesChange}
          currentTool={currentTool}
          onToolChange={onToolChange}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          currentPage={currentPage}
          fontSize={fontSize}
          fontBold={fontBold}
          fontItalic={fontItalic}
          fontUnderline={fontUnderline}
          textBackground={textBackground}
          fillColor={fillColor}
          fillOpacity={fillOpacity}
          selectedShapeId={selectedShapeId}
          onSelectedShapeChange={onSelectedShapeChange}
          onStrokeColorChange={onStrokeColorChange}
          onFontSizeChange={onFontSizeChange}
          onFontBoldChange={onFontBoldChange}
          onFontItalicChange={onFontItalicChange}
          onFontUnderlineChange={onFontUnderlineChange}
          onTextBackgroundChange={onTextBackgroundChange}
        />
      )}


      {/* マーカー削除ボタン */}
      {hasMarker && (
        <button
          className="remove-marker-btn no-print"
          onClick={removeMarker}
          title="マーカーを削除"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L4 12M4 4l8 8" />
          </svg>
          マーカー削除
        </button>
      )}

      {(!guide.meta.address || guide.meta.address.trim() === '') && !hasMarker && showPrompt && (
        <div className="address-prompt no-print">
          <button
            className="close-button"
            onClick={() => setShowPrompt(false)}
            title="閉じる"
          >
            ×
          </button>
          <div className="prompt-content">
            <div className="prompt-text">
              現場住所を入力すると地図が表示されます
            </div>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="search-overlay no-print">
          <div className="search-content">
            <svg className="spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 0 20" strokeLinecap="round"/>
            </svg>
            <span>住所を検索中...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .map-view {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .map {
          width: 100%;
          height: 100%;
        }

        .map-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #666;
        }

        .address-prompt {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 12px 40px 12px 16px;
          border: 1px solid #ddd;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 20px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #000;
        }

        .prompt-content {
          display: flex;
          align-items: center;
        }

        .prompt-text {
          color: #333;
          font-size: 14px;
        }

        .remove-marker-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #fff;
          border: 1px solid #333;
          padding: 8px 12px;
          font-size: 13px;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          z-index: 10;
          transition: all 0.2s ease;
          border-radius: 4px;
        }

        .remove-marker-btn:hover {
          background: #333;
          color: #fff;
        }

        .remove-marker-btn svg {
          width: 16px;
          height: 16px;
        }

        .search-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }

        .search-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 30px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}