# 搬入経路図ツール (Delivery Guide)

Next.js + Google Maps で作られた、搬入経路図作成ツールです。

## 主な機能

- **Google Maps上での描画**
  - 矢印、直線、円、四角、ポリライン、ポリゴン、マーカー、テキスト、フリーハンド
  - 線の色（黒/グレー/赤）、太さ（3段階）、透明度調整
  - 塗りつぶし（円・四角・ポリゴン対応）

- **住所検索**
  - 現場住所を入力すると地図が自動的に該当場所へ移動
  - Googleマップとの連携

- **印刷・PDF保存**
  - A4横 1ページレイアウト
  - 案件情報・スケジュール・車両制限・注意事項を含む
  - ブラウザ印刷機能でPDF保存可能

- **データ共有**
  - URLパラメータで基本情報を共有
  - JSONエクスポート/インポートで図形データを保存

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local.example` を `.env.local` にコピーし、Google Maps API キーを設定:

```bash
cp .env.local.example .env.local
```

`.env.local` を編集:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=あなたのAPIキー
```

**Google Maps API キーの取得方法:**
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択
3. 以下のAPIを有効化:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Static Maps API
4. 認証情報からAPIキーを作成
5. HTTPリファラーで使用するドメインを制限（推奨）

### 3. 開発サーバーの起動
```bash
npm run dev
```

ブラウザで `http://localhost:3000/tools/delivery-guide` を開く

### 4. ビルド
```bash
npm run build
npm start
```

## ディレクトリ構成

```
delivery-guide/
├── app/
│   ├── tools/delivery-guide/  # メインページ
│   ├── contact/               # お問い合わせ
│   ├── privacy/               # プライバシーポリシー
│   └── terms/                 # 利用規約
├── components/
│   ├── MapView.tsx           # Google Maps表示
│   ├── OverlayCanvas.tsx     # 描画キャンバス
│   ├── Toolbar.tsx           # ツールバー
│   ├── Sidebar.tsx           # 情報パネル
│   ├── ColorPalette.tsx      # カラーパレット
│   ├── TextPalette.tsx       # テキストパレット
│   └── PrintLayout.tsx       # 印刷レイアウト
├── lib/
│   ├── types.ts              # 型定義
│   └── pdf-generator.ts      # PDF生成
└── public/                   # 静的ファイル
```

## 使い方

### 基本操作

1. **住所の入力**: 右パネルの「現場住所」に住所を入力し、「検索」ボタンをクリック
2. **描画ツールの選択**: ツールバーから矢印、円、テキストなどを選択
3. **図形の描画**: 地図上をクリック・ドラッグして描画
4. **色・太さの変更**: 図形を選択するとカラーパレットが表示
5. **情報の入力**: 右パネルにスケジュールや注意事項を入力
6. **印刷**: ツールバーの「印刷」ボタンをクリック

### キーボードショートカット

- `V` - 選択ツール
- `A` - 矢印
- `L` - 直線
- `C` - 円
- `R` - 四角
- `T` - テキスト
- `M` - マーカー
- `E` - 削除ツール
- `Z` - 元に戻す
- `Y` - やり直す
- `P` - 印刷

## デプロイ

### Vercel (推奨)
1. GitHubリポジトリをVercelにインポート
2. 環境変数 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を設定
3. デプロイ

### その他のプラットフォーム
Next.js 15をサポートする任意のプラットフォームで動作します。

## 技術スタック

- **Framework**: Next.js 15.5.4 (App Router)
- **言語**: TypeScript
- **地図**: Google Maps JavaScript API
- **UI**: React 19
- **PDF生成**: html2pdf.js, pdf-lib
- **スタイリング**: CSS (Tailwind未使用)

## ライセンス

私的利用のみ

## お問い合わせ

プロジェクトに関するお問い合わせは、リポジトリのIssuesからお願いします。