export type LatLng = { lat: number; lng: number };
export type Pixel = { x: number; y: number };

export type ShapeType = 'arrow' | 'line' | 'circle' | 'rect' | 'text' | 'freehand' | 'polyarrow' | 'polygon' | 'marker';

export type RenderTarget = 'p1' | 'p2' | 'both';

export interface ShapeBase {
  id: string;
  type: ShapeType;
  stroke: '#000' | '#666' | '#c00';
  width: 1 | 2 | 3;
  strokeOpacity?: number; // 線の不透明度 (0-1)
  renderOn?: RenderTarget;
  fill?: string; // 塗りつぶし色 (透明の場合は undefined)
  fillOpacity?: number; // 塗りつぶしの不透明度 (0-1)
}

export interface Arrow extends ShapeBase {
  type: 'arrow';
  a: LatLng;
  b: LatLng;
  // ピクセル座標（画面固定用）
  pixelA?: Pixel;
  pixelB?: Pixel;
}

export interface Line extends ShapeBase {
  type: 'line';
  a: LatLng;
  b: LatLng;
  // ピクセル座標（画面固定用）
  pixelA?: Pixel;
  pixelB?: Pixel;
}

export interface Circle extends ShapeBase {
  type: 'circle';
  center: LatLng;
  radiusM: number;
  // ピクセル座標（画面固定用）
  pixelCenter?: Pixel;
  pixelRadius?: number;
}

export interface Rect extends ShapeBase {
  type: 'rect';
  a: LatLng;
  b: LatLng;
  // ピクセル座標（画面固定用）
  pixelA?: Pixel;
  pixelB?: Pixel;
}

export interface Text extends ShapeBase {
  type: 'text';
  at: LatLng;
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  background?: 'transparent' | 'white';
  // ピクセル座標（画面固定用）
  pixelAt?: Pixel;
}

export interface Freehand extends ShapeBase {
  type: 'freehand';
  pts: LatLng[];
  // ピクセル座標（画面固定用）
  pixelPts?: Pixel[];
}

export interface PolyArrow extends ShapeBase {
  type: 'polyarrow';
  pts: LatLng[];
  // ピクセル座標（画面固定用）
  pixelPts?: Pixel[];
}

export interface Polygon extends ShapeBase {
  type: 'polygon';
  pts: LatLng[];
  // ピクセル座標（画面固定用）
  pixelPts?: Pixel[];
}

export interface Marker extends ShapeBase {
  type: 'marker';
  at: LatLng;
  // ピクセル座標（画面固定用）
  pixelAt?: Pixel;
}

export type Shape = Arrow | Line | Circle | Rect | Text | Freehand | PolyArrow | Polygon | Marker;

export interface GuideMeta {
  title: string;
  date?: string;
  time?: string;
  address?: string;
  site?: string;
  supervisor?: string;
  phone?: string;
  gather?: string;
  arrive?: string;
  unload?: string;
  leave?: string;
  vehicle?: string;
  units?: number;
  gross_t?: number;
  load?: string;
  h_limit_mm?: number;
  w_limit_m?: number;
  notes?: string;
}

export interface GuideMap {
  center: LatLng;
  zoom: number;
  type: 'roadmap' | 'satellite';
  markerPosition?: LatLng;  // 住所検索時のマーカー位置
}

export interface GuideOverview {
  enabled: boolean;
  zoom?: number;
  delta?: number;
  radiusM?: number;
}

export interface Guide {
  meta: GuideMeta;
  map: GuideMap;
  overview?: GuideOverview;
  shapes: Shape[];
}

export type Tool = 'select' | 'edit' | 'arrow' | 'line' | 'circle' | 'rect' | 'text' | 'freehand' | 'delete' | 'polyarrow' | 'polygon' | 'marker';

export type PageView = 'p1' | 'p2';