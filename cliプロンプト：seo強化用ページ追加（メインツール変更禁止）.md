以下を**そのままCLIに渡す指示文（プロンプト）**として使用してください。
※コード禁止／実装手段は任意。**/app/tools/delivery-guide/page.tsx（メインツール）は一切変更しないこと**。

---

# 目的
`hitofude.net` を **検索に強い最小構成＋Google AdSense審査対応**へ拡張する。説明系ページ群・業界LP・ガイド記事・動的サイトマップ/robots・OGP画像・共通フッター導線のみを追加し、**メインツールの内容は一切変更しない**。

# 追加・改編の範囲（まとめ）
- 追加対象：**説明系ページ群**、**業界別LP**、**ガイド(MDX)**、**動的サイトマップ/robots**、**OGP画像**、**共通フッター導線**。
- 禁止：**/app/tools/delivery-guide/page.tsx のUI/文言/構造/メタを一切変更しない**。ツールへの導線は“周辺ページ側”にのみ実装。

---

# Google AdSense 審査対応（追加要件）
- **コンテンツ量**：ホーム/HowTo/FAQ/事例の“独自テキスト”を満たす（HowTo 800–1,200字、FAQ 10問以上、事例 800字〜）。
- **ナビゲーション**：ヘッダー/フッターから主要ページへ到達可能（迷路化禁止）。
- **広告方針（審査中）**：**自動広告OFF**。**手動ユニットのみ**を使用。広告は**地図コンテナ外**に限り、主要操作UIから**150–300px以上**離す。**印刷/PDFでは常に非表示**。
- **ads.txt**：ドメイン直下に配置し、**`google.com, pub-{ADSENSE_PUB_ID}, DIRECT, f08c47fec0942fa0`** を含める（`{ADSENSE_PUB_ID}`置換）。
- **プライバシー**：/privacy に **AdSense/第三者配信/Cookie/用途・オプトアウト**の記述、Googleポリシーへのリンクを明記。
- **同意管理（EEA/UK/CH）**：**Google認定CMP**を導入し、**Consent Mode v2**を実装。該当地域では**同意ステータスが得られるまで広告リクエストを送らない**。
- **サイト確認**：AdSenseの**サイト追加と確認**を完了（確認コードの設置／所有権確認）。
- **レイアウト品質**：広告枠は**固定高プレースホルダ**でCLS=0。ビューアビリティ≥70%を目標。
- **禁止**：誤クリック誘導（紛らわしい見出し・ボタン隣接・ポップアップ重ね）／違反カテゴリ掲載。

# ディレクトリ／ファイル追加（Next.js 15 App Router）
```
app/
├─ (marketing)/                          # 説明系グループ（静的で軽量）
│  ├─ page.tsx                           # ホーム：製品紹介＋CTA
│  ├─ about/page.tsx                     # 運営者/会社情報（E-E-A-T）
│  ├─ contact/page.tsx                   # 連絡先（メール/対応時間等）
│  ├─ privacy/page.tsx                   # プライバシーポリシー
│  ├─ terms/page.tsx                     # 利用規約
│  ├─ sponsors/page.tsx                  # スポンサー募集（将来の直販導線）
│  └─ guides/                            # 使い方・FAQ・事例（MDX）
│     ├─ how-to.mdx                      # 住所→地図→描画→PDF（800–1200字）
│     ├─ faq.mdx                         # よくある質問（10問以上）
│     └─ cases-construction.mdx          # 建設向け活用例（800字〜）
│
├─ industries/                           # 業界別ランディング（各600–900字）
│  ├─ construction/page.tsx
│  └─ logistics/page.tsx
│
├─ opengraph-image.tsx                   # ルート用OGP画像（動的テキスト）
└─ tools/delivery-guide/opengraph-image.tsx   # ツール用OGP画像（動的テキスト）

app/sitemap.ts                            # 動的サイトマップ
app/robots.ts                             # 環境に応じた出し分け
```
> 既存の `SEOHead.tsx` は残してよいが、新規ページでは **`generateMetadata` を優先**。共通フッターは `layout.tsx` にのみ追加可（**ツール本体は触らない**）。

---

# ページ別 要件（テキスト/SEO/スキーマ）
## 1) ホーム：`app/(marketing)/page.tsx`
- **H1**：`ひとふで｜搬入経路図`
- **サブコピー（100–140字）**：例）「Googleマップに矢印・丸・一言。A4横一枚で印刷・PDFまで、ひとつの画面で完結。」
- **CTA**：太ボタン「ツールを開く」→ `/tools/delivery-guide`（ファーストビュー内に1箇所必置）
- **本文（合計300–600字）**：特長3点（描ける／A4独自PDF／読みやすいUI）＋ `/guides/how-to` `/guides/faq` への内部リンク
- **フッター導線**：`/about` `/contact` `/privacy` `/terms` `/sponsors` へのリンク
- **`generateMetadata`**：
  - `title`: `ひとふで｜搬入経路図（A4横/Googleマップ対応）`
  - `description`: 120–160字で機能と“一枚完結”を説明
  - `alternates.canonical`: ルートURL
- **JSON-LD**（ページ下部）：`WebSite`・`SoftwareApplication`・`BreadcrumbList`

## 2) 運営者情報：`app/(marketing)/about/page.tsx`
- **H1**：`運営者情報`
- **本文（300–600字）**：運営者/屋号、所在地（市区町村まで可）、連絡先、ミッション
- **`generateMetadata`**：タイトル・説明
- **JSON-LD**：`Organization`（name, url, logo(任意), contactPoint）

## 3) 連絡先：`app/(marketing)/contact/page.tsx`
- **H1**：`お問い合わせ`
- **本文**：メール（mailtoリンク）、対応時間、返信目安、注意事項
- **`generateMetadata`**：タイトル・説明
- **JSON-LD**：`Organization.contactPoint`（contactType="customer support" 等）

## 4) プライバシー：`app/(marketing)/privacy/page.tsx`
- **H1**：`プライバシーポリシー`
- **本文**：
  - 収集情報（アクセス解析、**Google AdSense**、問い合わせ）
  - **第三者配信（Google ほか）とCookieの利用、パーソナライズド広告の説明**
  - **オプトアウト手段**（Ads Settings / aboutads.info 等へのリンク）
  - **EEA/UK/CH**向け：Google認定**CMP採用**と**Consent Mode v2**により同意を尊重する旨
  - データ保管期間、問い合わせ窓口
- **`generateMetadata`**：タイトル・説明
- **JSON-LD**：`WebPage`

## 5) 利用規約：`app/(marketing)/terms/page.tsx`
- **H1**：`利用規約`
- **本文**：免責、禁止行為、著作・地図帰属の扱い、準拠法
- **`generateMetadata`**：タイトル・説明
- **JSON-LD**：`WebPage`

## 6) スポンサー募集：`app/(marketing)/sponsors/page.tsx`
- **H1**：`スポンサー募集`
- **本文（300–600字）**：掲載位置（本文下/右パネル/モバイル）、印刷非表示、連絡窓口
- **`generateMetadata`**／**`WebPage`（JSON-LD）** を実装

## 7) ガイド（MDX）：`app/(marketing)/guides/how-to.mdx`
- **frontMatter**：題名/説明/公開日
- **見出し構成**：
  - H1：`使い方｜搬入経路図`
  - H2：住所を入力→地図が自動で寄る
  - H2：矢印・丸・一言を置く（ショートカット含む）
  - H2：A4横で独自PDF（1枚目詳細／2枚目周辺）
- **文字数**：800–1,200字
- **内部リンク**：`/tools/delivery-guide` へのCTA、`/guides/faq`
- **JSON-LD**：`HowTo`（name, step配列, tool="Google Maps", supply="A4用紙" 等）

## 8) ガイド（MDX）：`app/(marketing)/guides/faq.mdx`
- **H1**：`FAQ｜よくある質問`
- **Q&A**：10問以上（例：ロゴが切れる／印刷に広告が出ないか／住所がヒットしない 等）
- **JSON-LD**：`FAQPage`（mainEntity に Q&A 配列）

## 9) 事例（MDX）：`app/(marketing)/guides/cases-construction.mdx`
- **H1**：`活用例｜建設現場での使い方`（800字〜）
- **内容**：前日共有、朝礼、搬入手順、周辺図の意義
- **内部リンク**：`/industries/construction`, `/tools/delivery-guide`

## 10) 業界別LP：`app/industries/construction/page.tsx`
- **H1**：`建設業向け｜搬入経路図ツール`
- **本文（600–900字）**：業界特有の課題→本ツールでの解決
- **内部リンク**：`/guides/cases-construction`, `/tools/delivery-guide`
- **`generateMetadata`**：産業名を含むタイトル・説明
- **JSON-LD**：`WebPage`＋`BreadcrumbList`（`/` → `/industries/construction`）

## 11) 業界別LP：`app/industries/logistics/page.tsx`
- **H1**：`物流・運送向け｜搬入経路図ツール`
- **本文（600–900字）**：ドライバー共有、周辺図の価値、PDF活用
- **内部リンク**：`/tools/delivery-guide`
- **`generateMetadata`**／**JSON-LD**：上記に準ずる

---

# サイトマップ／robots（動的）
## `app/sitemap.ts`
- 含めるURL：`/`, `/tools/delivery-guide`, `/about`, `/contact`, `/privacy`, `/terms`, `/sponsors`, `/guides/how-to`, `/guides/faq`, `/guides/cases-construction`, `/industries/construction`, `/industries/logistics`
- `lastModified`：ビルド時刻で可

## `app/robots.ts`
- 本番：`User-agent: *` / `Allow: /`
- プレビュー/ステージ：`noindex: true`（環境変数で切替）

---

# OGP画像（動的テキスト）
## `app/opengraph-image.tsx`
- テキスト：`ひとふで｜搬入経路図` ＋ タグライン `迷いを、ひとふで。`
- 配色：モノトーン＋小赤アクセント（テキストのみで可）

## `app/tools/delivery-guide/opengraph-image.tsx`
- テキスト：`搬入経路図｜A4横・PDF対応`
- 住所未入力でも汎用画像を返す（固定テキストでOK）

---

# 共通フッター（`layout.tsx` にのみ追加可）
- リンク列：`ホーム / ツール / 使い方 / FAQ / 活用例 / 建設業向け / 物流向け / お問い合わせ / プライバシー / 利用規約 / スポンサー募集`
- **注意**：**ツール本体（/tools/delivery-guide/page.tsx）は変更しない**。フッターは共通レイアウト側追加のみ。

---

# メタデータ運用ルール（新規ページ共通）
- 各ページで `generateMetadata` を実装（`SEOHead.tsx` ではなく App Router標準で）
- `title` は「**ひとふで｜…**」で統一
- `description` は **120–160字**
- `alternates.canonical` を必ず設定（クエリは除去）

---

# コアWebバイタル／広告／印刷・広告ポリシー（再確認）
- 地図SDK・広告は **IntersectionObserverで遅延**（既存方針を踏襲）。
- **広告運用（審査含む）**：**自動広告OFF**、**手動ユニットのみ**。広告は**地図外**、主要UIから**150–300px**離隔、**印刷/PDFは常に非表示**。CLS≤0.01。
- **Googleマップの帰属は常時可視**（既存レイアウト維持）。
- **CMP/Consent Mode v2**：EEA/UK/CHで同意取得前は広告リクエスト送信禁止。

---

# 受け入れ基準（DoD）
1. **メインツール `/tools/delivery-guide` の内容は一切変更されていない**（UI/文言/構造/メタ）。
2. ルート `/` に製品紹介ページが追加され、**明確なCTA**でツールへ遷移できる。
3. `/about` `/contact` `/privacy` `/terms` `/sponsors` が存在し、各ページに **`generateMetadata`＋JSON-LD** が実装されている。
4. `/guides/how-to`（800–1200字）・`/guides/faq`（10問以上）・`/guides/cases-construction`（800字〜）が存在し、**相互内部リンク**が設定されている。
5. `/industries/construction` `/industries/logistics` が公開済みで、**各600–900字**・`generateMetadata` 設定済み。
6. `app/sitemap.ts` と `app/robots.ts` が機能し、Search Console のURL検査で問題なし。
7. ルート／ツール用の **OGP画像エンドポイント** が存在し、SNSシェアで表示される。
8. フッター共通リンクが全ページで表示され、**404/500からも復帰可能**。
9. Core Web Vitals（LCP/CLS/INP）が**既存水準から劣化していない**。
10. **ads.txt** がドメイン直下に存在し、`pub-{ADSENSE_PUB_ID}` を含む正しい行が配信されている。
11. **AdSenseサイト追加＆確認**が完了し、確認コード（または指定スニペット）が設置されている（自動広告は**OFF**）。
12. **広告配置**は手動ユニットのみで運用、**地図外**・**印刷非表示**・**CLS=0** を満たす。
13. **プライバシー**に AdSense/第三者配信/Cookie/オプトアウト記載、**EEA/UK/CH**向けの **CMP＋Consent Mode v2** の説明がある。

# 可変パラメータ（実装時に置換)
- `{SITE_NAME}` = ひとふで
- `{PRIMARY_KW}` = 搬入経路図
- `{TAGLINE}` = 迷いを、ひとふで。
- `{CONTACT_EMAIL}` = 連絡先メール
- `{ORG_NAME}` = 運営者/屋号
- `{ORG_CITY}` = 所在地（市区町村まで可）
- `{ADSENSE_PUB_ID}` = AdSenseパブリッシャーID（例：1234567890123456）
- `{CMP_PROVIDER}` = 採用するGoogle認定CMP名
- `{CONSENT_REGION}` = "EEA, UK, CH" 等の対象地域

---

**厳守**：上記追加のみ実施し、**/app/tools/delivery-guide/page.tsx は一切変更しないこと。**

