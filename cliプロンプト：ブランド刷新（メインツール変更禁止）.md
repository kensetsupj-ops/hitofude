以下を**そのままCLIに渡す指示文（プロンプト）**として使用してください。 
※実装手段は任意。**/app/tools/delivery-guide/page.tsx（メインツール本体）は一切変更禁止**です。

---

# 目的
現状構成を核に、「**ひとふで**」のブランドイメージ（地図に依存しない中立コア）へ**大幅刷新**する。 
刷新対象はマーケ/共通レイヤのみで、**メインツールは不触**。SEOとUXを同時に底上げする。

# 厳守（変更禁止ファイル）
- **/app/tools/delivery-guide/page.tsx**（メインツール本体）
- **/components/MapView.tsx / OverlayCanvas.tsx / Toolbar.tsx / Sidebar.tsx / PrintLayout.tsx**（ツール機能系）
- **/lib/pdf-generator.ts / lib/types.ts**（ツール中核ロジック）

---

# ブランド定義（共通で使う文言）
- `{SITE_NAME}` = ひとふで
- `{TAGLINE}` = 迷わず、すぐ形に。
- `{BRAND_PITCH_30S}` = 「ひとふでは、誰でも迷わず“要点をすぐ形に”できる小さなツール群です。案内、チェック、指示、共有まで。余計を足さず、伝わるを最短で。」
- **禁止（ブランド層では使用しない）**：A4一枚／地図に一本／Googleマップ 等の媒体依存表現

---

# 変更・追加タスク一覧（ファイル単位）

## 0) ナビ・共通レイアウト（全体反映）
1. **/app/layout.tsx**（共通ルートレイアウト）  
   - ヘッダーとフッターを**全ページで表示**（ツール本体のUIは壊さない範囲で）。  
   - `generateMetadata` を導入し、`titleTemplate: "{SITE_NAME}｜%s"`, `openGraph`, `twitter`, `alternates.canonical` を設定。  
   - ヒーローや主要コピーで `{TAGLINE}` を使うが、**ツール機能文言は入れない**。
2. **/components/Header.tsx**  
   - サイトタイトルを **「ひとふで」** に変更（**「ひとふで案内図」は製品名として個別に使用**）。  
   - グローバルナビ：**ホーム／ツール一覧／使い方／FAQ／活用例／業種別／お問い合わせ**  
     - 「ツール一覧」は `/tools`（新規ページ、後述）へ。  
     - 「案内図」は「ツール一覧」内の一項目として誘導（= コア化しない）。
3. **/components/Footer.tsx**  
   - リンク：**ホーム／ツール一覧／使い方／FAQ／活用例／建設向け／物流向け／お問い合わせ／プライバシー／利用規約／スポンサー**  
   - 小コピー：**{TAGLINE} ひとふで**

> 注：Header/Footerの変更は**メインツールのファイル未変更で反映**されます（App Routerの共通レイアウト仕様）。

---

## 1) ホーム刷新（ブランド中立）
4. **/app/(marketing)/page.tsx**  
   - H1：**ひとふで｜誰でも迷わず作れるオンラインツール**  
   - リード：**要点だけを整えて、すぐ配れる。現場・式典・イベント・日常の「伝える」を最短で。**  
   - CTA：主 **「今すぐ使う（無料）」→ `/tools/delivery-guide`**、従 **「ツール一覧を見る」→ `/tools`**  
   - セクション：  
     - 「ひとふでとは」（{BRAND_PITCH_30S} を要約）  
     - 「できること」（案内／チェック／指示／共有の4象限・将来拡張を示唆）  
     - 「今使えるツール」：**ひとふで案内図（ベータ）** だけ掲載、将来のカードは「近日追加」  
   - **地図/A4など媒体依存の語を使用しない**。  
   - `generateMetadata` を実装（説明120–160字）。

---

## 2) 新規：ツール一覧ページ（ハブ）
5. **追加：/app/tools/page.tsx**  
   - 一覧カード（`ItemList`構造化データ）：  
     - **ひとふで案内図**（→ `/tools/delivery-guide`）  
     - （カード）**チェック**／**指示書**／**座席図**…は「準備中」表示  
   - 各カードに短い用途説明（媒体非依存）。  
   - `generateMetadata`：タイトル「ひとふで｜ツール一覧」。

---

## 3) マーケ・ガイドの文言を**ブランド中立**に統一
6. **/app/(marketing)/about/page.tsx**  
   - 「A4/地図」文言を除去し、**ブランドミッション/原則/ストーリー**（キャンバス「ブランドコア」）を反映。  
   - 見出し：**ミッション／原則／ストーリー／ロードマップ**。
7. **/app/(marketing)/guides/how-to/page.tsx**  
   - タイトルは **「使い方｜ひとふで案内図」**（ツール固有層として記述OK）。  
   - 本文は現行踏襲、**ブランド層表現（A4/地図ワード）は“ツール説明の中だけ”**に留める。  
   - `FAQ` への内部リンクを強化。
8. **/app/(marketing)/guides/faq/page.tsx**  
   - Qの見出しを**ブランド中立な書き方**に調整（「地図」前提の表現は“案内図ツールの文脈”内に入れる）。  
   - 10問以上維持。
9. **/app/(marketing)/guides/cases-construction/page.tsx**（★更新済み）  
   - セクション冒頭に **「本ページは活用例であり、特定企業・施設と関係はありません」** を追記（デモ配慮）。

---

## 4) 業種別ページは「ブランド→案内図」の二層構成に
10. **/app/(marketing)/industries/construction/page.tsx**  
    - 冒頭はブランド中立で課題提示 → 中盤以降に**案内図ツール**での解決を紹介。  
    - CTA：`/tools/delivery-guide` と `/tools` の両方。  
    - `generateMetadata` 更新。
11. **/app/(marketing)/industries/logistics/page.tsx**  
    - 上記に準じて調整。

---

## 5) 規約・スポンサー
12. **/app/(marketing)/privacy/page.tsx**  
    - **広告・計測の記述**（AdSense/Cookie/オプトアウト、EEAのCMP/Consent Mode v2）を明示（既存方針を維持/強化）。  
13. **/app/(marketing)/terms/page.tsx**  
    - ブランド層の表現に整合（媒体依存の断定は避ける）。  
14. **/app/(marketing)/sponsors/page.tsx**  
    - ブランド単位の提案（ツール個別ではなく「ひとふで」全体の在庫/受け皿）に変更。

---

## 6) OGP/メタ/構造化データの統一
15. **/app/opengraph-image.tsx**（トップ）  
    - テキスト：**「ひとふで」／{TAGLINE}** のみ（地図/A4の語は使わない）。  
16. **/app/tools/delivery-guide/opengraph-image.tsx**（現行踏襲）  
    - 変更不要。  
17. **/app/(marketing)/layout.tsx**  
    - `generateMetadata` の共通初期値（titleTemplate/OG/Twitter/robots）。  
18. **構造化データ**（該当ページ末尾に挿入）：  
    - ルート：`WebSite`＋`Organization`（{SITE_NAME}）  
    - `/tools`：`ItemList`  
    - 個別マーケ：`WebPage`＋`BreadcrumbList`  
    - **ツール固有**（/tools/delivery-guide）は現状のまま（変更禁止）。

---

## 7) ルーティング/サイトマップ/robots
19. **/app/sitemap.ts**  
    - 新規 `/tools` を含め、既存ページを再列挙。  
20. **/app/robots.ts**  
    - 本番 Allow、ステージング `noindex` のまま出し分け維持。

---

## 8) 既存テキストの安全な置換（マーケ層のみ）
21. 以下の**置換は (marketing) 配下とホームのみに適用**。**ツール本体配下（/app/tools/*）は対象外**。  
   - 「ひとふで案内図」→ **「ひとふで」**（※“製品名”として明示する箇所は除外：例「ひとふで案内図（ツール）」）  
   - 「A4一枚／A4横」→ **「読みやすい出力」「すぐ配れる出力」**  
   - 「地図／Googleマップ」→ **ブランド層では削除**（ツール説明内にのみ残す）

---

## 9) 新規ページ（任意・推奨）
22. **/app/(marketing)/brand/page.tsx**（ブランドコア）  
    - キャンバス「ブランドコア＆ストーリー」を反映（ミッション/原則/ストーリー/ロードマップ）。  
    - グロナビ「サイト概要」から**/brand**へ誘導 or `/about` 内に統合でも可。  
23. **/app/(marketing)/plans/page.tsx**（将来の料金）  
    - Free/Pro/Teamsの**概要だけ**先出し（価格は未定でOK）。  
    - CTAはニュースレター or お問い合わせ。

---

## 10) SEO/UX ガードレール
- **Core Web Vitals**：既存水準維持。CLS≤0.01（広告・画像は固定高＋Lazy）。  
- **内部リンク**：ホーム→ツール一覧→案内図、ガイド/業種→案内図、フッター全域→主要ページの**相互リンク**を確保。  
- **E-E-A-T**：/about（または/brand）に運営情報・方針を明記。  
- **コピー基準**：ブランド層は**媒体非依存**の言い切り、ツール層は用途に即した具体表現。

---

# 受け入れ基準（DoD）
1. **/app/tools/delivery-guide/page.tsx は未変更**（Git差分ゼロ）。  
2. ヘッダーのサイトタイトルが**「ひとふで」**に統一、ナビに**「ツール一覧」**が追加。  
3. ホームがブランド中立コピー（{TAGLINE}）に刷新、CTAは**案内図**と**ツール一覧**。  
4. **/tools/page.tsx**（一覧）が新設され、`ItemList`構造化データが出力される。  
5. (marketing) 配下のページから**媒体依存表現が排除**され、案内図に関する表現は**ツール文脈内に限定**。  
6. 業種別ページが**ブランド→案内図**の二層構成でCTAを持つ。  
7. OGP（トップ）が**ブランド中立テキスト**になっている。  
8. `sitemap.ts` に新規 `/tools` が含まれる。  
9. Core Web Vitals が既存から劣化していない（主要端末でLCP/CLS/INP良好）。  
10. 404/500 から**ホーム/ツール一覧**へ復帰できる導線がある。

---

# 置換用パラメータ
- `{SITE_NAME}` = ひとふで  
- `{TAGLINE}` = 迷わず、すぐ形に。  
- `{BRAND_PITCH_30S}` = （前述本文）  

---

**繰り返し：/app/tools/delivery-guide/page.tsx は一切変更しないこと。**