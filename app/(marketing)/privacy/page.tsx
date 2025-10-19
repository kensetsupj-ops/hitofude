import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー｜ひとふで',
  description: '「ひとふで」のプライバシーポリシー。個人情報の取り扱い、Google AdSense・第三者配信、Cookie利用、オプトアウト方法について説明します。',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'プライバシーポリシー',
    description: 'ひとふでのプライバシーポリシー',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="privacy-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, "Noto Sans JP", sans-serif',
        lineHeight: 1.8,
      }}>
        <header style={{
          marginBottom: '40px',
        }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginBottom: '20px',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >← ホームに戻る</Link>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#0f172a',
          }}>プライバシーポリシー</h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
          }}>最終更新：2025年10月7日</p>
        </header>

        <main>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>1. 基本方針</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              ひとふで（以下「当サービス」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。
              本ポリシーは、当サービスにおける個人情報の取り扱いについて説明します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>2. 収集する情報</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>当サービスは以下の情報を収集する場合があります：</p>
            <ul style={{
              margin: '12px 0 12px 20px',
              color: '#475569',
            }}>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 600, color: '#0f172a' }}>アクセス情報：</strong>IPアドレス、ブラウザの種類、アクセス日時、参照元URL等</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 600, color: '#0f172a' }}>利用状況：</strong>閲覧ページ、機能の利用状況、クリック情報等</li>
              <li style={{ marginBottom: '8px' }}><strong style={{ fontWeight: 600, color: '#0f172a' }}>Cookie情報：</strong>広告配信を行う場合やアクセス解析のために使用</li>
            </ul>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、利用者が入力した住所・連絡先・案件名等の情報を<strong style={{ fontWeight: 600, color: '#0f172a' }}>サーバーに送信・保存しません</strong>。
              すべてブラウザ内（ローカルストレージ）とURLパラメータで管理されます。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>3. 情報の利用目的</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>収集した情報は以下の目的で利用します：</p>
            <ul style={{
              margin: '12px 0 12px 20px',
              color: '#475569',
            }}>
              <li style={{ marginBottom: '8px' }}>サービスの提供・運営・改善</li>
              <li style={{ marginBottom: '8px' }}>利用状況の分析・統計</li>
              <li style={{ marginBottom: '8px' }}>広告配信を行う場合の配信と効果測定</li>
              <li style={{ marginBottom: '8px' }}>不正利用の防止・セキュリティ対策</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>4. 広告配信サービスについて</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、将来的に広告配信サービスとして<strong style={{ fontWeight: 600, color: '#0f172a' }}>Google AdSense</strong>等を利用する場合があります。
              その場合、Google及びそのパートナーは、Cookieを使用して、当サイトや他のサイトへの過去のアクセス情報に基づいて広告を配信します。
            </p>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              Google は、広告 Cookie を使用することにより、ユーザーがそのサイトや他のサイトにアクセスした際の情報に基づいて、
              適切な広告を表示する場合があります。
            </p>

            <h3 style={{
              fontSize: '17px',
              fontWeight: 600,
              margin: '20px 0 12px',
              color: '#1e293b',
            }}>4.1 パーソナライズド広告の無効化</h3>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              広告配信を行う場合、ユーザーは以下の方法でパーソナライズド広告を無効化（オプトアウト）できます：
            </p>
            <ul style={{
              margin: '12px 0 12px 20px',
              color: '#475569',
            }}>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                  }}
                >
                  Googleの広告設定ページ
                </a>でパーソナライズド広告を無効化
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="http://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                  }}
                >
                  www.aboutads.info
                </a>からオプトアウト
              </li>
              <li style={{ marginBottom: '8px' }}>ブラウザのCookie設定で第三者Cookieをブロック</li>
            </ul>

            <h3 style={{
              fontSize: '17px',
              fontWeight: 600,
              margin: '20px 0 12px',
              color: '#1e293b',
            }}>4.2 第三者配信事業者</h3>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスで広告配信を行う場合、Googleをはじめとする第三者配信事業者が広告を配信します。
              これらの事業者は、ユーザーの興味に基づく広告を表示するために、
              当サイトや他のサイトへのアクセス情報を使用することがあります。
            </p>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              詳細は<a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                }}
              >Googleのポリシーと規約</a>をご確認ください。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>5. EEA・UK・スイス居住者の方へ（GDPR対応）</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              欧州経済領域（EEA）、英国（UK）、スイス（CH）にお住まいの方に対して広告配信を行う場合は、
              Google認定の<strong style={{ fontWeight: 600, color: '#0f172a' }}>Consent Management Platform (CMP)</strong>を使用し、
              <strong style={{ fontWeight: 600, color: '#0f172a' }}>Consent Mode v2</strong>に準拠した同意管理を行います。
            </p>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              広告やアナリティクスのCookieは、ユーザーの同意が得られた場合にのみ利用されます。
              同意は、初回訪問時に表示される同意バナーから管理できます。
            </p>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              また、いつでも同意設定を変更・撤回することが可能です。
              同意を撤回した場合、以降の広告配信（実施する場合）やデータ収集は停止されます。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>6. Cookieの利用</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、以下の目的でCookieを使用します：
            </p>
            <ul style={{
              margin: '12px 0 12px 20px',
              color: '#475569',
            }}>
              <li style={{ marginBottom: '8px' }}>広告配信を行う場合の配信と効果測定</li>
              <li style={{ marginBottom: '8px' }}>アクセス解析と利用状況の把握</li>
              <li style={{ marginBottom: '8px' }}>サービスの改善</li>
            </ul>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              Cookieの受け入れを希望しない場合は、ブラウザの設定で無効化できます。
              ただし、一部機能が正常に動作しない可能性があります。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>7. 第三者サービス</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>当サービスは以下の第三者サービスを利用しています：</p>
            <ul style={{
              margin: '12px 0 12px 20px',
              color: '#475569',
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ fontWeight: 600, color: '#0f172a' }}>Google Maps Platform：</strong>地図表示・住所検索機能
                （<a
                  href="https://cloud.google.com/maps-platform/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                  }}
                >利用規約</a>）
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ fontWeight: 600, color: '#0f172a' }}>Google AdSense：</strong>広告配信（利用する場合があります）
                （<a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                  }}
                >ポリシー</a>）
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ fontWeight: 600, color: '#0f172a' }}>Google Analytics：</strong>アクセス解析ツール
                （<a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                  }}
                >プライバシーポリシー</a>）
              </li>
            </ul>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>各サービスは独自のプライバシーポリシーに基づいて運営されます。</p>

            <h3 style={{
              fontSize: '17px',
              fontWeight: 600,
              margin: '20px 0 12px',
              color: '#1e293b',
            }}>7.1 Google Analyticsについて</h3>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、アクセス解析ツールとして<strong style={{ fontWeight: 600, color: '#0f172a' }}>Google Analytics</strong>を利用しています。
              Google Analyticsは、Cookieを使用してサイトの利用状況（訪問者数、ページビュー、滞在時間、流入元など）を分析します。
            </p>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              Google Analyticsで収集されるデータは匿名で集計され、個人を特定する情報は含まれません。
              収集されたデータは、サービスの改善や利用状況の把握のみに使用されます。
            </p>

            <h3 style={{
              fontSize: '17px',
              fontWeight: 600,
              margin: '20px 0 12px',
              color: '#1e293b',
            }}>7.2 Google Analyticsのオプトアウト</h3>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              Google Analyticsによるデータ収集を無効化したい場合は、以下の方法で設定できます：
            </p>
            <ul style={{
              margin: '12px 0 12px 20px',
              color: '#475569',
            }}>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#2563eb',
                    textDecoration: 'underline',
                  }}
                >
                  Google Analytics オプトアウト アドオン
                </a>をブラウザにインストール
              </li>
              <li style={{ marginBottom: '8px' }}>ブラウザのCookie設定でGoogle Analyticsのトラッキングをブロック</li>
            </ul>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              詳細は<a
                href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                }}
              >Google Analyticsサービス利用規約</a>および
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                }}
              > Googleプライバシーポリシー</a>をご確認ください。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>8. 情報の開示・提供</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、法令に基づく場合や利用者の同意がある場合を除き、
              個人情報を第三者に開示・提供することはありません。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>9. データ保管期間</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              収集した情報は、利用目的を達成するために必要な期間保管します。
              法令で定められた保管義務がある場合は、その期間保管します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>10. セキュリティ</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、情報の紛失・破壊・改ざん・漏洩を防止するため、
              適切なセキュリティ対策を実施しています。ただし、インターネット通信の性質上、
              完全な安全性を保証するものではありません。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>11. ポリシーの変更</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              当サービスは、必要に応じて本ポリシーを変更することがあります。
              変更後のポリシーは、本ページに掲載した時点で効力を生じます。
              重要な変更がある場合は、サイト上で告知します。
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: '2px solid #0f172a',
              color: '#0f172a',
            }}>12. お問い合わせ</h2>
            <p style={{
              marginBottom: '12px',
              color: '#475569',
            }}>
              プライバシーに関するお問い合わせは、
              <Link
                href="/contact"
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                }}
              >お問い合わせページ</Link>からご連絡ください。
            </p>
          </section>
        </main>

        <footer style={{
          marginTop: '60px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
        }}>
          <Link
            href="/"
            style={{
              color: '#2563eb',
              textDecoration: 'underline',
            }}
          >← ホームに戻る</Link>
        </footer>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .privacy-container {
              padding: 140px 16px 40px !important;
            }

            .privacy-container h1 {
              font-size: 24px !important;
            }

            .privacy-container h2 {
              font-size: 18px !important;
            }

            .privacy-container h3 {
              font-size: 15px !important;
            }

            .privacy-container p,
            .privacy-container li {
              font-size: 14px !important;
            }
          }
        `}} />
      </div>
    </>
  );
}
