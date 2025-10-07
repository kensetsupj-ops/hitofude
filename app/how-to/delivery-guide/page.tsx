import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ひとふで案内図の使い方',
  description: 'ひとふで案内図の基本的な使い方をステップごとに解説します。地図への描画から印刷まで、はじめての方でも簡単に搬入経路図を作成できます。',
  alternates: {
    canonical: '/how-to/delivery-guide',
  },
};

export default function DeliveryGuideHowToPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://hitofude.net'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '使い方',
        item: 'https://hitofude.net/how-to'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ひとふで案内図の使い方',
        item: 'https://hitofude.net/how-to/delivery-guide'
      }
    ]
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: '搬入経路図の作成方法',
    description: 'Googleマップ上に経路を描いて、A4横向きPDFとして印刷・保存する手順',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: '住所を入力して地図を表示',
        text: '右側の「現場情報」パネルで住所を入力し、エンターキーを押します。Googleマップが自動で該当地点へ移動します。',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: '経路や重要箇所を描画',
        text: 'ツールバーの「矢印」「円」「テキスト」などで、搬入経路・目印・注意点を地図上に描きます。色・太さも変更可能です。',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: '案件情報を入力',
        text: '右側のパネルで案件名、日程、注意事項などを入力します。これらは印刷時に自動でレイアウトされます。',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: '印刷・PDF保存',
        text: '「印刷」ボタンでA4横向きの高品質PDFを生成・保存できます。ブラウザの印刷機能から直接印刷、またはPDFとして保存できます。',
      },
    ],
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, sans-serif',
        color: '#000'
      }}>
        <div style={{
          marginBottom: '24px'
        }}>
          <Link href="/how-to" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }} className="back-link">
            <span>←</span> 使い方一覧に戻る
          </Link>
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#000',
          textAlign: 'center'
        }}>ひとふで案内図の使い方</h1>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          3分で完成。地図に描いて、印刷して、共有する。<br />
          はじめての方でも迷わず案内図が作れます。
        </p>

        {/* Step 1 */}
        <div style={{
          marginBottom: '24px',
          padding: '24px',
          border: '2px solid #ddd',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#fff'
        }} className="step-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>1</div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              margin: 0
            }}>場所を検索</h2>
          </div>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '12px'
          }}>
            右側のパネルにある「現場住所」欄に住所や施設名を入力してエンターキーを押します。
            Googleマップが自動的にその場所へ移動し、最適なズームレベルで表示されます。
          </p>
          <div style={{
            padding: '12px 16px',
            background: '#f9f9f9',
            border: '1px solid #ddd',
            fontSize: '14px',
            color: '#666'
          }}>
            <strong>ヒント:</strong> 「東京駅」「○○ビル」など、目印になる建物名でも検索できます
          </div>
        </div>

        {/* Step 2 */}
        <div style={{
          marginBottom: '24px',
          padding: '24px',
          border: '2px solid #ddd',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#fff'
        }} className="step-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>2</div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              margin: 0
            }}>地図に描画</h2>
          </div>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '16px'
          }}>
            ツールバーから描画ツールを選んで、地図上をクリック・ドラッグします。
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 12px 0'
          }}>
            {[
              { name: '矢印', desc: '搬入ルートや進行方向を示す' },
              { name: '円', desc: '駐車場や集合場所を囲む' },
              { name: '四角', desc: '建物やエリアを強調' },
              { name: 'テキスト', desc: '注意書きやメモを追加' },
              { name: 'マーカー', desc: '重要ポイントをマーク' }
            ].map((tool, i) => (
              <li key={i} style={{
                fontSize: '14px',
                color: '#555',
                marginBottom: '8px',
                paddingLeft: '16px',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  fontWeight: 'bold'
                }}>•</span>
                <strong>{tool.name}:</strong> {tool.desc}
              </li>
            ))}
          </ul>
          <div style={{
            padding: '12px 16px',
            background: '#f9f9f9',
            border: '1px solid #ddd',
            fontSize: '14px',
            color: '#666'
          }}>
            <strong>ヒント:</strong> 色や太さは「詳細設定」から変更できます。間違えたら「元に戻す」ボタンで取り消せます
          </div>
        </div>

        {/* Step 3 */}
        <div style={{
          marginBottom: '24px',
          padding: '24px',
          border: '2px solid #ddd',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#fff'
        }} className="step-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>3</div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              margin: 0
            }}>案件情報を入力</h2>
          </div>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '12px'
          }}>
            右側のパネルで以下の情報を入力します。印刷時に自動でレイアウトされます。
          </p>
          <ul style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#555',
            paddingLeft: '20px',
            marginBottom: '12px'
          }}>
            <li>案件名（必須）</li>
            <li>搬入日・時間帯</li>
            <li>担当者・連絡先</li>
            <li>車両制限（高さ・重量など）</li>
            <li>注意事項（一方通行、段差など）</li>
          </ul>
          <div style={{
            padding: '12px 16px',
            background: '#f9f9f9',
            border: '1px solid #ddd',
            fontSize: '14px',
            color: '#666'
          }}>
            <strong>ヒント:</strong> 入力しない項目は印刷時に自動で非表示になります
          </div>
        </div>

        {/* Step 4 */}
        <div style={{
          marginBottom: '32px',
          padding: '24px',
          border: '2px solid #ddd',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: '#fff'
        }} className="step-card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>4</div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              margin: 0
            }}>印刷・PDF保存</h2>
          </div>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '12px'
          }}>
            完成したら「印刷」ボタンをクリック。A4横向きのプレビューが表示されます。
          </p>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '12px'
          }}>
            ブラウザの印刷機能から直接印刷、またはPDFとして保存できます。
            高品質な案内図がA4横向き1枚に収まります。
          </p>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            保存したPDFをメールに添付したり、社内システムで共有することで、関係者へ案内図を配布できます。
          </p>
        </div>

        {/* よくある質問へのリンク */}
        <div style={{
          marginTop: '60px',
          padding: '24px',
          background: '#f9f9f9',
          border: '2px solid #ddd'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '12px'
          }}>困ったときは</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '16px'
          }}>
            使い方で分からないことがあれば、よくある質問をご確認ください。
          </p>
          <Link href="/guides/faq" style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            FAQを見る
          </Link>
        </div>

        {/* CTA */}
        <section style={{
          textAlign: 'center',
          paddingTop: '60px',
          marginTop: '60px',
          borderTop: '2px solid #000'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#000'
          }}>さっそく使ってみましょう</h3>
          <Link href="/tools/delivery-guide" style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '8px 8px 0 #000'
          }} className="cta-button">
            無料で案内図を作る
          </Link>
        </section>

        <style dangerouslySetInnerHTML={{ __html: `
          .back-link:hover {
            color: #000 !important;
          }

          .step-card:hover {
            border-color: #000 !important;
            transform: translate(4px, 4px) !important;
            box-shadow: 8px 8px 0 #000 !important;
          }

          .cta-button:hover {
            transform: translate(4px, 4px) !important;
            box-shadow: 4px 4px 0 #000 !important;
          }

          @media (max-width: 768px) {
            .step-card {
              padding: 20px !important;
            }
          }
        `}} />
      </div>
      <Footer />
    </>
  );
}
