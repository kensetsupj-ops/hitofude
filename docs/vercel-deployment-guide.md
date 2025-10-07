# Vercelデプロイ手順書

このドキュメントでは、ひとふで（hitofude.net）をVercelにデプロイする手順を説明します。

## 目次

1. [前提条件](#前提条件)
2. [必要な環境変数](#必要な環境変数)
3. [デプロイ手順](#デプロイ手順)
4. [デプロイ後の確認](#デプロイ後の確認)
5. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

### 必須要件

- **Vercelアカウント**: [https://vercel.com/signup](https://vercel.com/signup)
- **GitHubリポジトリ**: プロジェクトがGitHubにプッシュされていること
- **環境変数**: 必要なAPIキーやトークンが準備済みであること

### 準備すべき環境変数

以下の環境変数を事前に取得しておいてください：

#### 必須

1. **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
   - Google Cloud Consoleから取得
   - 有効化が必要なAPI: Maps JavaScript API, Places API, Static Maps API
   - 取得方法: https://console.cloud.google.com/

2. **DISCORD_WEBHOOK_URL**
   - Discordサーバーのウェブフック設定から取得
   - お問い合わせとフィードバックの通知に使用

#### 推奨（アクセス解析・エラー監視）

3. **NEXT_PUBLIC_GA_MEASUREMENT_ID**
   - Google Analytics (GA4)の測定ID
   - 形式: `G-XXXXXXXXXX`
   - 取得方法: https://analytics.google.com/

4. **NEXT_PUBLIC_CLARITY_PROJECT_ID**
   - Microsoft ClarityのプロジェクトID
   - 取得方法: https://clarity.microsoft.com/

5. **NEXT_PUBLIC_SENTRY_DSN**
   - SentryのDSN（Data Source Name）
   - 形式: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
   - 取得方法: https://sentry.io/

6. **SENTRY_AUTH_TOKEN**
   - Sentryの認証トークン（ソースマップアップロード用）
   - 本番環境のビルド時に必要
   - 取得方法: https://sentry.io/settings/account/api/auth-tokens/

#### オプション

7. **NEXT_PUBLIC_BASE_URL**
   - 本番環境のURL
   - デフォルト: `https://hitofude.net`

8. **NEXT_PUBLIC_ADSENSE_PUBLISHER_ID**
   - Google AdSenseパブリッシャーID（将来的に使用予定）
   - 形式: `pub-XXXXXXXXXXXXXXXX`

9. **NEXT_PUBLIC_PLAUSIBLE_DOMAIN**
   - Plausible Analyticsのドメイン（代替アクセス解析ツール）

---

## 必要な環境変数

### Vercelダッシュボードで設定する環境変数一覧

以下の環境変数をVercelプロジェクトの設定画面で追加してください。

| 環境変数名 | 必須/推奨 | 説明 | 適用環境 |
|----------|---------|------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **必須** | Google Maps APIキー | Production, Preview, Development |
| `DISCORD_WEBHOOK_URL` | **必須** | Discord Webhook URL | Production, Preview, Development |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | 推奨 | Google Analytics測定ID | Production, Preview |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | 推奨 | Microsoft Clarity ID | Production, Preview |
| `NEXT_PUBLIC_SENTRY_DSN` | 推奨 | Sentry DSN | Production, Preview, Development |
| `SENTRY_AUTH_TOKEN` | 推奨 | Sentryトークン | Production |
| `NEXT_PUBLIC_BASE_URL` | オプション | 本番URL | Production |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | オプション | AdSense ID（将来用） | Production |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | オプション | Plausibleドメイン | Production, Preview |

---

## デプロイ手順

### ステップ1: Vercelにログイン

1. [Vercel](https://vercel.com/)にアクセス
2. GitHubアカウントでログイン

### ステップ2: 新規プロジェクトをインポート

1. Vercelダッシュボードで「**Add New...**」→「**Project**」をクリック
2. 「**Import Git Repository**」セクションでGitHubリポジトリを選択
3. リポジトリが表示されない場合は「**Configure GitHub App**」でアクセス権限を付与

### ステップ3: プロジェクト設定

#### 基本設定

- **Project Name**: `hitofude` (または任意の名前)
- **Framework Preset**: Next.js (自動検出されます)
- **Root Directory**: `.` (デフォルト)
- **Build Command**: `npm run build` (デフォルト)
- **Output Directory**: `.next` (デフォルト)
- **Install Command**: `npm install` (デフォルト)

#### Node.jsバージョン

- **Node.js Version**: 18.x以上（推奨: 20.x）

### ステップ4: 環境変数の設定

1. 「**Environment Variables**」セクションを展開
2. 以下の手順で各環境変数を追加：

   a. **Key**（変数名）を入力
   b. **Value**（値）を入力
   c. **Environment**（適用環境）を選択
      - Production: 本番環境
      - Preview: プレビュー環境（プルリクエストなど）
      - Development: ローカル開発環境
   d. 「**Add**」をクリック

#### 環境変数の入力例

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = AIzaSy... (実際のキー)
DISCORD_WEBHOOK_URL = https://discord.com/api/webhooks/... (実際のURL)
NEXT_PUBLIC_GA_MEASUREMENT_ID = G-4M1RM45XF8
NEXT_PUBLIC_CLARITY_PROJECT_ID = tm7dshfw4v
NEXT_PUBLIC_SENTRY_DSN = https://3e8d751bc41409b44cff4001304d0e0a@o4510145561296896.ingest.us.sentry.io/4510145562738688
```

**重要**:
- `NEXT_PUBLIC_`で始まる変数はブラウザで公開されます
- `DISCORD_WEBHOOK_URL`や`SENTRY_AUTH_TOKEN`は機密情報なので注意して扱ってください

### ステップ5: デプロイ実行

1. すべての設定が完了したら「**Deploy**」をクリック
2. デプロイプロセスが開始されます（通常2〜5分）

#### デプロイログの確認

デプロイ中は以下のログが表示されます：

```
Building...
▲ Vercel CLI 28.x.x
Running "npm install"
Running "npm run build"
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Compiled successfully
Uploading Build Output...
Build Completed
```

### ステップ6: カスタムドメインの設定（本番環境）

1. Vercelダッシュボードでプロジェクトを開く
2. 「**Settings**」→「**Domains**」に移動
3. 「**Add**」をクリックして`hitofude.net`を追加
4. DNSレコードの設定手順に従う：

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

5. DNS設定が反映されるまで待機（最大48時間、通常は数分〜数時間）

---

## デプロイ後の確認

### 1. サイトの動作確認

デプロイが完了したら、以下を確認してください：

#### 基本機能

- [ ] トップページが正常に表示される
- [ ] 配置案内図作成ツールが動作する
- [ ] Google Mapsが正しく表示される
- [ ] お問い合わせフォームが送信できる
- [ ] フィードバック機能が動作する

#### アクセス解析ツール

- [ ] Google Analyticsでアクセスが記録される
- [ ] Microsoft Clarityでセッションが記録される
- [ ] Sentryがエラーを検知する（テストエラーを発生させる）

### 2. 環境変数の確認

ブラウザの開発者ツールで以下を確認：

```javascript
// コンソールで実行
console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? '✓ Google Maps API' : '✗ Google Maps API');
console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? '✓ Google Analytics' : '✗ Google Analytics');
console.log(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? '✓ Microsoft Clarity' : '✗ Microsoft Clarity');
console.log(process.env.NEXT_PUBLIC_SENTRY_DSN ? '✓ Sentry' : '✗ Sentry');
```

**注意**: この確認は開発中のみ実施してください。本番環境では削除してください。

### 3. パフォーマンスの確認

- **Vercel Analytics**: Vercelダッシュボードの「Analytics」タブで確認
- **Lighthouse**: Chrome DevToolsでスコアを確認（目標: 90以上）
- **Core Web Vitals**: 実際のユーザー体験を監視

### 4. Discord通知の確認

- お問い合わせフォームから送信
- フィードバック機能から送信
- Discordチャンネルで通知を受信できるか確認

---

## トラブルシューティング

### ビルドエラー

#### エラー: "Module not found"

**原因**: 依存関係がインストールされていない

**解決策**:
```bash
# ローカルで確認
npm install
npm run build

# package-lock.jsonをコミット
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

#### エラー: "Type error: ..."

**原因**: TypeScriptの型エラー

**解決策**:
```bash
# ローカルでTypeScriptチェック
npm run build

# エラーを修正後、再デプロイ
```

### 環境変数が反映されない

**症状**: `process.env.NEXT_PUBLIC_XXX`が`undefined`になる

**解決策**:
1. Vercelダッシュボードで環境変数を確認
2. 変数名のスペルミスがないか確認
3. 適用環境（Production/Preview/Development）が正しく選択されているか確認
4. 再デプロイを実行（環境変数の変更後は必須）

### Google Mapsが表示されない

**症状**: "This page can't load Google Maps correctly"

**解決策**:
1. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`が正しく設定されているか確認
2. Google Cloud ConsoleでAPIが有効化されているか確認
   - Maps JavaScript API
   - Places API
   - Static Maps API
3. APIキーの使用制限を確認（HTTPリファラーの設定など）
4. APIキーの課金が有効になっているか確認

### Discordに通知が届かない

**症状**: お問い合わせ・フィードバックがDiscordに届かない

**解決策**:
1. `DISCORD_WEBHOOK_URL`が正しく設定されているか確認
2. Webhook URLが有効かブラウザで確認：
   ```bash
   curl -X POST -H "Content-Type: application/json" \
   -d '{"content":"Test message"}' \
   YOUR_WEBHOOK_URL
   ```
3. Discordチャンネルでウェブフックが削除されていないか確認
4. Vercelの「Functions」ログでエラーを確認

### Sentryにエラーが送信されない

**症状**: Sentryダッシュボードにエラーが表示されない

**解決策**:
1. `NEXT_PUBLIC_SENTRY_DSN`が正しく設定されているか確認
2. Sentryプロジェクトが有効になっているか確認
3. テストエラーを発生させる：
   ```javascript
   // ブラウザのコンソールで実行
   throw new Error("Test Sentry error");
   ```
4. 本番環境では`debug: false`になっているか確認

### デプロイは成功するが、ページが404になる

**症状**: デプロイ成功後、特定のページが404エラー

**解決策**:
1. ファイル名・ディレクトリ構造を確認
2. `app/`ディレクトリ内のルーティングが正しいか確認
3. `next.config.ts`のリダイレクト設定を確認
4. Vercelの「Deployments」→「Build Logs」でエラーを確認

### パフォーマンスが遅い

**症状**: ページの読み込みが遅い

**解決策**:
1. 画像の最適化:
   - Next.js `<Image>`コンポーネントを使用
   - 適切なサイズとフォーマット（WebP推奨）
2. 不要なJavaScriptの削除
3. Vercel Analyticsでボトルネックを特定
4. Edge Functionsの活用を検討

---

## 継続的デプロイ（CI/CD）

Vercelは自動的にGitHubと連携し、以下のように動作します：

### 自動デプロイのトリガー

- **main/masterブランチへのpush**: 本番環境に自動デプロイ
- **プルリクエスト**: プレビュー環境を自動作成
- **feature/developブランチへのpush**: プレビュー環境を自動作成

### デプロイの承認設定

本番環境への自動デプロイを制御したい場合：

1. Vercelダッシュボードで「Settings」→「Git」
2. 「Production Branch」を設定
3. 「Deploy Previews」の設定を調整

---

## まとめ

### デプロイチェックリスト

デプロイ前に以下を確認してください：

- [ ] すべての環境変数が設定済み
- [ ] ローカルで`npm run build`が成功する
- [ ] `.env.local.example`にすべての必要な環境変数が記載されている
- [ ] `.gitignore`に`.env.local`が含まれている
- [ ] Google Cloud、Discord、GA4、Clarity、Sentryのアカウントが準備済み
- [ ] カスタムドメインのDNS設定が完了している（本番環境の場合）

### サポート

デプロイに問題が発生した場合：

- **Vercelドキュメント**: https://vercel.com/docs
- **Next.jsドキュメント**: https://nextjs.org/docs
- **Vercelサポート**: https://vercel.com/support

---

**最終更新**: 2025年10月7日
**バージョン**: 1.0.0
