import { PDFDocument, PDFPage, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Guide, Shape } from './types';

interface PDFGeneratorOptions {
  guide: Guide;
  includeOverview: boolean;
  mapBounds?: { north: number; south: number; east: number; west: number } | null;
}

// Static Maps APIのURL生成
function getStaticMapUrl(
  center: { lat: number; lng: number },
  zoom: number,
  width: number,
  height: number,
  markers?: { lat: number; lng: number }[]
): string {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';

  const params = new URLSearchParams({
    center: `${center.lat},${center.lng}`,
    zoom: zoom.toString(),
    size: `${width}x${height}`,
    scale: '2',
    format: 'png',
    maptype: 'roadmap',
    language: 'ja',
    region: 'JP',
    key: apiKey,
  });

  // マーカーを追加
  if (markers && markers.length > 0) {
    markers.forEach(marker => {
      params.append('markers', `color:red|${marker.lat},${marker.lng}`);
    });
  }

  return `${baseUrl}?${params.toString()}`;
}

// 画像を取得してPDFに埋め込み
async function fetchAndEmbedImage(
  pdfDoc: PDFDocument,
  imageUrl: string
): Promise<any> {
  try {
    const response = await fetch(imageUrl);
    const imageBytes = await response.arrayBuffer();
    const image = await pdfDoc.embedPng(new Uint8Array(imageBytes));
    return image;
  } catch (error) {
    return null;
  }
}

// 注釈（図形）をPDFページに描画
function drawShapes(
  page: PDFPage,
  shapes: Shape[],
  mapBounds: { north: number; south: number; east: number; west: number },
  mapX: number,
  mapY: number,
  mapWidth: number,
  mapHeight: number,
  renderTarget: 'p1' | 'p2'
) {
  shapes.forEach(shape => {
    // renderOnプロパティに基づいてフィルタリング
    const shouldRender =
      !shape.renderOn ||
      shape.renderOn === 'both' ||
      shape.renderOn === renderTarget;

    if (!shouldRender) return;

    // Convert hex color to RGB (support both short and full hex formats)
    const strokeHex = shape.stroke.replace('#', '');
    let strokeColor;

    if (strokeHex === '000' || strokeHex === '000000') {
      strokeColor = rgb(0, 0, 0);
    } else if (strokeHex === '666' || strokeHex === '666666') {
      strokeColor = rgb(0.4, 0.4, 0.4);
    } else if (strokeHex === 'c00' || strokeHex === 'cc0000' || strokeHex === 'FF0000') {
      strokeColor = rgb(1, 0, 0);
    } else if (strokeHex === '0066FF') {
      strokeColor = rgb(0, 0.4, 1);
    } else if (strokeHex === '00AA00') {
      strokeColor = rgb(0, 0.67, 0);
    } else {
      // Default to black
      strokeColor = rgb(0, 0, 0);
    }

    const lineWidth = shape.width;

    // 緯度経度をPDF座標に変換
    const latLngToPageCoords = (lat: number, lng: number) => {
      const x = mapX + ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * mapWidth;
      const y = mapY + ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * mapHeight;
      return { x, y };
    };

    switch (shape.type) {
      case 'arrow':
      case 'line': {
        const start = latLngToPageCoords(shape.a.lat, shape.a.lng);
        const end = latLngToPageCoords(shape.b.lat, shape.b.lng);

        page.drawLine({
          start: { x: start.x, y: start.y },
          end: { x: end.x, y: end.y },
          thickness: lineWidth,
          color: strokeColor,
        });

        // 矢印の矢羽を描画
        if (shape.type === 'arrow') {
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          const arrowLength = 10;
          const arrowAngle = Math.PI / 6;

          page.drawLine({
            start: { x: end.x, y: end.y },
            end: {
              x: end.x - arrowLength * Math.cos(angle - arrowAngle),
              y: end.y - arrowLength * Math.sin(angle - arrowAngle),
            },
            thickness: lineWidth,
            color: strokeColor,
          });

          page.drawLine({
            start: { x: end.x, y: end.y },
            end: {
              x: end.x - arrowLength * Math.cos(angle + arrowAngle),
              y: end.y - arrowLength * Math.sin(angle + arrowAngle),
            },
            thickness: lineWidth,
            color: strokeColor,
          });
        }
        break;
      }

      case 'circle': {
        const center = latLngToPageCoords(shape.center.lat, shape.center.lng);
        // メートルをピクセルに変換（簡略化）
        const radiusInPixels = (shape.radiusM / 100) * (mapWidth / 10);

        page.drawCircle({
          x: center.x,
          y: center.y,
          size: radiusInPixels,
          borderColor: strokeColor,
          borderWidth: lineWidth,
        });
        break;
      }

      case 'rect': {
        const topLeft = latLngToPageCoords(shape.a.lat, shape.a.lng);
        const bottomRight = latLngToPageCoords(shape.b.lat, shape.b.lng);

        page.drawRectangle({
          x: Math.min(topLeft.x, bottomRight.x),
          y: Math.min(topLeft.y, bottomRight.y),
          width: Math.abs(bottomRight.x - topLeft.x),
          height: Math.abs(bottomRight.y - topLeft.y),
          borderColor: strokeColor,
          borderWidth: lineWidth,
        });
        break;
      }

      case 'text': {
        const pos = latLngToPageCoords(shape.at.lat, shape.at.lng);

        // Calculate font size based on width property
        let fontSize = 16;
        if (shape.width === 1) fontSize = 12;
        else if (shape.width === 2) fontSize = 16;
        else if (shape.width === 3) fontSize = 24;

        page.drawText(shape.text, {
          x: pos.x,
          y: pos.y,
          size: fontSize,
          color: strokeColor,
        });

        // Draw underline if needed
        if (shape.underline) {
          const textWidth = shape.text.length * fontSize * 0.5; // Approximate text width
          page.drawLine({
            start: { x: pos.x, y: pos.y - 2 },
            end: { x: pos.x + textWidth, y: pos.y - 2 },
            thickness: Math.max(1, fontSize / 16),
            color: strokeColor,
          });
        }
        break;
      }

      case 'freehand': {
        if (shape.pts.length > 1) {
          for (let i = 1; i < shape.pts.length; i++) {
            const start = latLngToPageCoords(shape.pts[i - 1].lat, shape.pts[i - 1].lng);
            const end = latLngToPageCoords(shape.pts[i].lat, shape.pts[i].lng);

            page.drawLine({
              start: { x: start.x, y: start.y },
              end: { x: end.x, y: end.y },
              thickness: lineWidth,
              color: strokeColor,
            });
          }
        }
        break;
      }
    }
  });
}

// 日本語フォントの取得と埋め込み
async function embedJapaneseFont(pdfDoc: PDFDocument) {
  try {
    // Noto Sans JP（Regular）をGoogle Fontsから取得
    const fontUrl = 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    const font = await pdfDoc.embedFont(fontBytes);
    return font;
  } catch (error) {
    // フォールバック：標準フォントを返す（日本語は表示されないが、エラーは回避）
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
}

export async function generatePDF(options: PDFGeneratorOptions): Promise<Uint8Array> {
  const { guide, includeOverview, mapBounds } = options;

  // PDFドキュメントを作成
  const pdfDoc = await PDFDocument.create();

  // fontkitを登録（カスタムフォントの埋め込みに必要）
  pdfDoc.registerFontkit(fontkit);

  // 日本語フォントを埋め込み
  const font = await embedJapaneseFont(pdfDoc);
  const boldFont = font; // Noto Sans JPはRegularのみ使用（太字はサイズで代用）

  // ページ1（詳細図）
  const page1 = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]); // A4横
  const { width, height } = page1.getSize();
  const margin = 28; // 10mm

  // ヘッダー描画
  page1.drawText(guide.meta.title || '搬入案内', {
    x: margin,
    y: height - margin - 20,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // 日付・時間
  if (guide.meta.date || guide.meta.time) {
    const dateTime = `${guide.meta.date || ''} ${guide.meta.time || ''}`.trim();
    page1.drawText(dateTime, {
      x: margin,
      y: height - margin - 45,
      size: 12,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // 住所
  if (guide.meta.address) {
    page1.drawText(`住所: ${guide.meta.address}`, {
      x: margin,
      y: height - margin - 65,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  // 連絡先
  if (guide.meta.phone) {
    page1.drawText(`当日直通: ${guide.meta.phone}`, {
      x: margin,
      y: height - margin - 85,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  // 地図領域の計算（左側65%に配置）
  const mapX = margin;
  const mapY = margin + 100;
  const mapWidth = width * 0.65 - margin * 1.5;
  const mapHeight = height - margin * 2 - 140;

  // Static Maps APIから地図画像を取得
  const staticMapUrl = getStaticMapUrl(
    guide.map.center,
    guide.map.zoom,
    Math.floor(mapWidth * 2),
    Math.floor(mapHeight * 2),
    guide.meta.address ? [guide.map.center] : undefined
  );

  const mapImage = await fetchAndEmbedImage(pdfDoc, staticMapUrl);

  if (mapImage) {
    // 地図画像を描画
    page1.drawImage(mapImage, {
      x: mapX,
      y: mapY,
      width: mapWidth,
      height: mapHeight,
    });

    // 注釈を描画
    if (mapBounds) {
      drawShapes(page1, guide.shapes, mapBounds, mapX, mapY, mapWidth, mapHeight, 'p1');
    }
  } else {
    // フォールバック：地図が取得できない場合
    page1.drawRectangle({
      x: mapX,
      y: mapY,
      width: mapWidth,
      height: mapHeight,
      borderColor: rgb(0.6, 0.6, 0.6),
      borderWidth: 1,
    });

    page1.drawText('地図を表示できませんでした', {
      x: mapX + mapWidth / 2 - 80,
      y: mapY + mapHeight / 2,
      size: 14,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  // 右側の情報パネル（右側35%に配置）
  const infoX = width * 0.65 + margin / 2;
  const infoY = height - margin - 120;
  const infoWidth = width * 0.35 - margin * 1.5;

  // スケジュール
  if (guide.meta.gather || guide.meta.arrive || guide.meta.unload || guide.meta.leave) {
    page1.drawText('スケジュール', {
      x: infoX,
      y: infoY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    let scheduleY = infoY - 25;
    const scheduleItems = [
      { label: '集合時間', value: guide.meta.gather },
      { label: '到着時間', value: guide.meta.arrive },
      { label: '荷下ろし', value: guide.meta.unload },
      { label: '退出予定', value: guide.meta.leave },
    ];

    scheduleItems.forEach(item => {
      if (item.value) {
        page1.drawText(`${item.label}: ${item.value}`, {
          x: infoX + 10,
          y: scheduleY,
          size: 11,
          font: font,
          color: rgb(0, 0, 0),
        });
        scheduleY -= 20;
      }
    });
  }

  // 車両・制限
  let vehicleY = infoY - 140;
  if (guide.meta.vehicle || guide.meta.h_limit_mm || guide.meta.w_limit_m) {
    page1.drawText('車両・制限', {
      x: infoX,
      y: vehicleY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    vehicleY -= 25;
    if (guide.meta.vehicle) {
      page1.drawText(`車両: ${guide.meta.vehicle}`, {
        x: infoX + 10,
        y: vehicleY,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
      vehicleY -= 20;
    }

    if (guide.meta.h_limit_mm) {
      page1.drawText(`高さ制限: ${guide.meta.h_limit_mm}mm`, {
        x: infoX + 10,
        y: vehicleY,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
      vehicleY -= 20;
    }

    if (guide.meta.w_limit_m) {
      page1.drawText(`幅制限: ${guide.meta.w_limit_m}m`, {
        x: infoX + 10,
        y: vehicleY,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      });
      vehicleY -= 20;
    }
  }

  // 注意事項
  if (guide.meta.notes) {
    const notesY = vehicleY - 40;
    page1.drawText('注意事項', {
      x: infoX,
      y: notesY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    const noteLines = guide.meta.notes.split('\n');
    let noteY = notesY - 25;
    noteLines.forEach(line => {
      if (line.trim()) {
        // 長い行は折り返し
        const maxWidth = infoWidth - 20;
        const words = line.split('');
        let currentLine = '';
        let charWidth = 6; // 概算の文字幅

        for (const char of words) {
          if ((currentLine.length * charWidth) > maxWidth) {
            page1.drawText(currentLine, {
              x: infoX + 10,
              y: noteY,
              size: 10,
              font: font,
              color: rgb(0, 0, 0),
            });
            noteY -= 15;
            currentLine = char;
          } else {
            currentLine += char;
          }
        }

        if (currentLine) {
          page1.drawText(currentLine, {
            x: infoX + 10,
            y: noteY,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          noteY -= 20;
        }
      }
    });
  }

  // フッター（帰属表示）
  page1.drawText('地図: Google Maps', {
    x: margin,
    y: margin,
    size: 8,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  // ページ2（周辺図）- オプション
  if (includeOverview) {
    const page2 = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    const { width: width2, height: height2 } = page2.getSize();

    // 簡単なヘッダー
    page2.drawText(guide.meta.title || '搬入案内（周辺図）', {
      x: margin,
      y: height2 - margin - 20,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    if (guide.meta.address) {
      page2.drawText(guide.meta.address, {
        x: margin,
        y: height2 - margin - 40,
        size: 12,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    // 全面地図
    const map2X = margin;
    const map2Y = margin;
    const map2Width = width2 - margin * 2;
    const map2Height = height2 - margin * 2 - 60;

    // 周辺図用のズーム（3段階ズームアウト）
    const overviewZoom = Math.max(11, guide.map.zoom - 3);

    const staticMap2Url = getStaticMapUrl(
      guide.map.center,
      overviewZoom,
      Math.floor(map2Width * 2),
      Math.floor(map2Height * 2),
      guide.meta.address ? [guide.map.center] : undefined
    );

    const map2Image = await fetchAndEmbedImage(pdfDoc, staticMap2Url);

    if (map2Image) {
      page2.drawImage(map2Image, {
        x: map2X,
        y: map2Y,
        width: map2Width,
        height: map2Height,
      });

      // 周辺図用の注釈（矢印、線、円のみ）
      if (mapBounds) {
        // 周辺図用のboundsを計算（簡略化）
        const zoomDiff = guide.map.zoom - overviewZoom;
        const scale = Math.pow(2, zoomDiff);
        const overviewBounds = {
          north: guide.map.center.lat + (mapBounds.north - guide.map.center.lat) * scale,
          south: guide.map.center.lat + (mapBounds.south - guide.map.center.lat) * scale,
          east: guide.map.center.lng + (mapBounds.east - guide.map.center.lng) * scale,
          west: guide.map.center.lng + (mapBounds.west - guide.map.center.lng) * scale,
        };

        // 周辺図では矢印、線、円のみを表示
        const overviewShapes = guide.shapes.filter(s =>
          s.type === 'arrow' || s.type === 'line' || s.type === 'circle'
        );

        drawShapes(page2, overviewShapes, overviewBounds, map2X, map2Y, map2Width, map2Height, 'p2');
      }
    }

    // フッター
    page2.drawText('地図: Google Maps', {
      x: margin,
      y: margin - 10,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });
  }

  // PDFバイト配列を返す
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function printPDF(pdfBytes: Uint8Array, fileName: string) {
  // Blobを作成（Uint8Arrayをそのまま渡す - 新しいArrayBufferビューを作成）
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  // 新しいウィンドウでPDFを開いて印刷
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }

  // クリーンアップ（少し遅延させる）
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}

export async function downloadPDF(pdfBytes: Uint8Array, fileName: string) {
  // Blobを作成してダウンロード（Uint8Arrayをそのまま渡す - 新しいArrayBufferビューを作成）
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();

  // クリーンアップ
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}