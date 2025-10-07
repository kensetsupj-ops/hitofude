# 地図サイズの再計算

## 横幅の計算（1920px画面）

### レイアウト構造
```
[padding-left: 10px]
  [ad-left: 160px]
  [gap: 10px]
  [center-content: flex]
    [map: flex]
    [gap: 10px]
    [sidebar: 380px]
  [gap: 10px]
  [ad-right: 160px]
[padding-right: 10px]
```

### 計算
```
総幅: 1920px

固定要素:
- padding-left: 10px
- ad-left: 160px
- gap(ad-left → center): 10px
- gap(center → ad-right): 10px
- ad-right: 160px
- padding-right: 10px

固定要素合計: 10 + 160 + 10 + 10 + 160 + 10 = 360px

center-content幅: 1920 - 360 = 1560px

center-content内部:
- map: flex
- gap: 10px
- sidebar: 380px

地図幅: 1560 - 10 - 380 = 1170px ⚠️
```

**修正**: 地図幅は **1170px**（1180pxではない）

## 高さの計算（1080px画面）

### 計算
```
総高さ: 1080px

固定要素:
- ヘッダー: 52px
- ツールバー: 52px
- padding-bottom: 10px

合計: 52 + 52 + 10 = 114px

地図高さ: 1080 - 114 = 966px ✓
```

**確認**: 地図高さは **966px**（正しい）

## 結論

**正しい地図サイズ: 1170px × 966px**

アスペクト比: 1170 / 966 ≈ 1.211
