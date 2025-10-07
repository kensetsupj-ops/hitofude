# 現在のサイズ測定結果

## 1. 編集時（画面表示）のサイズ

### レイアウト構造（1920x1080基準）

#### ヘッダー・ツールバー
- ヘッダー: 52px（固定）
- ツールバー: 52px（固定）
- パディング(top): 10px

#### 横方向のレイアウト
- 左側広告スペース: 160px（固定）
- 中央コンテンツ: flex: 1（動的）
  - 地図コンテナ: flex: 1（動的）⚠️
  - サイドバー: 380px（固定）
  - gap: 10px
- 右側広告スペース: 160px（固定）
- パディング(left/right): 10px x 2 = 20px

#### 地図コンテナのサイズ計算（1920px幅の場合）
```
総幅: 1920px
- 左広告: 160px
- 右広告: 160px
- サイドバー: 380px
- gap: 10px x 2 = 20px
- padding: 10px x 2 = 20px
= 地図幅: 1180px ⚠️ モニターサイズに依存
```

```
総高さ: 1080px
- ヘッダー: 52px
- ツールバー: 52px
- パディング(bottom): 10px
= 地図高さ: 966px ⚠️ モニターサイズに依存
```

**問題点**:
- 地図コンテナが `flex: 1` で画面サイズに追従
- 大画面（例：2560x1440）では地図が巨大化
- キャンバスサイズが動的に変化し、描画位置がずれる

---

## 2. 印刷プレビュー時のサイズ

### レイアウト構造
- 全体幅: `max-width: 1050px`（固定）
- 中央配置: `margin: 10px auto`
- パディング: `padding: 10px 15px`

### グリッドレイアウト
```
grid-template-columns: 60% 40%
gap: 15px
```

### 地図コンテナのサイズ計算
```
全体幅: 1050px
- padding: 15px x 2 = 30px
= コンテンツ幅: 1020px

左カラム（地図）: 1020px x 60% = 612px
右カラム（情報）: 1020px x 40% - 15px(gap) = 393px
```

### 地図の実際のサイズ
```
地図幅: 612px
地図高さ: 612px / aspectRatio
  - aspectRatio = 1.6（デフォルト）の場合: 612 / 1.6 = 383px
  - A4横比（1.414）の場合: 612 / 1.414 = 433px
```

アスペクト比は編集画面の地図コンテナサイズから計算:
```javascript
const aspectRatio = editMapWidth / editMapHeight;
paddingBottom: `${(100 / aspectRatio) || 62.5}%`
```

---

## 3. 印刷時（@media print）のサイズ

### 用紙設定
```css
@page {
  size: A4 landscape; /* 297mm x 210mm */
  margin: 10mm;
}
```

### 印刷可能領域
```
用紙: 297mm x 210mm
- margin: 10mm x 4 = 40mm(左右) + 40mm(上下)
= 印刷可能領域: 277mm x 190mm
```

### グリッドレイアウト（印刷時）
```css
.print-main-content {
  grid-template-columns: 60% 40% !important;
  gap: 15px !important;
}
```

### 地図の物理サイズ
```
印刷幅: 277mm
左カラム（地図）: 277mm x 60% = 166mm
右カラム（情報）: 277mm x 40% - 15mm(gap) = 96mm

地図高さ: 166mm / aspectRatio
  - aspectRatio = 1.6の場合: 166 / 1.6 = 104mm
  - A4横比（1.414）の場合: 166 / 1.414 = 117mm
```

**重要**: 印刷時の地図サイズは**編集画面のアスペクト比に依存**

---

## 問題点のまとめ

### 編集時の問題
1. ✗ 地図コンテナが `flex: 1` で画面サイズに追従
2. ✗ 大画面ではキャンバスが巨大化（例：2560px → 地図幅1800px+）
3. ✗ 描画位置がモニターサイズでずれる
4. ✗ キャンバスの論理座標系が一定でない

### 印刷プレビュー・印刷時の問題
1. ✗ 編集画面のアスペクト比が変わると印刷レイアウトも変わる
2. ✗ 大画面で編集 → 印刷すると意図しないレイアウトになる可能性

---

## 解決方針（Figma方式）

### 基本方針
論理座標系を固定し、表示サイズのみ可変にする

### 基準サイズ
- **論理サイズ**: 1400x990px（A4横比 297:210 ≈ 1.414）
- **表示サイズ上限**: 1200x848px（余裕を持たせる）
- **最小サイズ**: 800x565px（小画面対応）

### 実装方針

#### 1. 地図コンテナの固定
```css
.map-container {
  max-width: 1200px;
  aspect-ratio: 1400 / 990; /* A4横比 */
  margin: 0 auto; /* 大画面では中央配置 */
}
```

#### 2. キャンバス論理サイズの固定
```javascript
const LOGICAL_WIDTH = 1400;
const LOGICAL_HEIGHT = 990;

canvas.width = LOGICAL_WIDTH * devicePixelRatio;
canvas.height = LOGICAL_HEIGHT * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);

// CSS表示サイズは親に合わせる
canvas.style.width = '100%';
canvas.style.height = '100%';
```

#### 3. 座標変換処理
```javascript
// マウス座標 → 論理座標
const toLogical = (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = LOGICAL_WIDTH / rect.width;
  const scaleY = LOGICAL_HEIGHT / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
};
```

### 期待される効果
- ✓ どのモニターサイズでも同じ論理サイズで描画
- ✓ 描画位置のずれが解消
- ✓ 印刷時のレイアウトが一定
- ✓ 標準画面（1920x1080）では見た目がほぼ変わらない
