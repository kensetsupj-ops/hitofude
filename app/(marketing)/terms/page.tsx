'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="policy-page">
      <header className="policy-header">
        <Link href="/" className="back-link">← ホームに戻る</Link>
        <h1>利用規約</h1>
        <p className="updated">最終更新：2025年10月6日</p>
      </header>

      <main className="policy-content">
        <section>
          <h2>1. はじめに</h2>
          <p>
            本利用規約（以下「本規約」）は、ひとふで（以下「当サービス」）が提供する各種ツールの利用条件を定めるものです。
            利用者は、当サービスを利用することで本規約に同意したものとみなされます。
          </p>
        </section>

        <section>
          <h2>2. サービス内容</h2>
          <p>
            当サービスは、案内、チェック、指示、共有など、業務効率化を支援する無料オンラインツール群を提供します。
            ログイン不要・無料で、ブラウザ上ですぐにご利用いただけます。
          </p>
        </section>

        <section>
          <h2>3. 利用資格</h2>
          <p>
            当サービスは、以下の条件を満たす方が利用できます：
          </p>
          <ul>
            <li>本規約に同意し、遵守できる方</li>
            <li>法令および公序良俗に反する目的で利用しない方</li>
            <li>第三者の権利を侵害しない方</li>
          </ul>
        </section>

        <section>
          <h2>4. 禁止事項</h2>
          <p>利用者は、以下の行為を行ってはなりません：</p>
          <ul>
            <li>法令または公序良俗に反する行為</li>
            <li>犯罪行為またはそれに関連する行為</li>
            <li>他の利用者または第三者の権利を侵害する行為</li>
            <li>当サービスの運営を妨害する行為</li>
            <li>不正アクセス、サーバーへの過度な負荷をかける行為</li>
            <li>当サービスを商業目的で再配布・転売する行為</li>
            <li>各ツールが利用する第三者サービスの利用規約に違反する行為</li>
          </ul>
        </section>

        <section>
          <h2>5. 知的財産権</h2>
          <p>
            当サービスに関する著作権・商標権等の知的財産権は、当サービス運営者または正当な権利者に帰属します。
          </p>
          <p>
            各ツールが利用する第三者サービス（地図、フォント、アイコン等）の知的財産権は、それぞれのサービス提供者に帰属します。
          </p>
          <p>
            利用者が作成したデータ（図、リスト、テキスト等）の著作権は利用者に帰属します。
            ただし、第三者サービスの提供するコンテンツについては、各サービスの利用規約が適用されます。
          </p>
        </section>

        <section>
          <h2>6. データの取り扱い</h2>
          <p>
            当サービスは、利用者が入力した情報を原則としてサーバーに送信・保存しません。
            データは主にブラウザ内（ローカルストレージ）で管理されます。
          </p>
          <p>
            利用者は、機密情報や個人情報を含むデータを取り扱う際は、自己の責任において管理してください。
          </p>
        </section>

        <section>
          <h2>7. 免責事項</h2>
          <p>
            当サービスは「現状有姿」で提供されます。運営者は、以下について一切の責任を負いません：
          </p>
          <ul>
            <li>サービスの正確性、完全性、安全性、有用性</li>
            <li>サービスの中断、停止、終了</li>
            <li>サービス利用によって生じた損害（直接・間接を問わず）</li>
            <li>各ツールが利用する第三者サービスのデータや機能の誤り</li>
            <li>利用者のデバイスやデータの損失</li>
          </ul>
          <p>
            利用者は、当サービスを利用して作成したデータの内容について、自己の責任で確認・検証してください。
          </p>
        </section>

        <section>
          <h2>8. サービスの変更・終了</h2>
          <p>
            運営者は、事前の通知なく、当サービスの内容を変更、一時停止、または終了することができます。
            これにより利用者に損害が生じた場合でも、運営者は一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2>9. 広告の表示</h2>
          <p>
            当サービスは、運営費用をまかなうため、Google AdSense等の広告を表示します。
            広告内容は第三者によって配信されるため、運営者は広告内容について責任を負いません。
          </p>
        </section>

        <section>
          <h2>10. 準拠法と管轄裁判所</h2>
          <p>
            本規約は日本法に準拠し、当サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section>
          <h2>11. 規約の変更</h2>
          <p>
            運営者は、必要に応じて本規約を変更することがあります。
            変更後の規約は、本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <section>
          <h2>12. お問い合わせ</h2>
          <p>
            利用規約に関するお問い合わせは、
            <Link href="/contact">お問い合わせページ</Link>からご連絡ください。
          </p>
        </section>
      </main>

      <footer className="policy-footer">
        <Link href="/">← ホームに戻る</Link>
      </footer>

      <style jsx>{`
        .policy-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 20px;
          font-family: system-ui, "Noto Sans JP", sans-serif;
          line-height: 1.8;
        }

        .policy-header {
          margin-bottom: 40px;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #0066cc;
          text-decoration: none;
          font-size: 14px;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        h1 {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }

        .updated {
          font-size: 14px;
          color: #666;
        }

        .policy-content section {
          margin-bottom: 32px;
        }

        h2 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 2px solid #333;
          color: #333;
        }

        p {
          margin-bottom: 12px;
          color: #555;
        }

        ul {
          margin: 12px 0 12px 20px;
          color: #555;
        }

        li {
          margin-bottom: 8px;
        }

        strong {
          font-weight: 600;
          color: #333;
        }

        a {
          color: #0066cc;
          text-decoration: underline;
        }

        a:hover {
          color: #004499;
        }

        .policy-footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
        }

        @media (max-width: 768px) {
          .policy-page {
            padding: 60px 16px;
          }

          h1 {
            font-size: 28px;
          }

          h2 {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}