# 印刷時の地図範囲サイズ分析

## 前提条件

編集画面の地図コンテナサイズ（mapContainerSize）を仮定：
- 幅: 1170px（または実測値）
- 高さ: 966px（または実測値）
- アスペクト比: 1170 / 966 = 1.211

---

## 1. Static Maps APIで取得する地図画像のサイズ

### コード（PrintLayout.tsx:341-357）
```javascript
const editMapWidth = Math.round(mapContainerSize?.width || 640);  // 1170px
const editMapHeight = Math.round(mapContainerSize?.height || 400); // 966px

let staticMapWidth = editMapWidth;   // 1170px
let staticMapHeight = editMapHeight; // 966px

// 640x640を超える場合は縮小
if (staticMapWidth > 640 || staticMapHeight > 640) {
  const scaleFactor = Math.min(640 / staticMapWidth, 640 / staticMapHeight);
  staticMapWidth = Math.round(staticMapWidth * scaleFactor);
  staticMapHeight = Math.round(staticMapHeight * scaleFactor);
}
```

### 計算
```
1170 > 640 → 縮小が必要

scaleFactor = min(640/1170, 640/966)
           = min(0.547, 0.663)
           = 0.547

staticMapWidth  = 1170 × 0.547 = 640px
staticMapHeight = 966 × 0.547 = 528px
```

**→ Static Maps API: 640x528px (scale=1)**

---

## 2. 印刷プレビュー画面での表示サイズ

### レイアウト（PrintLayout.tsx:525-641）
```javascript
// 全体
max-width: 1050px
padding: 10px 15px

// グリッド
grid-template-columns: 60% 40%
gap: 15px

// 地図コンテナ
paddingBottom: `${(100 / aspectRatio) || 62.5}%`
```

### 計算
```
全体幅: 1050px
- padding: 15px × 2 = 30px
= コンテンツ幅: 1020px

左カラム（地図）: 1020px × 60% = 612px

地図高さ:
paddingBottom = 100 / 1.211 = 82.6%
高さ = 612px × 0.826 = 505px
```

**→ プレビュー表示: 612px × 505px**

**画像の扱い**: 640x528pxの画像を612x505pxに縮小表示

---

## 3. 実際の印刷時の物理サイズ

### 用紙設定（@media print）
```css
@page {
  size: A4 landscape;  /* 297mm × 210mm */
  margin: 10mm;
}
```

### 印刷可能領域
```
用紙: 297mm × 210mm
余白: 10mm × 4辺
印刷可能領域: (297-20)mm × (210-20)mm = 277mm × 190mm
```

### グリッドレイアウト
```css
.print-main-content {
  grid-template-columns: 60% 40% !important;
  gap: 15px !important;
}
```

### 計算
```
印刷可能幅: 277mm

左カラム（地図）: 277mm × 60% = 166.2mm
gap: 15px ≈ 4mm (96dpi換算: 15px / 96 * 25.4mm)
右カラム: 277mm × 40% ≈ 110.8mm

地図高さ:
アスペクト比 = 1.211
高さ = 166.2mm / 1.211 = 137.2mm
```

**→ 印刷サイズ: 166mm × 137mm**

**画像の扱い**: 640x528pxの画像を166x137mm（約622x513px @96dpi）に拡大表示

---

## まとめ

| 段階 | 地図範囲のサイズ | 備考 |
|------|----------------|------|
| **編集画面** | 1170px × 966px | mapContainerSize（可変）|
| **Static Maps API** | 640px × 528px | 640x640制限により縮小 |
| **印刷プレビュー（画面）** | 612px × 505px | 1050px幅の60%カラム |
| **実際の印刷（A4横）** | 166mm × 137mm | 物理サイズ、約622x513px相当 |

---

## 問題点

1. **編集画面が大きいと画質劣化**
   - 例：2560px幅画面 → 編集画面1800px → Static Maps 640px
   - 640pxに縮小されるため、編集画面での見た目より粗くなる

2. **編集画面が小さいと印刷時に拡大**
   - 例：編集画面500px → Static Maps 500px → 印刷時622px相当
   - 拡大により画質が悪化

3. **アスペクト比の不整合**
   - 編集画面のアスペクト比（画面依存）が印刷レイアウトに影響
   - 大画面と小画面で印刷結果が異なる

---

## 解決策

**編集画面の地図サイズを固定**すれば：
- Static Maps APIのサイズも固定
- 印刷時のアスペクト比も固定
- 画質が一定（ただし640x640制限あり）

例：1170px × 966px に固定
- Static Maps: 640px × 528px（常に同じ）
- 印刷: 166mm × 137mm（常に同じ）
