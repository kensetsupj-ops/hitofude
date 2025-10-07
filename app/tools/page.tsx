import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ツール一覧',
  description: 'ひとふでの各種ツール一覧。案内図作成、チェックリスト、指示書作成など、業務を効率化する無料ツールを提供しています。',
  alternates: {
    canonical: '/tools',
  },
};

export default function ToolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ひとふで ツール一覧',
    description: '業務を効率化する無料ツール群',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'SoftwareApplication',
          name: 'ひとふで案内図',
          description: '搬入経路、配送ルート、訪問案内を地図上に描いて共有',
          url: '/tools/delivery-guide',
          applicationCategory: 'BusinessApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'JPY',
          },
          operatingSystem: 'Web',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, sans-serif',
        color: '#000'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#000',
          textAlign: 'center'
        }}>ツール一覧</h1>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          現場・式典・イベント・日常の「伝える」を最短で。<br />
          無料・ログイン不要で今すぐ使えるツール群です。
        </p>

        <section style={{
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#000'
          }}>今すぐ使えるツール</h2>

          <Link
            href="/tools/delivery-guide"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit'
            }}
            className="tool-card-link"
          >
            <div style={{
              border: '2px solid #ddd',
              padding: '32px',
              marginBottom: '20px',
              position: 'relative',
              background: '#fff',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }} className="tool-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: 0,
                  color: '#000'
                }}>ひとふで案内図</h3>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#000',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>ベータ</span>
              </div>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#555',
                marginBottom: '20px'
              }}>
                搬入経路、配送ルート、訪問案内を地図上に描いて共有。
                矢印と一言で、誰にでも伝わる案内図が作れます。
                無料・ログイン不要で今すぐ使えます。
              </p>

              <div style={{
                marginBottom: '16px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: '#000'
                }}>こんな時に</h4>
                <ul style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#555',
                  paddingLeft: '20px',
                  margin: 0
                }}>
                  <li>建設現場への搬入経路を協力会社に共有</li>
                  <li>配送先の駐車場や入口を新人ドライバーに案内</li>
                  <li>イベント会場への来場ルートをゲストに送付</li>
                  <li>訪問介護の新規利用者宅への道順を記録</li>
                </ul>
              </div>

              <div style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#000',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 'bold'
              }}>
                案内図を作る →
              </div>
            </div>
          </Link>
        </section>

        <section style={{
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#000'
          }}>準備中のツール</h2>

          <p style={{
            fontSize: '14px',
            color: '#999',
            marginBottom: '24px'
          }}>
            以下のツールを順次リリース予定です。
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              background: '#f9f9f9'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#666'
              }}>チェックリスト</h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: '#999',
                margin: 0
              }}>
                作業リスト、点検項目、確認事項を整理して共有
              </p>
            </div>

            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              background: '#f9f9f9'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#666'
              }}>指示書</h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: '#999',
                margin: 0
              }}>
                作業指示書、手順書、マニュアルを簡潔に作成
              </p>
            </div>

            <div style={{
              border: '1px solid #ddd',
              padding: '20px',
              background: '#f9f9f9'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#666'
              }}>座席図</h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: '#999',
                margin: 0
              }}>
                座席表、配置図、組織図を見やすくまとめて配布
              </p>
            </div>
          </div>
        </section>

        <section style={{
          textAlign: 'center',
          paddingTop: '60px',
          borderTop: '2px solid #000'
        }}>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }} className="back-button">
            ホームに戻る
          </Link>
        </section>

        <style dangerouslySetInnerHTML={{ __html: `
          .tool-card:hover {
            border-color: #000 !important;
            transform: translate(4px, 4px) !important;
            box-shadow: 8px 8px 0 #000 !important;
          }

          .back-button:hover {
            transform: translate(2px, 2px) !important;
          }
        `}} />
      </div>
    </>
  );
}
