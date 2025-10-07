'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Shape, Tool, PageView, LatLng } from '@/lib/types';
import ColorPalette from './ColorPalette';
import TextPalette from './TextPalette';

interface OverlayCanvasProps {
  map: any;
  overlayView: any;
  shapes: Shape[];
  onShapesChange: (shapes: Shape[]) => void;
  currentTool: Tool;
  onToolChange?: (tool: Tool) => void;
  strokeColor: string;
  strokeWidth: 1 | 2 | 3;
  currentPage: PageView;
  fontSize?: 'small' | 'medium' | 'large';
  fontBold?: boolean;
  fontItalic?: boolean;
  fontUnderline?: boolean;
  textBackground?: 'transparent' | 'white';
  fillColor?: string;
  fillOpacity?: number;
  selectedShapeId?: string | null; // 親から選択状態を受け取る
  onSelectedShapeChange?: (shapeId: string | null) => void;
  onStrokeColorChange?: (color: string) => void;
  onFontSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  onFontBoldChange?: (bold: boolean) => void;
  onFontItalicChange?: (italic: boolean) => void;
  onFontUnderlineChange?: (underline: boolean) => void;
  onTextBackgroundChange?: (background: 'transparent' | 'white') => void;
}

// 論理座標系の固定サイズ（印刷範囲640×528pxに一致）
const LOGICAL_WIDTH = 640;
const LOGICAL_HEIGHT = 528;
const DPI_SCALE = 2;

export default function OverlayCanvas({
  map,
  overlayView,
  shapes,
  onShapesChange,
  currentTool,
  onToolChange,
  strokeColor,
  strokeWidth,
  currentPage,
  fontSize = 'medium',
  fontBold = false,
  fontItalic = false,
  fontUnderline = false,
  textBackground = 'transparent',
  fillColor = '',
  fillOpacity = 0.3,
  selectedShapeId: externalSelectedShapeId = null, // 親から受け取る選択状態
  onSelectedShapeChange,
  onStrokeColorChange,
  onFontSizeChange,
  onFontBoldChange,
  onFontItalicChange,
  onFontUnderlineChange,
  onTextBackgroundChange,
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingShape, setDrawingShape] = useState<Shape | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  const [previewPoint, setPreviewPoint] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState<{ position: { x: number; y: number }; text: string; shapeId?: string } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [draggingShape, setDraggingShape] = useState<{ shape: Shape; pixelDelta: { x: number; y: number } } | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const drawStartPos = useRef<{ x: number; y: number } | null>(null); // 描画開始位置
  const isConfirmingText = useRef(false);
  const [hoveredTextId, setHoveredTextId] = useState<string | null>(null);
  const redrawRequestedRef = useRef(false);
  const [polyPoints, setPolyPoints] = useState<{ latLng: LatLng; pixel: { x: number; y: number } }[]>([]);
  const lastClickRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [colorPalette, setColorPalette] = useState<{
    position: { x: number; y: number };
    shapeId: string | null;
    showFill: boolean;
    hideOpacity?: boolean;
  } | null>(null);
  const [textPalette, setTextPalette] = useState<{
    position: { x: number; y: number };
  } | null>(null);
  const [mapMoveCounter, setMapMoveCounter] = useState(0); // 地図移動カウンター

  // 最新のshapesを常に参照できるようにuseRefを使用
  const shapesRef = useRef<Shape[]>(shapes);
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  // 座標変換関数：表示座標 → 論理座標（640×528px）
  const toLogicalCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    // 表示サイズと論理サイズが同じ（640×528px）なので単純変換
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // 親から受け取った選択状態を内部stateに同期（印刷時の選択解除に対応）
  useEffect(() => {
    setSelectedShapeId(externalSelectedShapeId);
  }, [externalSelectedShapeId]);

  // 選択されたshapeIdを親に通知
  useEffect(() => {
    if (onSelectedShapeChange) {
      onSelectedShapeChange(selectedShapeId);
    }
  }, [selectedShapeId, onSelectedShapeChange]);

  // ツールが変更されたらドラッグ状態をクリア
  useEffect(() => {
    setDraggingShape(null);
    dragStartPos.current = null;
  }, [currentTool]);

  // map/overlayViewをrefで保持（地図が動いても投影を変更しない）
  const mapRef2 = useRef<any>(null);
  const overlayViewRef = useRef<any>(null);
  useEffect(() => {
    if (map && !mapRef2.current) {
      mapRef2.current = map;
    }
    if (overlayView && !overlayViewRef.current) {
      overlayViewRef.current = overlayView;
    }
  }, [map, overlayView]);

  // Track shapes prop changes
  useEffect(() => {
    const textShapes = shapes.filter(s => s.type === 'text');
  }, [shapes, currentTool]);

  // ツールが変更されたら選択を解除（editとtext以外）
  useEffect(() => {
    if (currentTool !== 'text' && currentTool !== 'edit') {
      setSelectedShapeId(null);
    }
    // Clear polygon/polyarrow points when switching tools
    if (currentTool !== 'polygon' && currentTool !== 'polyarrow') {
      setPolyPoints([]);
      lastClickRef.current = null;
    }
  }, [currentTool]);


  // Convert LatLng to pixel coordinates
  const latLngToPixel = (latLng: LatLng): { x: number; y: number } | null => {
    if (!overlayView || !overlayView.getProjection()) return null;
    const projection = overlayView.getProjection();
    const point = projection.fromLatLngToDivPixel(
      new window.google.maps.LatLng(latLng.lat, latLng.lng)
    );

    // デバッグ用に詳細ログ（矢印の最初のポイントのみ）
    if (point && latLng.lat.toString().startsWith('35.690')) {
    }

    return point ? { x: point.x, y: point.y } : null;
  };

  // Convert pixel coordinates to LatLng
  const pixelToLatLng = (x: number, y: number): LatLng | null => {
    if (!overlayView || !overlayView.getProjection()) return null;
    const projection = overlayView.getProjection();
    const latLng = projection.fromDivPixelToLatLng(new window.google.maps.Point(x, y));
    return latLng ? { lat: latLng.lat(), lng: latLng.lng() } : null;
  };

  // 図形の座標情報を取得（ピクセル座標優先）
  const getShapePixels = (shape: Shape): any => {
    switch (shape.type) {
      case 'arrow':
      case 'line':
        // ピクセル座標があればそれを使用、なければ緯度経度から変換
        return {
          a: (shape as any).pixelA || latLngToPixel(shape.a),
          b: (shape as any).pixelB || latLngToPixel(shape.b)
        };
      case 'circle':
        return {
          center: (shape as any).pixelCenter || latLngToPixel(shape.center),
          radiusM: shape.radiusM,
          radiusPixels: (shape as any).radiusPixels
        };
      case 'rect':
        return {
          a: (shape as any).pixelA || latLngToPixel(shape.a),
          b: (shape as any).pixelB || latLngToPixel(shape.b)
        };
      case 'text':
        return { at: (shape as any).pixelAt || latLngToPixel(shape.at) };
      case 'marker':
        return { at: (shape as any).pixelAt || latLngToPixel(shape.at) };
      case 'freehand':
      case 'polyarrow':
      case 'polygon':
        return {
          pts: (shape as any).pixelPts || shape.pts.map(pt => latLngToPixel(pt))
        };
      default:
        return null;
    }
  };

  // 点が図形の近くにあるか判定（threshold指定版）
  const isPointNearShapeWithThreshold = (point: { x: number; y: number }, shapePixel: any, shape: Shape, threshold: number): boolean => {
    switch (shape.type) {
      case 'arrow':
      case 'line':
        if (!shapePixel.a || !shapePixel.b) return false;
        return distanceToLine(point, shapePixel.a, shapePixel.b) < threshold;

      case 'circle':
        if (!shapePixel.center) return false;
        const distToCenter = distance(point, shapePixel.center);
        // ピクセル半径があればそれを使用、なければメートルから変換（描画ロジックと同じ計算式）
        let radiusPixels;
        if (shapePixel.radiusPixels) {
          radiusPixels = shapePixel.radiusPixels;
        } else if (shape.type === 'circle') {
          const metersPerPixel = 156543.03392 * Math.cos((shape.center.lat * Math.PI) / 180) / Math.pow(2, map.getZoom());
          radiusPixels = shape.radiusM / metersPerPixel;
        } else {
          return false;
        }
        return Math.abs(distToCenter - radiusPixels) < threshold;

      case 'rect':
        if (!shapePixel.a || !shapePixel.b) return false;
        const minX = Math.min(shapePixel.a.x, shapePixel.b.x);
        const maxX = Math.max(shapePixel.a.x, shapePixel.b.x);
        const minY = Math.min(shapePixel.a.y, shapePixel.b.y);
        const maxY = Math.max(shapePixel.a.y, shapePixel.b.y);

        // 矩形の辺との距離を確認
        return (
          (Math.abs(point.x - minX) < threshold && point.y >= minY && point.y <= maxY) ||
          (Math.abs(point.x - maxX) < threshold && point.y >= minY && point.y <= maxY) ||
          (Math.abs(point.y - minY) < threshold && point.x >= minX && point.x <= maxX) ||
          (Math.abs(point.y - maxY) < threshold && point.x >= minX && point.x <= maxX)
        );

      case 'text':
        if (!shapePixel.at) return false;
        // テキストのバウンディングボックスで判定
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx && shape.type === 'text') {
            // フォントサイズの決定
            let baseFontSize = 16;
            if (shape.width === 1) baseFontSize = 12;
            else if (shape.width === 2) baseFontSize = 16;
            else if (shape.width === 3) baseFontSize = 24;

            const fontStyle = shape.italic ? 'italic' : 'normal';
            const fontWeight = shape.bold ? 'bold' : 'normal';
            ctx.font = `${fontStyle} ${fontWeight} ${baseFontSize}px system-ui, "Noto Sans JP", sans-serif`;
            const textMetrics = ctx.measureText(shape.text);
            const textWidth = textMetrics.width;
            const textHeight = baseFontSize;

            // バウンディングボックス内かチェック
            return (
              point.x >= shapePixel.at.x - 4 &&
              point.x <= shapePixel.at.x + textWidth + 4 &&
              point.y >= shapePixel.at.y - textHeight - 2 &&
              point.y <= shapePixel.at.y + 4
            );
          }
        }
        return distance(point, shapePixel.at) < threshold * 2;

      case 'marker':
        if (!shapePixel.at) return false;
        // マーカーのサイズに応じたヒット判定
        let markerSize = 30;
        if (shape.type === 'marker') {
          if (shape.width === 1) markerSize = 20;
          else if (shape.width === 2) markerSize = 30;
          else if (shape.width === 3) markerSize = 40;
        }
        // マーカーのバウンディングボックスで判定
        return (
          point.x >= shapePixel.at.x - markerSize/2 &&
          point.x <= shapePixel.at.x + markerSize/2 &&
          point.y >= shapePixel.at.y - markerSize &&
          point.y <= shapePixel.at.y
        );

      case 'freehand':
        if (!shapePixel.pts) return false;
        for (let i = 0; i < shapePixel.pts.length - 1; i++) {
          if (shapePixel.pts[i] && shapePixel.pts[i + 1]) {
            if (distanceToLine(point, shapePixel.pts[i], shapePixel.pts[i + 1]) < threshold) {
              return true;
            }
          }
        }
        return false;

      case 'polyarrow':
      case 'polygon':
        if (!shapePixel.pts) return false;
        // Check distance to each line segment
        for (let i = 0; i < shapePixel.pts.length - 1; i++) {
          if (shapePixel.pts[i] && shapePixel.pts[i + 1]) {
            if (distanceToLine(point, shapePixel.pts[i], shapePixel.pts[i + 1]) < threshold) {
              return true;
            }
          }
        }
        // For polygon, also check the closing segment
        if (shape.type === 'polygon' && shapePixel.pts.length > 2) {
          const first = shapePixel.pts[0];
          const last = shapePixel.pts[shapePixel.pts.length - 1];
          if (first && last && distanceToLine(point, last, first) < threshold) {
            return true;
          }
        }
        return false;

      default:
        return false;
    }
  };

  // 点が図形の近くにあるか判定（デフォルトthreshold）
  const isPointNearShape = (point: { x: number; y: number }, shapePixel: any, shape: Shape): boolean => {
    return isPointNearShapeWithThreshold(point, shapePixel, shape, 10);
  };

  // 2点間の距離
  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  // 点から線分への最短距離
  const distanceToLine = (point: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number => {
    const lenSquared = Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
    if (lenSquared === 0) return distance(point, a);

    let t = ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / lenSquared;
    t = Math.max(0, Math.min(1, t));

    const projection = {
      x: a.x + t * (b.x - a.x),
      y: a.y + t * (b.y - a.y)
    };

    return distance(point, projection);
  };

  // Calculate meters per pixel at current zoom
  const metersPerPixel = (): number => {
    if (!map) return 1;
    const zoom = map.getZoom();
    const center = map.getCenter();
    const scale = Math.pow(2, zoom);
    return 156543.03392 * Math.cos(center.lat() * Math.PI / 180) / scale;
  };

  // Calculate distance between two LatLng points in meters
  const calculateDistance = (a: LatLng, b: LatLng): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = a.lat * Math.PI / 180;
    const φ2 = b.lat * Math.PI / 180;
    const Δφ = (b.lat - a.lat) * Math.PI / 180;
    const Δλ = (b.lng - a.lng) * Math.PI / 180;

    const α = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(α), Math.sqrt(1-α));

    return R * c;
  };

  // Draw shapes on canvas
  const drawShapes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }


    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレビュー表示
    if (!isDrawing && previewPoint && currentTool !== 'select' && currentTool !== 'delete') {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.fillStyle = strokeColor;

      switch (currentTool) {
        case 'arrow':
        case 'line':
          // 開始点の表示
          ctx.beginPath();
          ctx.arc(previewPoint.x, previewPoint.y, 4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'circle':
          ctx.beginPath();
          ctx.arc(previewPoint.x, previewPoint.y, 20, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'rect':
          ctx.strokeRect(previewPoint.x - 20, previewPoint.y - 20, 40, 40);
          break;

        case 'text':
          ctx.font = '14px sans-serif';
          ctx.fillText('T', previewPoint.x - 5, previewPoint.y + 5);
          break;

        case 'marker':
          // マーカープレビュー（小さいピン）
          ctx.save();
          ctx.translate(previewPoint.x, previewPoint.y);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-6, -9, -6, -18);
          ctx.quadraticCurveTo(-6, -24, 0, -24);
          ctx.quadraticCurveTo(6, -24, 6, -18);
          ctx.quadraticCurveTo(6, -9, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -18, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.restore();
          break;

        case 'freehand':
          ctx.beginPath();
          ctx.arc(previewPoint.x, previewPoint.y, strokeWidth * 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'polyarrow':
        case 'polygon':
          // Show existing points and current point
          if (polyPoints.length > 0) {
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(polyPoints[0].pixel.x, polyPoints[0].pixel.y);
            polyPoints.slice(1).forEach(pt => {
              ctx.lineTo(pt.pixel.x, pt.pixel.y);
            });
            ctx.lineTo(previewPoint.x, previewPoint.y);
            ctx.stroke();

            // Draw points
            ctx.globalAlpha = 1;
            polyPoints.forEach(pt => {
              ctx.beginPath();
              ctx.arc(pt.pixel.x, pt.pixel.y, 4, 0, Math.PI * 2);
              ctx.fill();
            });
          }
          ctx.beginPath();
          ctx.arc(previewPoint.x, previewPoint.y, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      ctx.restore();
    }

    // Filter shapes by current page
    const visibleShapes = shapes.filter((shape) => {
      if (!shape.renderOn) return currentPage === 'p1';
      return shape.renderOn === currentPage || shape.renderOn === 'both';
    });

    const allTextShapes = shapes.filter(s => s.type === 'text');
    const textShapes = visibleShapes.filter(s => s.type === 'text');

    // 描画中の図形も含める
    const shapesToDraw = drawingShape && isDrawing
      ? [...visibleShapes, drawingShape]
      : visibleShapes;

    // 編集中のテキストも表示（入力フィールドがある場合でも背景に表示）
    if (textInput && textInput.text.trim() !== '') {
      const position = { x: textInput.position.x, y: textInput.position.y };

      let baseFontSize = 16;
      if (fontSize === 'small') baseFontSize = 12;
      else if (fontSize === 'medium') baseFontSize = 16;
      else if (fontSize === 'large') baseFontSize = 24;

      const fontStyle = fontItalic ? 'italic' : 'normal';
      const fontWeight = fontBold ? 'bold' : 'normal';

      ctx.save();
      ctx.globalAlpha = 0.5; // 半透明で表示
      ctx.font = `${fontStyle} ${fontWeight} ${baseFontSize}px system-ui, "Noto Sans JP", sans-serif`;
      ctx.fillStyle = strokeColor;
      ctx.fillText(textInput.text, position.x, position.y);

      if (fontUnderline) {
        const textMetrics = ctx.measureText(textInput.text);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = Math.max(1, baseFontSize / 16);
        ctx.beginPath();
        ctx.moveTo(position.x, position.y + 2);
        ctx.lineTo(position.x + textMetrics.width, position.y + 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw each shape
    shapesToDraw.forEach((shape) => {
      ctx.strokeStyle = shape.stroke;
      ctx.lineWidth = shape.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = shape.strokeOpacity !== undefined ? shape.strokeOpacity : 1.0;

      switch (shape.type) {
        case 'arrow': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          let start = (shape as any).pixelA || latLngToPixel(shape.a);
          let end = (shape as any).pixelB || latLngToPixel(shape.b);

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && draggingShape.pixelDelta) {
            if (start && end) {
              start = { x: start.x + draggingShape.pixelDelta.x, y: start.y + draggingShape.pixelDelta.y };
              end = { x: end.x + draggingShape.pixelDelta.x, y: end.y + draggingShape.pixelDelta.y };
            }
          }

          if (start && end) {

            // Draw line
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw arrowhead
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
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'line': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          let start = (shape as any).pixelA || latLngToPixel(shape.a);
          let end = (shape as any).pixelB || latLngToPixel(shape.b);

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && draggingShape.pixelDelta) {
            if (start && end) {
              start = { x: start.x + draggingShape.pixelDelta.x, y: start.y + draggingShape.pixelDelta.y };
              end = { x: end.x + draggingShape.pixelDelta.x, y: end.y + draggingShape.pixelDelta.y };
            }
          }

          if (start && end) {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'circle': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          let center = (shape as any).pixelCenter || latLngToPixel(shape.center);

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && center && draggingShape.pixelDelta) {
            center = { x: center.x + draggingShape.pixelDelta.x, y: center.y + draggingShape.pixelDelta.y };
          }

          if (center) {
            // ピクセル半径があればそれを使用、なければメートルから変換
            let radiusPixels;
            if ((shape as any).pixelRadius) {
              radiusPixels = (shape as any).pixelRadius;
            } else {
              const metersPerPixel = 156543.03392 * Math.cos((shape.center.lat * Math.PI) / 180) / Math.pow(2, map.getZoom());
              radiusPixels = shape.radiusM / metersPerPixel;
            }

            ctx.beginPath();
            ctx.arc(center.x, center.y, radiusPixels, 0, 2 * Math.PI);

            // 塗りつぶし
            if (shape.fill) {
              ctx.fillStyle = shape.fill;
              ctx.globalAlpha = shape.fillOpacity || 0.3;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'rect': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          let topLeft = (shape as any).pixelA || latLngToPixel(shape.a);
          let bottomRight = (shape as any).pixelB || latLngToPixel(shape.b);

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && draggingShape.pixelDelta) {
            if (topLeft && bottomRight) {
              topLeft = { x: topLeft.x + draggingShape.pixelDelta.x, y: topLeft.y + draggingShape.pixelDelta.y };
              bottomRight = { x: bottomRight.x + draggingShape.pixelDelta.x, y: bottomRight.y + draggingShape.pixelDelta.y };
            }
          }

          if (topLeft && bottomRight) {
            const rectX = topLeft.x;
            const rectY = topLeft.y;
            const rectW = bottomRight.x - topLeft.x;
            const rectH = bottomRight.y - topLeft.y;

            ctx.beginPath();
            ctx.rect(rectX, rectY, rectW, rectH);

            // 塗りつぶし
            if (shape.fill) {
              ctx.fillStyle = shape.fill;
              ctx.globalAlpha = shape.fillOpacity || 0.3;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'text': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          let position = (shape as any).pixelAt || latLngToPixel(shape.at);

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && position && draggingShape.pixelDelta) {
            position = { x: position.x + draggingShape.pixelDelta.x, y: position.y + draggingShape.pixelDelta.y };
          }

          if (position) {
            // フォントサイズの決定（shape.widthでサイズを保存）
            let baseFontSize = 16;
            if (shape.width === 1) baseFontSize = 12; // small
            else if (shape.width === 2) baseFontSize = 16; // medium
            else if (shape.width === 3) baseFontSize = 24; // large

            // フォントスタイルの適用
            const fontStyle = shape.italic ? 'italic' : 'normal';
            const fontWeight = shape.bold ? 'bold' : 'normal';
            ctx.font = `${fontStyle} ${fontWeight} ${baseFontSize}px system-ui, "Noto Sans JP", sans-serif`;

            // 背景を描画（whiteの場合のみ）
            if (shape.background === 'white') {
              const textMetrics = ctx.measureText(shape.text);
              const textWidth = textMetrics.width;
              const textHeight = baseFontSize;
              const padding = 2;

              ctx.fillStyle = 'white';
              ctx.fillRect(
                position.x - padding,
                position.y - textHeight - padding,
                textWidth + padding * 2,
                textHeight + padding * 2
              );
            }

            // テキストを描画（textBaselineはデフォルトのalphabeticを使用）
            ctx.fillStyle = shape.stroke;
            ctx.fillText(shape.text, position.x, position.y);

            // 下線を描画
            if (shape.underline) {
              const textMetrics = ctx.measureText(shape.text);
              ctx.beginPath();
              ctx.strokeStyle = shape.stroke;
              ctx.lineWidth = Math.max(1, baseFontSize / 16);
              ctx.moveTo(position.x, position.y + 2);
              ctx.lineTo(position.x + textMetrics.width, position.y + 2);
              ctx.stroke();
            }

            // 選択されている場合のみバウンディングボックスを表示
            if (selectedShapeId === shape.id) {
              const textMetrics = ctx.measureText(shape.text);
              const textWidth = textMetrics.width;
              const textHeight = baseFontSize;

              ctx.strokeStyle = '#007bff';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(
                position.x - 4,
                position.y - textHeight - 2,
                textWidth + 8,
                textHeight + 6
              );
              ctx.setLineDash([]);
            }
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'marker': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          let position = (shape as any).pixelAt || latLngToPixel(shape.at);

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && position && draggingShape.pixelDelta) {
            position = { x: position.x + draggingShape.pixelDelta.x, y: position.y + draggingShape.pixelDelta.y };
          }

          if (position) {
            // マーカーのサイズ（widthプロパティで制御）
            let markerSize = 30;
            if (shape.width === 1) markerSize = 20;
            else if (shape.width === 2) markerSize = 30;
            else if (shape.width === 3) markerSize = 40;

            // マーカーアイコン（ピン型）を描画
            ctx.save();
            ctx.translate(position.x, position.y);

            // マーカーの色
            ctx.fillStyle = shape.stroke;
            ctx.strokeStyle = shape.stroke;
            ctx.lineWidth = 2;

            // ピンの形状を描画
            ctx.beginPath();
            // ピンの頂点は(0, -markerSize)、底部は(0, 0)
            const pinWidth = markerSize * 0.6;
            const pinHeight = markerSize;

            // ピンの本体（涙型）
            ctx.moveTo(0, 0); // 底部
            ctx.quadraticCurveTo(-pinWidth/2, -pinHeight*0.3, -pinWidth/2, -pinHeight*0.6);
            ctx.quadraticCurveTo(-pinWidth/2, -pinHeight, 0, -pinHeight);
            ctx.quadraticCurveTo(pinWidth/2, -pinHeight, pinWidth/2, -pinHeight*0.6);
            ctx.quadraticCurveTo(pinWidth/2, -pinHeight*0.3, 0, 0);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            // 中心の円
            ctx.beginPath();
            ctx.arc(0, -pinHeight*0.7, markerSize*0.2, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();

            ctx.restore();

            // 選択されている場合の枠
            if (selectedShapeId === shape.id) {
              ctx.strokeStyle = '#007bff';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(
                position.x - markerSize/2 - 4,
                position.y - markerSize - 4,
                markerSize + 8,
                markerSize + 8
              );
              ctx.setLineDash([]);
            }
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'freehand': {
          // ピクセル座標があればそれを使用、なければ緯度経度から変換
          const pixelPoints = (shape as any).pixelPts;
          let points = pixelPoints || shape.pts.map(pt => latLngToPixel(pt));

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && points && draggingShape.pixelDelta) {
            points = points.map((pt: any) => pt ? { x: pt.x + draggingShape.pixelDelta.x, y: pt.y + draggingShape.pixelDelta.y } : null);
          }

          if (points && points.length > 0) {
            ctx.beginPath();
            const firstPoint = pixelPoints ? points[0] : points[0];
            if (firstPoint) {
              ctx.moveTo(firstPoint.x, firstPoint.y);
              points.slice(1).forEach((point: any) => {
                if (point) ctx.lineTo(point.x, point.y);
              });
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'polyarrow': {
          const pixelPoints = (shape as any).pixelPts;
          let points = pixelPoints || shape.pts.map(pt => latLngToPixel(pt));

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && points && draggingShape.pixelDelta) {
            points = points.map((pt: any) => pt ? { x: pt.x + draggingShape.pixelDelta.x, y: pt.y + draggingShape.pixelDelta.y } : null);
          }

          if (points && points.length > 1) {
            // Draw polyline
            ctx.beginPath();
            const firstPoint = pixelPoints ? points[0] : points[0];
            if (firstPoint) {
              ctx.moveTo(firstPoint.x, firstPoint.y);
              points.slice(1).forEach((point: any) => {
                if (point) ctx.lineTo(point.x, point.y);
              });
              ctx.stroke();
            }

            // Draw arrowhead at last point
            const lastPoint = points[points.length - 1];
            const prevPoint = points[points.length - 2];
            if (lastPoint && prevPoint) {
              const angle = Math.atan2(lastPoint.y - prevPoint.y, lastPoint.x - prevPoint.x);
              const arrowLength = 15;
              const arrowAngle = Math.PI / 6;

              ctx.beginPath();
              ctx.moveTo(lastPoint.x, lastPoint.y);
              ctx.lineTo(
                lastPoint.x - arrowLength * Math.cos(angle - arrowAngle),
                lastPoint.y - arrowLength * Math.sin(angle - arrowAngle)
              );
              ctx.moveTo(lastPoint.x, lastPoint.y);
              ctx.lineTo(
                lastPoint.x - arrowLength * Math.cos(angle + arrowAngle),
                lastPoint.y - arrowLength * Math.sin(angle + arrowAngle)
              );
              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'polygon': {
          const pixelPoints = (shape as any).pixelPts;
          let points = pixelPoints || shape.pts.map(pt => latLngToPixel(pt));

          // ドラッグ中ならピクセル座標をオフセット
          if (draggingShape && draggingShape.shape.id === shape.id && points && draggingShape.pixelDelta) {
            points = points.map((pt: any) => pt ? { x: pt.x + draggingShape.pixelDelta.x, y: pt.y + draggingShape.pixelDelta.y } : null);
          }

          if (points && points.length > 2) {
            ctx.beginPath();
            const firstPoint = pixelPoints ? points[0] : points[0];
            if (firstPoint) {
              ctx.moveTo(firstPoint.x, firstPoint.y);
              points.slice(1).forEach((point: any) => {
                if (point) ctx.lineTo(point.x, point.y);
              });
              ctx.closePath();

              // 塗りつぶし
              if (shape.fill) {
                ctx.fillStyle = shape.fill;
                ctx.globalAlpha = shape.fillOpacity || 0.3;
                ctx.fill();
                ctx.globalAlpha = 1;
              }

              ctx.stroke();
            }
          }
          ctx.globalAlpha = 1.0;
          break;
        }
      }

      // Highlight selected shape with bounding box
      if (shape.id === selectedShapeId) {
        ctx.save();
        ctx.globalAlpha = 1.0;  // バウンディングボックスは常に不透明
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // ドラッグ中の場合はピクセルオフセットを取得
        const isDragging = draggingShape && draggingShape.shape.id === shape.id;
        const deltaX = isDragging ? draggingShape.pixelDelta.x : 0;
        const deltaY = isDragging ? draggingShape.pixelDelta.y : 0;

        switch (shape.type) {
          case 'arrow':
          case 'line': {
            // ピクセル座標を優先的に使用
            const start = (shape as any).pixelA || latLngToPixel(shape.a);
            const end = (shape as any).pixelB || latLngToPixel(shape.b);
            if (start && end) {
              const minX = Math.min(start.x, end.x) - 10 + deltaX;
              const minY = Math.min(start.y, end.y) - 10 + deltaY;
              const maxX = Math.max(start.x, end.x) + 10 + deltaX;
              const maxY = Math.max(start.y, end.y) + 10 + deltaY;
              ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
            }
            break;
          }
          case 'circle': {
            // ピクセル座標を優先的に使用
            const center = (shape as any).pixelCenter || latLngToPixel(shape.center);
            if (center) {
              let r;
              if ((shape as any).radiusPixels) {
                r = (shape as any).radiusPixels;
              } else {
                const metersPerPixel = 156543.03392 * Math.cos((shape.center.lat * Math.PI) / 180) / Math.pow(2, map.getZoom());
                r = shape.radiusM / metersPerPixel;
              }
              ctx.strokeRect(center.x - r - 5 + deltaX, center.y - r - 5 + deltaY, r * 2 + 10, r * 2 + 10);
            }
            break;
          }
          case 'rect': {
            // ピクセル座標を優先的に使用
            const a = (shape as any).pixelA || latLngToPixel(shape.a);
            const b = (shape as any).pixelB || latLngToPixel(shape.b);
            if (a && b) {
              const minX = Math.min(a.x, b.x) - 5 + deltaX;
              const minY = Math.min(a.y, b.y) - 5 + deltaY;
              const maxX = Math.max(a.x, b.x) + 5 + deltaX;
              const maxY = Math.max(a.y, b.y) + 5 + deltaY;
              ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
            }
            break;
          }
          case 'freehand': {
            if (shape.pts.length > 0) {
              // ピクセル座標を優先的に使用
              const pixels = (shape as any).pixelPts || shape.pts.map(pt => latLngToPixel(pt));
              const validPixels = pixels.filter((p: any) => p !== null) as { x: number; y: number }[];
              if (validPixels.length > 0) {
                const minX = Math.min(...validPixels.map(p => p.x)) - 10 + deltaX;
                const minY = Math.min(...validPixels.map(p => p.y)) - 10 + deltaY;
                const maxX = Math.max(...validPixels.map(p => p.x)) + 10 + deltaX;
                const maxY = Math.max(...validPixels.map(p => p.y)) + 10 + deltaY;
                ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
              }
            }
            break;
          }
          case 'polyarrow':
          case 'polygon': {
            if (shape.pts.length > 0) {
              // ピクセル座標を優先的に使用
              const pixels = (shape as any).pixelPts || shape.pts.map(pt => latLngToPixel(pt));
              const validPixels = pixels.filter((p: any) => p !== null) as { x: number; y: number }[];
              if (validPixels.length > 0) {
                const minX = Math.min(...validPixels.map(p => p.x)) - 10 + deltaX;
                const minY = Math.min(...validPixels.map(p => p.y)) - 10 + deltaY;
                const maxX = Math.max(...validPixels.map(p => p.x)) + 10 + deltaX;
                const maxY = Math.max(...validPixels.map(p => p.y)) + 10 + deltaY;
                ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
              }
            }
            break;
          }
          // テキストのバウンディングボックスは既に描画済み
        }

        ctx.setLineDash([]);
        ctx.restore();
      }
    });

    // 描画中の図形はすでにshapes配列に含まれているため、別途描画する必要なし
  }, [shapes, selectedShapeId, drawingShape, draggingShape, isDrawing, previewPoint, currentTool, strokeColor, strokeWidth, currentPage, textInput, fontSize, fontBold, fontItalic, fontUnderline]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 論理座標に変換
    const { x, y } = toLogicalCoordinates(e.clientX, e.clientY);
    const latLng = pixelToLatLng(x, y);

    if (!latLng) return;

    // テキスト入力中の場合、他の場所をクリックしたら確定する
    if (textInput) {
      handleTextConfirm(false); // onBlurではないので、textPaletteに関係なく確定
      return; // 確定後はこの時点で処理を終了
    }

    // パレットが表示されている状態で、描画ツールで他の箇所をクリックした場合はパレットを閉じる
    if ((colorPalette || textPalette) && !isDrawing && currentTool !== 'select' && currentTool !== 'edit' && currentTool !== 'delete' && currentTool !== 'text') {
      setColorPalette(null);
      setTextPalette(null);
      return; // パレットを閉じたら、この時点で処理を終了（新しい図形は描画しない）
    }

    if (currentTool === 'select') {
      // 移動ツールは地図操作のみ - 何もしない
      return;
    }

    // 編集ツールに移動した処理
    if (currentTool === 'edit') {
      const point = { x, y };
      // 現在のページの図形のみをフィルター
      const currentPageShapes = shapes.filter((shape) => {
        if (!shape.renderOn) return currentPage === 'p1';
        return shape.renderOn === currentPage || shape.renderOn === 'both';
      });

      // 任意の図形をクリックしたかチェック（テキスト優先）
      for (let i = currentPageShapes.length - 1; i >= 0; i--) {
        const shape = currentPageShapes[i];
        const shapePixel = getShapePixels(shape);
        if (isPointNearShape(point, shapePixel, shape)) {
          setSelectedShapeId(shape.id);

          // 全ての図形をドラッグ可能に
          dragStartPos.current = { x, y };
          setDraggingShape({
            shape: shape,
            pixelDelta: { x: 0, y: 0 }
          });

          // テキストの場合はテキストパレット、それ以外はカラーパレットを表示
          if (shape.type === 'text') {
            // テキストパレットを表示
            const canvas = canvasRef.current;
            if (canvas) {
              const mapRect = canvas.getBoundingClientRect();
              const paletteWidth = 150; // テキストパレットの推定幅
              const paletteHeight = 250; // テキストパレットの推定高さ
              const canvasWidth = mapRect.width;
              const canvasHeight = mapRect.height;

              let paletteX = x;
              let paletteY = y + 30;

              // 右端からはみ出す場合
              if (paletteX + paletteWidth > canvasWidth) {
                paletteX = canvasWidth - paletteWidth - 10;
              }
              // 左端からはみ出す場合
              if (paletteX < 10) {
                paletteX = 10;
              }
              // 下端からはみ出す場合
              if (paletteY + paletteHeight > canvasHeight) {
                paletteY = y - paletteHeight - 10; // テキストの上に表示
                if (paletteY < 10) {
                  paletteY = 10;
                }
              }
              // 上端からはみ出す場合
              if (paletteY < 10) {
                paletteY = 10;
              }

              const absoluteX = mapRect.left + paletteX;
              const absoluteY = mapRect.top + paletteY;
              setTextPalette({ position: { x: absoluteX, y: absoluteY } });
            }
          } else {
            // カラーパレットを表示
            const showFill = shape.type === 'circle' || shape.type === 'rect' || shape.type === 'polygon';
            const hideOpacity = false; // すべての図形で濃さ調整を表示

            // 図形のバウンディングボックスを計算してパレットを配置
            const canvas = canvasRef.current;
            if (canvas) {
              const paletteWidth = 145;
              const paletteHeight = showFill ? 230 : 115;
              const mapRect = canvas.getBoundingClientRect();

              // 図形のバウンディングボックスを取得
              let shapeBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
              const shapePixel = getShapePixels(shape);

            switch (shape.type) {
              case 'arrow':
              case 'line':
                if (shapePixel.a && shapePixel.b) {
                  shapeBounds = {
                    minX: Math.min(shapePixel.a.x, shapePixel.b.x),
                    maxX: Math.max(shapePixel.a.x, shapePixel.b.x),
                    minY: Math.min(shapePixel.a.y, shapePixel.b.y),
                    maxY: Math.max(shapePixel.a.y, shapePixel.b.y),
                  };
                }
                break;
              case 'circle':
                if (shapePixel.center && shape.type === 'circle') {
                  // radiusPixelsがあればそれを使用、なければメートルから変換
                  let r;
                  if (shapePixel.radiusPixels) {
                    r = shapePixel.radiusPixels;
                  } else {
                    const metersPerPixel = 156543.03392 * Math.cos((shape.center.lat * Math.PI) / 180) / Math.pow(2, map.getZoom());
                    r = shape.radiusM / metersPerPixel;
                  }
                  shapeBounds = {
                    minX: shapePixel.center.x - r,
                    maxX: shapePixel.center.x + r,
                    minY: shapePixel.center.y - r,
                    maxY: shapePixel.center.y + r,
                  };
                }
                break;
              case 'rect':
                if (shapePixel.a && shapePixel.b) {
                  shapeBounds = {
                    minX: Math.min(shapePixel.a.x, shapePixel.b.x),
                    maxX: Math.max(shapePixel.a.x, shapePixel.b.x),
                    minY: Math.min(shapePixel.a.y, shapePixel.b.y),
                    maxY: Math.max(shapePixel.a.y, shapePixel.b.y),
                  };
                }
                break;
              case 'marker':
                if (shapePixel.at && shape.type === 'marker') {
                  let markerSize = 30;
                  if (shape.width === 1) markerSize = 20;
                  else if (shape.width === 2) markerSize = 30;
                  else if (shape.width === 3) markerSize = 40;
                  shapeBounds = {
                    minX: shapePixel.at.x - markerSize/2,
                    maxX: shapePixel.at.x + markerSize/2,
                    minY: shapePixel.at.y - markerSize,
                    maxY: shapePixel.at.y,
                  };
                }
                break;
              case 'freehand':
              case 'polyarrow':
              case 'polygon':
                if (shapePixel.pts && shapePixel.pts.length > 0) {
                  const xs = shapePixel.pts.map((p: any) => p.x);
                  const ys = shapePixel.pts.map((p: any) => p.y);
                  shapeBounds = {
                    minX: Math.min(...xs),
                    maxX: Math.max(...xs),
                    minY: Math.min(...ys),
                    maxY: Math.max(...ys),
                  };
                }
                break;
            }

            // パレットの位置を図形の右側に配置（図形の中央の高さに合わせる）
            const shapeCenterY = (shapeBounds.minY + shapeBounds.maxY) / 2;
            let paletteX = shapeBounds.maxX + 20;
            let paletteY = shapeCenterY - paletteHeight / 2;

            // 右端からはみ出す場合は左側に表示
            if (paletteX + paletteWidth > mapRect.right - mapRect.left) {
              paletteX = shapeBounds.minX - paletteWidth - 20;
            }

            // 左端からはみ出す場合は右側に強制表示
            if (paletteX < 0) {
              paletteX = shapeBounds.maxX + 20;
            }

            // 上端からはみ出す場合
            if (paletteY < 0) {
              paletteY = 10;
            }

            // 下端からはみ出す場合
            if (paletteY + paletteHeight > mapRect.bottom - mapRect.top) {
              paletteY = (mapRect.bottom - mapRect.top) - paletteHeight - 10;
            }

            // 絶対座標に変換
            const absoluteX = mapRect.left + paletteX;
            const absoluteY = mapRect.top + paletteY;

            setColorPalette({
              position: { x: absoluteX, y: absoluteY },
              shapeId: shape.id,
              showFill,
              hideOpacity,
            });
            }
          }

          return;
        }
      }
      // 何も選択されなかった場合は選択解除とパレットを閉じる
      setSelectedShapeId(null);
      setColorPalette(null);
      setTextPalette(null);
      return;
    }

    if (currentTool === 'delete') {
      // 削除ツール：クリックした位置の図形を削除
      const point = { x, y };
      let shapeToDelete: Shape | null = null;

      // 現在のページの図形のみをフィルター
      const currentPageShapes = shapes.filter((shape) => {
        if (!shape.renderOn) return currentPage === 'p1';
        return shape.renderOn === currentPage || shape.renderOn === 'both';
      });

      // 逆順で検索（上に描画された図形を優先）
      // 削除ツールは範囲を広めに取る（threshold=15px）
      for (let i = currentPageShapes.length - 1; i >= 0; i--) {
        const shape = currentPageShapes[i];
        const shapePixel = getShapePixels(shape);

        // shapePixelがnullの場合はスキップ
        if (!shapePixel) continue;

        // テキストの場合は特別な判定（より広い範囲）
        if (shape.type === 'text') {
          if (shapePixel.at) {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // フォントサイズの決定
                let baseFontSize = 16;
                if (shape.width === 1) baseFontSize = 12;
                else if (shape.width === 2) baseFontSize = 16;
                else if (shape.width === 3) baseFontSize = 24;

                const fontStyle = shape.italic ? 'italic' : 'normal';
                const fontWeight = shape.bold ? 'bold' : 'normal';
                ctx.font = `${fontStyle} ${fontWeight} ${baseFontSize}px system-ui, "Noto Sans JP", sans-serif`;
                const textMetrics = ctx.measureText(shape.text);
                const textWidth = textMetrics.width;
                const textHeight = baseFontSize;

                // バウンディングボックス内かチェック（余白を大きめに）
                const padding = 8;
                if (
                  point.x >= shapePixel.at.x - padding &&
                  point.x <= shapePixel.at.x + textWidth + padding &&
                  point.y >= shapePixel.at.y - textHeight - padding &&
                  point.y <= shapePixel.at.y + padding
                ) {
                  shapeToDelete = shape;
                  break;
                }
              }
            }
          }
        } else if (isPointNearShapeWithThreshold(point, shapePixel, shape, 15)) {
          shapeToDelete = shape;
          break;
        }
      }

      if (shapeToDelete) {
        const newShapes = shapes.filter(s => s.id !== shapeToDelete.id);
        onShapesChange(newShapes);
      }
      return;
    }

    setIsDrawing(true);
    drawStartPos.current = { x, y }; // 描画開始位置を保存

    const newShapeId = `shape-${Date.now()}`;
    const baseShape = {
      id: newShapeId,
      stroke: strokeColor as '#000' | '#666' | '#c00',
      width: strokeWidth,
      renderOn: currentPage as 'p1' | 'p2',
    };

    let newShape: Shape | null = null;

    switch (currentTool) {
      case 'arrow':
      case 'line':
        newShape = {
          ...baseShape,
          type: currentTool,
          a: latLng,
          b: latLng,
          pixelA: { x, y },
          pixelB: { x, y },
        } as Shape;
        break;

      case 'circle':
        newShape = {
          ...baseShape,
          type: 'circle',
          center: latLng,
          radiusM: 1, // Start with small radius
          pixelCenter: { x, y },
          radiusPixels: 1,
          fill: fillColor || undefined,
          fillOpacity: fillColor ? fillOpacity : undefined,
        } as Shape;
        break;

      case 'rect':
        newShape = {
          ...baseShape,
          type: 'rect',
          a: latLng,
          b: latLng,
          pixelA: { x, y },
          pixelB: { x, y },
          fill: fillColor || undefined,
          fillOpacity: fillColor ? fillOpacity : undefined,
        } as Shape;
        break;

      case 'text':
        // 既存のテキストをクリックしたかチェック
        const point = { x, y };
        const currentPageShapes = shapes.filter((shape) => {
          if (!shape.renderOn) return currentPage === 'p1';
          return shape.renderOn === currentPage || shape.renderOn === 'both';
        });

        let foundText = false;
        for (let i = currentPageShapes.length - 1; i >= 0; i--) {
          const shape = currentPageShapes[i];
          if (shape.type === 'text') {
            const shapePixel = getShapePixels(shape);
            const isNear = isPointNearShape(point, shapePixel, shape);
            if (isNear) {
              // 既存テキストを選択してドラッグ開始
              setSelectedShapeId(shape.id);
              setIsDrawing(false); // isDrawingをfalseに設定
              const position = latLngToPixel(shape.at);
              if (position) {
                dragStartPos.current = { x, y };
                setDraggingShape({
                  shape,
                  pixelDelta: { x: 0, y: 0 }
                });

                // テキストパレットを表示（テキストの右側に配置）
                const canvas = canvasRef.current;
                if (canvas) {
                  const mapRect = canvas.getBoundingClientRect();
                  const paletteWidth = 150;
                  const paletteHeight = 250;
                  const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
                  const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

                  // テキストのサイズを推定
                  const textWidth = shape.text.length * (shape.width === 1 ? 8 : shape.width === 3 ? 16 : 12); // 概算
                  const textHeight = shape.width === 1 ? 12 : shape.width === 3 ? 24 : 16;

                  // テキストの右側に配置
                  let paletteX = x + textWidth + 20;
                  let paletteY = y - (paletteHeight - textHeight) / 2;

                  // 右端からはみ出す場合は左側に表示
                  if (paletteX + paletteWidth > canvasWidth) {
                    paletteX = x - paletteWidth - 20;
                  }

                  // 左端からはみ出す場合は右側に強制表示
                  if (paletteX < 10) {
                    paletteX = x + textWidth + 20;
                  }

                  // 上端からはみ出す場合
                  if (paletteY < 10) {
                    paletteY = 10;
                  }

                  // 下端からはみ出す場合
                  if (paletteY + paletteHeight > canvasHeight) {
                    paletteY = canvasHeight - paletteHeight - 10;
                  }

                  const absoluteX = mapRect.left + paletteX;
                  const absoluteY = mapRect.top + paletteY;
                  setTextPalette({ position: { x: absoluteX, y: absoluteY } });
                }
              } else {
              }
              foundText = true;
              break;
            }
          }
        }

        if (!foundText) {
          // テキスト入力フィールドの位置を地図の範囲内に調整
          const canvas = canvasRef.current;
          let adjustedX = x;
          let adjustedY = y;

          if (canvas) {
            const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
            const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
            const inputWidth = 200; // 入力フィールドの推定幅
            const inputHeight = 40; // 入力フィールドの推定高さ
            const margin = 10; // 余白

            // 右端に近い場合は左にずらす
            if (adjustedX + inputWidth + margin > canvasWidth) {
              adjustedX = canvasWidth - inputWidth - margin;
            }
            // 左端に近い場合
            if (adjustedX < margin) {
              adjustedX = margin;
            }
            // 下端に近い場合は上にずらす
            if (adjustedY + inputHeight + margin > canvasHeight) {
              adjustedY = canvasHeight - inputHeight - margin;
            }
            // 上端に近い場合
            if (adjustedY < margin) {
              adjustedY = margin;
            }
          }

          // 新規テキスト入力フィールドを表示
          setTextInput({
            position: { x: adjustedX, y: adjustedY },
            text: ''
          });
          setIsDrawing(false);
          setSelectedShapeId(null); // 選択解除

          // テキストパレットを表示（テキスト入力フィールドの右側に配置）
          if (canvas) {
            const mapRect = canvas.getBoundingClientRect();
            const paletteWidth = 150;
            const paletteHeight = 250;
            const canvasWidth = (canvasRef.current?.width ? canvasRef.current.width / (window.devicePixelRatio || 1) : null) || mapRect.width;
            const canvasHeight = (canvasRef.current?.height ? canvasRef.current.height / (window.devicePixelRatio || 1) : null) || mapRect.height;

            // テキスト入力フィールドのサイズを推定
            const inputWidth = 150; // 実際の幅を推定（minWidth: 100px + 余裕）
            const inputHeight = fontSize === 'small' ? 20 : fontSize === 'large' ? 40 : 28;

            // テキスト入力フィールドの右側に配置
            let paletteX = adjustedX + inputWidth + 20;
            let paletteY = adjustedY - (paletteHeight - inputHeight) / 2; // 入力フィールドの中央に合わせる

            // 右端からはみ出す場合は左側に表示
            if (paletteX + paletteWidth > canvasWidth) {
              paletteX = adjustedX - paletteWidth - 20;
            }

            // 左端からはみ出す場合は右側に強制表示
            if (paletteX < 10) {
              paletteX = adjustedX + inputWidth + 20;
            }

            // 上端からはみ出す場合
            if (paletteY < 10) {
              paletteY = 10;
            }

            // 下端からはみ出す場合
            if (paletteY + paletteHeight > canvasHeight) {
              paletteY = canvasHeight - paletteHeight - 10;
            }

            const absoluteX = mapRect.left + paletteX;
            const absoluteY = mapRect.top + paletteY;
            setTextPalette({ position: { x: absoluteX, y: absoluteY } });
          }

          // フォーカスを設定
          setTimeout(() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }, 50);
        }
        return;

      case 'marker':
        newShape = {
          ...baseShape,
          type: 'marker',
          at: latLng,
          pixelAt: { x, y },
        } as Shape;
        // マーカーはワンクリックで完成
        onShapesChange([...shapes, newShape]);
        setIsDrawing(false);
        setSelectedShapeId(newShape.id);

        // カラーパレットを表示
        const canvas = canvasRef.current;
        if (canvas) {
          const mapRect = canvas.getBoundingClientRect();
          const paletteWidth = 145;
          const paletteHeight = 150; // 濃さスライダーを含む高さ

          let markerSize = 30;
          if (strokeWidth === 1) markerSize = 20;
          else if (strokeWidth === 2) markerSize = 30;
          else if (strokeWidth === 3) markerSize = 40;

          // マーカーの右側に配置
          let paletteX = x + markerSize/2 + 20;
          let paletteY = y - markerSize/2 - paletteHeight/2;

          // 右端からはみ出す場合は左側に表示
          if (paletteX + paletteWidth > mapRect.width) {
            paletteX = x - markerSize/2 - paletteWidth - 20;
          }

          // 左端からはみ出す場合
          if (paletteX < 0) {
            paletteX = 10;
          }

          // 上端からはみ出す場合
          if (paletteY < 0) {
            paletteY = 10;
          }

          // 下端からはみ出す場合
          if (paletteY + paletteHeight > mapRect.height) {
            paletteY = mapRect.height - paletteHeight - 10;
          }

          const absoluteX = mapRect.left + paletteX;
          const absoluteY = mapRect.top + paletteY;

          setColorPalette({
            position: { x: absoluteX, y: absoluteY },
            shapeId: newShape.id,
            showFill: false,
            hideOpacity: false
          });
        }
        return;

      case 'freehand':
        newShape = {
          ...baseShape,
          type: 'freehand',
          pts: [latLng],
          pixelPts: [{ x, y }],
        } as Shape;
        break;

      case 'polyarrow':
      case 'polygon':
        // Check for double-click at same location or click near start point
        const now = Date.now();
        const isDoubleClick = lastClickRef.current &&
          Math.abs(lastClickRef.current.x - x) < 15 &&
          Math.abs(lastClickRef.current.y - y) < 15 &&
          now - lastClickRef.current.time < 500;

        // Check if clicking near the start point (to close the polygon)
        const isNearStartPoint = polyPoints.length >= 2 &&
          Math.abs(polyPoints[0].pixel.x - x) < 15 &&
          Math.abs(polyPoints[0].pixel.y - y) < 15;

        if ((isDoubleClick || isNearStartPoint) && polyPoints.length >= 2) {
          // Complete the shape
          // Don't add the final point if it's too close to an existing point
          const pts = polyPoints.map(p => p.latLng);
          const pixelPts = polyPoints.map(p => p.pixel);

          const completedShape: Shape = {
            ...baseShape,
            type: currentTool,
            pts,
            pixelPts,
            fill: fillColor || undefined,
            fillOpacity: fillColor ? fillOpacity : undefined,
          } as Shape;

          onShapesChange([...shapes, completedShape]);
          setPolyPoints([]);
          lastClickRef.current = null;

          // カラーパレットを表示（polygon/polyarrowの場合）
          const canvas = canvasRef.current;
          if (canvas) {
            const showFill = currentTool === 'polygon';
            const paletteWidth = 180;
            const paletteHeight = showFill ? 280 : 140;
            const mapRect = canvas.getBoundingClientRect();

          // 図形のバウンディングボックスを計算
          const xs = pixelPts.map((p: any) => p.x);
          const ys = pixelPts.map((p: any) => p.y);
          const shapeBounds = {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys),
          };

          // パレットの位置を図形の右側に配置
          const shapeCenterY = (shapeBounds.minY + shapeBounds.maxY) / 2;
          let paletteX = shapeBounds.maxX + 20;
          let paletteY = shapeCenterY - paletteHeight / 2;

          // 右端からはみ出す場合は左側に表示
          if (paletteX + paletteWidth > mapRect.right - mapRect.left) {
            paletteX = shapeBounds.minX - paletteWidth - 20;
          }

          // 左端からはみ出す場合は右側に強制表示
          if (paletteX < 0) {
            paletteX = shapeBounds.maxX + 20;
          }

          // 上端からはみ出す場合
          if (paletteY < 0) {
            paletteY = 10;
          }

          // 下端からはみ出す場合
          if (paletteY + paletteHeight > mapRect.bottom - mapRect.top) {
            paletteY = (mapRect.bottom - mapRect.top) - paletteHeight - 10;
          }

          // 絶対座標に変換
          const absoluteX = mapRect.left + paletteX;
          const absoluteY = mapRect.top + paletteY;

          setColorPalette({
            position: { x: absoluteX, y: absoluteY },
            shapeId: completedShape.id,
            showFill,
          });
          }
        } else {
          // Add point only if it's not too close to the previous point
          const shouldAddPoint = !lastClickRef.current ||
            Math.abs(lastClickRef.current.x - x) >= 10 ||
            Math.abs(lastClickRef.current.y - y) >= 10;

          if (shouldAddPoint) {
            setPolyPoints([...polyPoints, { latLng, pixel: { x, y } }]);
            lastClickRef.current = { x, y, time: now };
          }
        }
        return;
    }

    if (newShape) {
      setDrawingShape(newShape);
      // shapes配列には追加せず、描画中の図形として保持
      // MouseUpで最終的に追加される
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 論理座標に変換
    const { x, y } = toLogicalCoordinates(e.clientX, e.clientY);

    // 図形をドラッグ中の場合（最優先）
    if (draggingShape && dragStartPos.current) {
      // マウスの移動量を計算
      const deltaX = x - dragStartPos.current.x;
      const deltaY = y - dragStartPos.current.y;

      setDraggingShape({
        ...draggingShape,
        pixelDelta: { x: deltaX, y: deltaY }
      });
      // リアルタイムで描画を更新
      requestAnimationFrame(() => drawShapes());
      return;
    }

    // テキストツール使用時のhover判定
    if (currentTool === 'text' && !isDrawing) {
      const point = { x, y };
      const currentPageShapes = shapes.filter((shape) => {
        if (!shape.renderOn) return currentPage === 'p1';
        return shape.renderOn === currentPage || shape.renderOn === 'both';
      });

      let hoveredText: string | null = null;
      for (let i = currentPageShapes.length - 1; i >= 0; i--) {
        const shape = currentPageShapes[i];
        if (shape.type === 'text') {
          const shapePixel = getShapePixels(shape);
          const isNear = isPointNearShape(point, shapePixel, shape);
          if (isNear) {
            hoveredText = shape.id;
            break;
          }
        }
      }
      setHoveredTextId(hoveredText);
    } else if (currentTool !== 'text') {
      // 他のツールを選択した時はhoverをクリア
      if (hoveredTextId !== null) {
        setHoveredTextId(null);
      }
    }

    // 編集ツール使用時のhover判定
    if (currentTool === 'edit' && !isDrawing) {
      const point = { x, y };
      const currentPageShapes = shapes.filter((shape) => {
        if (!shape.renderOn) return currentPage === 'p1';
        return shape.renderOn === currentPage || shape.renderOn === 'both';
      });

      let hoveredShape: string | null = null;
      for (let i = currentPageShapes.length - 1; i >= 0; i--) {
        const shape = currentPageShapes[i];
        const shapePixel = getShapePixels(shape);
        const isNear = isPointNearShape(point, shapePixel, shape);
        if (isNear) {
          hoveredShape = shape.id;
          break;
        }
      }
      if (hoveredShape !== hoveredShapeId) {
        setHoveredShapeId(hoveredShape);
      }
    } else if (currentTool !== 'edit') {
      // 他のツールを選択した時はhoverをクリア
      if (hoveredShapeId !== null) {
        setHoveredShapeId(null);
      }
    }

    // プレビュー用のポイントを更新
    if (!isDrawing) {
      setPreviewPoint({ x, y });
      drawShapes();
    }

    if (!isDrawing || !drawingShape) return;

    const latLng = pixelToLatLng(x, y);
    if (!latLng) return;

    // 描画中の図形を一時的に更新（履歴には記録しない）
    let updatedDrawingShape: Shape | null = null;

    switch (drawingShape.type) {
      case 'arrow':
      case 'line':
        updatedDrawingShape = {
          ...drawingShape,
          b: latLng,
          pixelB: { x, y }
        };
        break;
      case 'circle':
        const radius = calculateDistance(drawingShape.center, latLng);
        const centerPixel = (drawingShape as any).pixelCenter;
        const radiusPixels = centerPixel ? Math.sqrt(
          Math.pow(x - centerPixel.x, 2) + Math.pow(y - centerPixel.y, 2)
        ) : 0;
        updatedDrawingShape = {
          ...drawingShape,
          radiusM: radius,
          pixelRadius: radiusPixels
        };
        break;
      case 'rect':
        updatedDrawingShape = {
          ...drawingShape,
          b: latLng,
          pixelB: { x, y }
        };
        break;
      case 'freehand':
        updatedDrawingShape = {
          ...drawingShape,
          pts: [...drawingShape.pts, latLng],
          pixelPts: [...(drawingShape as any).pixelPts || [], { x, y }]
        };
        break;
      default:
        updatedDrawingShape = drawingShape;
    }

    if (updatedDrawingShape) {
      setDrawingShape(updatedDrawingShape);
      // 描画中の図形だけ更新（履歴には記録しない）
      drawShapes();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 論理座標に変換
    const { x, y } = toLogicalCoordinates(e.clientX, e.clientY);

    // ドラッグ終了時に履歴に記録
    if (draggingShape && draggingShape.pixelDelta) {
      // ピクセルデルタをLatLngデルタに変換（地図状態に依存しない方法）
      const pixelDelta = draggingShape.pixelDelta;

      // 基準点（0,0）と移動先点（delta.x, delta.y）をLatLngに変換し、その差分を計算
      const baseLatLng = pixelToLatLng(0, 0);
      const movedLatLng = pixelToLatLng(pixelDelta.x, pixelDelta.y);

      if (!baseLatLng || !movedLatLng) {
        setDraggingShape(null);
        dragStartPos.current = null;
        return;
      }

      const latLngDelta = {
        lat: movedLatLng.lat - baseLatLng.lat,
        lng: movedLatLng.lng - baseLatLng.lng
      };

      let finalShape = draggingShape.shape;

      switch (finalShape.type) {
        case 'text': {
          // ピクセル座標とLatLng両方を更新
          const currentPixelAt = (finalShape as any).pixelAt || latLngToPixel(finalShape.at);
          finalShape = {
            ...finalShape,
            at: {
              lat: finalShape.at.lat + latLngDelta.lat,
              lng: finalShape.at.lng + latLngDelta.lng
            },
            pixelAt: currentPixelAt ? { x: currentPixelAt.x + pixelDelta.x, y: currentPixelAt.y + pixelDelta.y } : undefined
          };
          break;
        }
        case 'marker': {
          // ピクセル座標とLatLng両方を更新
          const currentPixelAt = (finalShape as any).pixelAt || latLngToPixel(finalShape.at);
          finalShape = {
            ...finalShape,
            at: {
              lat: finalShape.at.lat + latLngDelta.lat,
              lng: finalShape.at.lng + latLngDelta.lng
            },
            pixelAt: currentPixelAt ? { x: currentPixelAt.x + pixelDelta.x, y: currentPixelAt.y + pixelDelta.y } : undefined
          };
          break;
        }
        case 'arrow':
        case 'line': {
          // ピクセル座標とLatLng両方を更新
          const currentPixelA = (finalShape as any).pixelA || latLngToPixel(finalShape.a);
          const currentPixelB = (finalShape as any).pixelB || latLngToPixel(finalShape.b);
          finalShape = {
            ...finalShape,
            a: {
              lat: finalShape.a.lat + latLngDelta.lat,
              lng: finalShape.a.lng + latLngDelta.lng
            },
            b: {
              lat: finalShape.b.lat + latLngDelta.lat,
              lng: finalShape.b.lng + latLngDelta.lng
            },
            pixelA: currentPixelA ? { x: currentPixelA.x + pixelDelta.x, y: currentPixelA.y + pixelDelta.y } : undefined,
            pixelB: currentPixelB ? { x: currentPixelB.x + pixelDelta.x, y: currentPixelB.y + pixelDelta.y } : undefined
          };
          break;
        }
        case 'circle': {
          // ピクセル座標とLatLng両方を更新
          const currentPixelCenter = (finalShape as any).pixelCenter || latLngToPixel(finalShape.center);
          finalShape = {
            ...finalShape,
            center: {
              lat: finalShape.center.lat + latLngDelta.lat,
              lng: finalShape.center.lng + latLngDelta.lng
            },
            pixelCenter: currentPixelCenter ? { x: currentPixelCenter.x + pixelDelta.x, y: currentPixelCenter.y + pixelDelta.y } : undefined
          };
          break;
        }
        case 'rect': {
          // ピクセル座標とLatLng両方を更新
          const currentPixelA = (finalShape as any).pixelA || latLngToPixel(finalShape.a);
          const currentPixelB = (finalShape as any).pixelB || latLngToPixel(finalShape.b);
          finalShape = {
            ...finalShape,
            a: {
              lat: finalShape.a.lat + latLngDelta.lat,
              lng: finalShape.a.lng + latLngDelta.lng
            },
            b: {
              lat: finalShape.b.lat + latLngDelta.lat,
              lng: finalShape.b.lng + latLngDelta.lng
            },
            pixelA: currentPixelA ? { x: currentPixelA.x + pixelDelta.x, y: currentPixelA.y + pixelDelta.y } : undefined,
            pixelB: currentPixelB ? { x: currentPixelB.x + pixelDelta.x, y: currentPixelB.y + pixelDelta.y } : undefined
          };
          break;
        }
        case 'freehand':
        case 'polygon':
        case 'polyarrow': {
          // ピクセル座標とLatLng両方を更新
          const currentPixelPts = (finalShape as any).pixelPts || finalShape.pts.map(pt => latLngToPixel(pt));
          finalShape = {
            ...finalShape,
            pts: finalShape.pts.map(pt => ({
              lat: pt.lat + latLngDelta.lat,
              lng: pt.lng + latLngDelta.lng
            })),
            pixelPts: currentPixelPts ? currentPixelPts.map((p: any) => p ? { x: p.x + pixelDelta.x, y: p.y + pixelDelta.y } : null) : undefined
          };
          break;
        }
      }

      // 新しい座標で図形を更新
      const newShapes = shapes.map(s =>
        s.id === draggingShape.shape.id ? finalShape : s
      );

      // ドラッグ状態をクリアしてから図形を更新
      setDraggingShape(null);
      dragStartPos.current = null;
      onShapesChange(newShapes);
      return;
    }

    if (isDrawing && drawingShape) {
      // 描画終了時に最終的な図形を追加（履歴に記録）
      const finalShapes = shapes.filter(s => s.id !== drawingShape.id);

      if (drawingShape.type === 'arrow' || drawingShape.type === 'line') {
      }

      // 図形が実際に描画された場合のみ追加（開始点と終了点が異なる場合）
      let isValidShape = false;

      // 描画開始位置と終了位置を比較してワンクリックを検出
      const startPos = drawStartPos.current;
      if (startPos) {
        const dx = Math.abs(x - startPos.x);
        const dy = Math.abs(y - startPos.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        switch (drawingShape.type) {
          case 'arrow':
          case 'line':
          case 'rect':
          case 'circle':
            // 15px以上移動した場合のみ有効（ワンクリック防止）
            isValidShape = distance > 15;
            break;
          case 'freehand':
            // 3点以上かつ10px以上移動した場合のみ有効
            isValidShape = drawingShape.pts && drawingShape.pts.length > 2 && distance > 10;
            break;
          default:
            isValidShape = true;
        }
      } else {
        isValidShape = true;
      }

      if (!isValidShape) {
        // 図形が無効な場合は追加せず、パレットも表示しない
        setIsDrawing(false);
        setDrawingShape(null);
        drawStartPos.current = null; // 描画開始位置をリセット
        return;
      }

      // ピクセル座標を保持して保存（地図移動後も同じ画面位置に描画するため）
      onShapesChange([...finalShapes, drawingShape]);

      // カラーパレットを表示（全ての図形で表示、塗りつぶしはcircle/rect/polygonのみ）
      const showFill = drawingShape.type === 'circle' || drawingShape.type === 'rect' || drawingShape.type === 'polygon';

      // 図形のバウンディングボックスを計算してパレットを配置
      const paletteWidth = 180;
      const paletteHeight = showFill ? 280 : 140;
      const mapRect = canvas.getBoundingClientRect();

      // 図形のバウンディングボックスを取得
      let shapeBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      const shapePixel = getShapePixels(drawingShape);

      switch (drawingShape.type) {
        case 'arrow':
        case 'line':
          if (shapePixel.a && shapePixel.b) {
            shapeBounds = {
              minX: Math.min(shapePixel.a.x, shapePixel.b.x),
              maxX: Math.max(shapePixel.a.x, shapePixel.b.x),
              minY: Math.min(shapePixel.a.y, shapePixel.b.y),
              maxY: Math.max(shapePixel.a.y, shapePixel.b.y),
            };
          }
          break;
        case 'circle':
          if (shapePixel.center) {
            // radiusMをピクセルに変換
            let r;
            if (shapePixel.radiusPixels) {
              r = shapePixel.radiusPixels;
            } else {
              const metersPerPixel = 156543.03392 * Math.cos((drawingShape.center.lat * Math.PI) / 180) / Math.pow(2, map.getZoom());
              r = drawingShape.radiusM / metersPerPixel;
            }
            shapeBounds = {
              minX: shapePixel.center.x - r,
              maxX: shapePixel.center.x + r,
              minY: shapePixel.center.y - r,
              maxY: shapePixel.center.y + r,
            };
          }
          break;
        case 'rect':
          if (shapePixel.a && shapePixel.b) {
            shapeBounds = {
              minX: Math.min(shapePixel.a.x, shapePixel.b.x),
              maxX: Math.max(shapePixel.a.x, shapePixel.b.x),
              minY: Math.min(shapePixel.a.y, shapePixel.b.y),
              maxY: Math.max(shapePixel.a.y, shapePixel.b.y),
            };
          }
          break;
        case 'freehand':
        case 'polyarrow':
        case 'polygon':
          if (shapePixel.pts && shapePixel.pts.length > 0) {
            const xs = shapePixel.pts.map((p: any) => p.x);
            const ys = shapePixel.pts.map((p: any) => p.y);
            shapeBounds = {
              minX: Math.min(...xs),
              maxX: Math.max(...xs),
              minY: Math.min(...ys),
              maxY: Math.max(...ys),
            };
          }
          break;
      }

      // パレットの位置を図形の右側に配置（図形の中央の高さに合わせる）
      const shapeCenterY = (shapeBounds.minY + shapeBounds.maxY) / 2;
      let paletteX = shapeBounds.maxX + 20;
      let paletteY = shapeCenterY - paletteHeight / 2;

      // 右端からはみ出す場合は左側に表示
      if (paletteX + paletteWidth > mapRect.right - mapRect.left) {
        paletteX = shapeBounds.minX - paletteWidth - 20;
      }

      // 左端からはみ出す場合は右側に強制表示
      if (paletteX < 0) {
        paletteX = shapeBounds.maxX + 20;
      }

      // 上端からはみ出す場合
      if (paletteY < 0) {
        paletteY = 10;
      }

      // 下端からはみ出す場合
      if (paletteY + paletteHeight > mapRect.bottom - mapRect.top) {
        paletteY = (mapRect.bottom - mapRect.top) - paletteHeight - 10;
      }

      // 絶対座標に変換
      const absoluteX = mapRect.left + paletteX;
      const absoluteY = mapRect.top + paletteY;

      setColorPalette({
        position: { x: absoluteX, y: absoluteY },
        shapeId: drawingShape.id,
        showFill,
      });
    }
    setIsDrawing(false);
    setDrawingShape(null);
    drawStartPos.current = null; // 描画開始位置をリセット
  };

  // Trigger redraw flag
  const [needsRedraw, setNeedsRedraw] = useState(0);

  // Update canvas size - initial setup only
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    // Canvas内部解像度を固定（論理サイズ × DPI_SCALE）
    canvas.width = LOGICAL_WIDTH * DPI_SCALE;
    canvas.height = LOGICAL_HEIGHT * DPI_SCALE;

    // CSS表示サイズを640×528pxに固定（印刷範囲と一致）
    canvas.style.width = `${LOGICAL_WIDTH}px`;
    canvas.style.height = `${LOGICAL_HEIGHT}px`;

    // Canvas を中央配置
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    // 描画コンテキストをスケーリング
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(DPI_SCALE, DPI_SCALE);
    }

    // リサイズ時も論理サイズは変更しない
    // リサイズイベントは不要
  }, []);

  // Redraw when shapes or other dependencies change
  useEffect(() => {
    drawShapes();
  }, [drawShapes, needsRedraw]);

  // 地図移動時の再描画は不要（描画は画面上の固定位置に留まる）
  // useEffectでidleリスナーを設定しない

  // ツールが変更されたときにテキスト入力を自動確定
  useEffect(() => {
    if (textInput && currentTool !== 'text' && !isConfirmingText.current) {
      isConfirmingText.current = true;
      handleTextConfirm();
      isConfirmingText.current = false;
    }
  }, [currentTool]);

  // 選択された図形の属性を変更（Toolbarの設定変更を監視）
  // 注: この機能は一時的に無効化しています。選択ツール使用時のみ有効にする必要があります。
  /*
  const lastUpdateRef = useRef<{ shapeId: string; stroke: string; width: number; fontSize?: string; fontBold?: boolean; fontItalic?: boolean; fontUnderline?: boolean } | null>(null);

  useEffect(() => {
    // 選択ツール使用時のみ属性変更を有効化
    if (currentTool !== 'select') return;

    if (selectedShapeId) {
      const selectedShape = shapes.find(s => s.id === selectedShapeId);
      if (selectedShape) {
        let hasChanges = false;
        let updatedShape = { ...selectedShape };

        // テキストの場合
        if (selectedShape.type === 'text') {
          // テキストのサイズをwidthに変換（small=1, medium=2, large=3）
          const newWidth = fontSize === 'small' ? 1 : fontSize === 'large' ? 3 : 2;

          // 前回の更新と同じ場合はスキップ
          if (lastUpdateRef.current &&
              lastUpdateRef.current.shapeId === selectedShapeId &&
              lastUpdateRef.current.stroke === strokeColor &&
              lastUpdateRef.current.width === newWidth &&
              lastUpdateRef.current.fontBold === fontBold &&
              lastUpdateRef.current.fontItalic === fontItalic &&
              lastUpdateRef.current.fontUnderline === fontUnderline) {
            return;
          }

          if (selectedShape.stroke !== strokeColor ||
              selectedShape.width !== newWidth ||
              selectedShape.bold !== fontBold ||
              selectedShape.italic !== fontItalic ||
              selectedShape.underline !== fontUnderline) {

            updatedShape = {
              ...selectedShape,
              stroke: strokeColor as any,
              width: newWidth as 1 | 2 | 3,
              bold: fontBold,
              italic: fontItalic,
              underline: fontUnderline,
            };
            hasChanges = true;
            lastUpdateRef.current = { shapeId: selectedShapeId, stroke: strokeColor, width: newWidth, fontBold, fontItalic, fontUnderline };
          }
        } else {
          // 他の図形（矢印、線、円、四角、フリーハンド）の場合
          // 前回の更新と同じ場合はスキップ
          if (lastUpdateRef.current &&
              lastUpdateRef.current.shapeId === selectedShapeId &&
              lastUpdateRef.current.stroke === strokeColor &&
              lastUpdateRef.current.width === strokeWidth) {
            return;
          }

          if (selectedShape.stroke !== strokeColor || selectedShape.width !== strokeWidth) {
            updatedShape = {
              ...selectedShape,
              stroke: strokeColor as any,
              width: strokeWidth,
            };
            hasChanges = true;
            lastUpdateRef.current = { shapeId: selectedShapeId, stroke: strokeColor, width: strokeWidth };
          }
        }

        if (hasChanges) {
          const updatedShapes = shapes.map(shape =>
            shape.id === selectedShapeId ? updatedShape : shape
          );
          onShapesChange(updatedShapes);
        }
      }
    } else {
      // 選択が解除されたらリセット
      lastUpdateRef.current = null;
    }
  }, [currentTool, selectedShapeId, strokeColor, strokeWidth, fontSize, fontBold, fontItalic, fontUnderline]);
  */

  const handleMouseLeave = () => {
    setPreviewPoint(null);
    setHoveredTextId(null);
    drawShapes();
  };

  // テキスト入力の確定
  const handleTextConfirm = (fromBlur = false) => {
    // onBlurからの呼び出しで、テキストパレットが開いている場合は確定しない
    if (fromBlur && textPalette) {
      return;
    }

    if (textInput && textInput.text.trim() !== '') {
      const latLng = pixelToLatLng(textInput.position.x, textInput.position.y);
      if (latLng) {
        // フォントサイズに応じてwidthを設定
        let width: 1 | 2 | 3 = 2; // デフォルトはmedium
        if (fontSize === 'small') width = 1;
        else if (fontSize === 'large') width = 3;

        if (textInput.shapeId) {
          // 編集モード：既存のテキストを更新
          const updatedShapes = shapes.map(shape => {
            if (shape.id === textInput.shapeId && shape.type === 'text') {
              return {
                ...shape,
                text: textInput.text,
              };
            }
            return shape;
          });
          onShapesChange(updatedShapes);
        } else {
          // 新規作成モード（pixelAtとLatLng両方を保存）
          const newShape: Shape = {
            id: `text-${Date.now()}`,
            type: 'text',
            stroke: strokeColor as '#000' | '#666' | '#c00',
            width: width,
            at: latLng,
            pixelAt: textInput.position,
            text: textInput.text,
            bold: fontBold,
            italic: fontItalic,
            underline: fontUnderline,
            background: textBackground,
            renderOn: currentPage,
          } as Shape;
          const newShapes = [...shapes, newShape];
          onShapesChange(newShapes);
        }
      }
    }
    setTextInput(null);
    setTextPalette(null);

    // テキスト確定後は編集ツールに切り替え
    if (onToolChange) {
      onToolChange('edit');
    }
  };

  // テキスト入力のキャンセル
  const handleTextCancel = () => {
    setTextInput(null);
  };

  // テキスト入力のキーハンドラ
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTextConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleTextCancel();
    }
  };

  // ダブルクリックでテキストを編集
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 編集ツールまたはテキストツールの時のみテキスト編集を許可
    if (currentTool !== 'edit' && currentTool !== 'text') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 論理座標に変換
    const { x, y } = toLogicalCoordinates(e.clientX, e.clientY);
    const point = { x, y };

    // 現在のページの図形のみをフィルター
    const currentPageShapes = shapes.filter((shape) => {
      if (!shape.renderOn) return currentPage === 'p1';
      return shape.renderOn === currentPage || shape.renderOn === 'both';
    });

    // テキストをダブルクリックしたかチェック
    for (let i = currentPageShapes.length - 1; i >= 0; i--) {
      const shape = currentPageShapes[i];
      if (shape.type === 'text') {
        const shapePixel = getShapePixels(shape);
        if (isPointNearShape(point, shapePixel, shape)) {
          // 編集モードに入る
          const position = latLngToPixel(shape.at);
          if (position) {
            setTextInput({
              position: { x: position.x, y: position.y },
              text: shape.text,
              shapeId: shape.id,
            });
            setSelectedShapeId(shape.id);

            // テキスト入力フィールドにフォーカスを設定
            setTimeout(() => {
              if (textInputRef.current) {
                textInputRef.current.focus();
                textInputRef.current.select(); // テキスト全選択
              }
            }, 50);
          }
          return;
        }
      }
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="overlay-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: currentTool === 'select' ? 'none' : 'auto',
          cursor: draggingShape ? 'move' :
                  currentTool === 'select' ? 'default' :
                  currentTool === 'edit' ? (hoveredShapeId ? 'pointer' : 'default') :
                  currentTool === 'text' ? (hoveredTextId ? 'move' : 'text') :
                  currentTool === 'delete' ? 'crosshair' :
                  'crosshair',
        }}
      />

      {/* テキスト入力フィールド */}
      {textInput && (
        <div
          style={{
            position: 'absolute',
            left: textInput.position.x,
            top: textInput.position.y,
            zIndex: 1000,
          }}
        >
          <input
            ref={textInputRef}
            type="text"
            value={textInput.text}
            onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
            onKeyDown={handleTextKeyDown}
            onBlur={() => handleTextConfirm(true)}
            style={{
              padding: '4px 8px',
              fontSize: fontSize === 'small' ? '12px' : fontSize === 'large' ? '24px' : '16px',
              color: strokeColor,
              border: '2px solid #007bff',
              borderRadius: '4px',
              outline: 'none',
              minWidth: '100px',
              backgroundColor: 'transparent',
              fontFamily: 'system-ui, "Noto Sans JP", sans-serif',
              fontWeight: fontBold ? 'bold' : 'normal',
              fontStyle: fontItalic ? 'italic' : 'normal',
              textDecoration: fontUnderline ? 'underline' : 'none',
              cursor: 'move',
            }}
          />
        </div>
      )}

      {/* カラーパレット */}
      {colorPalette && colorPalette.shapeId && (
        <ColorPalette
          position={colorPalette.position}
          strokeColor={(() => {
            const shape = shapes.find(s => s.id === colorPalette.shapeId);
            return shape?.stroke || strokeColor;
          })()}
          strokeWidth={(() => {
            const shape = shapes.find(s => s.id === colorPalette.shapeId);
            return shape?.width || strokeWidth;
          })()}
          strokeOpacity={(() => {
            const shape = shapes.find(s => s.id === colorPalette.shapeId);
            return shape?.strokeOpacity || 1.0;
          })()}
          fillColor={(() => {
            const shape = shapes.find(s => s.id === colorPalette.shapeId);
            return (shape as any)?.fill || '';
          })()}
          fillOpacity={(() => {
            const shape = shapes.find(s => s.id === colorPalette.shapeId);
            return (shape as any)?.fillOpacity || 0.3;
          })()}
          onStrokeColorChange={(color) => {
            if (colorPalette.shapeId) {
              const updatedShapes = shapes.map(s =>
                s.id === colorPalette.shapeId
                  ? { ...s, stroke: color as any }
                  : s
              );
              onShapesChange(updatedShapes);
            }
          }}
          onStrokeWidthChange={(width) => {
            if (colorPalette.shapeId) {
              const updatedShapes = shapes.map(s =>
                s.id === colorPalette.shapeId
                  ? { ...s, width }
                  : s
              );
              onShapesChange(updatedShapes);
            }
          }}
          onStrokeOpacityChange={(opacity) => {
            if (colorPalette.shapeId) {
              const updatedShapes = shapes.map(s =>
                s.id === colorPalette.shapeId
                  ? { ...s, strokeOpacity: opacity }
                  : s
              );
              onShapesChange(updatedShapes);
            }
          }}
          onFillColorChange={(color) => {
            if (colorPalette.shapeId) {
              const updatedShapes = shapes.map(s =>
                s.id === colorPalette.shapeId
                  ? { ...s, fill: color || undefined, fillOpacity: color ? (s as any).fillOpacity || 0.3 : undefined }
                  : s
              );
              onShapesChange(updatedShapes);
            }
          }}
          onFillOpacityChange={(opacity) => {
            if (colorPalette.shapeId) {
              const updatedShapes = shapes.map(s =>
                s.id === colorPalette.shapeId
                  ? { ...s, fillOpacity: opacity }
                  : s
              );
              onShapesChange(updatedShapes);
            }
          }}
          onClose={() => setColorPalette(null)}
          showFill={colorPalette.showFill}
          hideOpacity={colorPalette.hideOpacity}
          mapBounds={(() => {
            const canvas = canvasRef.current;
            if (!canvas) return undefined;
            const rect = canvas.getBoundingClientRect();
            return {
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom
            };
          })()}
        />
      )}

      {/* テキストパレット */}
      {textPalette && onStrokeColorChange && onFontSizeChange && onFontBoldChange && onFontItalicChange && onFontUnderlineChange && onTextBackgroundChange && (
        <TextPalette
          position={textPalette.position}
          strokeColor={strokeColor}
          fontSize={fontSize}
          fontBold={fontBold}
          fontItalic={fontItalic}
          fontUnderline={fontUnderline}
          textBackground={textBackground}
          onStrokeColorChange={onStrokeColorChange}
          onFontSizeChange={onFontSizeChange}
          onFontBoldChange={onFontBoldChange}
          onFontItalicChange={onFontItalicChange}
          onFontUnderlineChange={onFontUnderlineChange}
          onTextBackgroundChange={onTextBackgroundChange}
          onClose={() => setTextPalette(null)}
          mapBounds={(() => {
            const canvas = canvasRef.current;
            if (!canvas) return undefined;
            const rect = canvas.getBoundingClientRect();
            return {
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom
            };
          })()}
        />
      )}
    </>
  );
}