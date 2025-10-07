import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'よくある質問｜ひとふで',
  description: 'ひとふでの各ツールのよくある質問。料金、使い方、データ、環境など、よくいただく質問と回答をまとめました。',
  alternates: {
    canonical: '/faq',
  },
};

export default function FAQIndexPage() {
  const tools = [
    {
      name: 'ひとふで案内図',
      description: '料金、使い方、データ保存、印刷など、よくいただく質問と回答',
      href: '/faq/delivery-guide',
      status: '公開中'
    },
    // 将来的に他のツールを追加
  ];

  return (
    <>
      <Header />
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
        }}>よくある質問</h1>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          各ツールのよくある質問をまとめました。<br />
          お探しの回答が見つかります。
        </p>

        <div style={{
          display: 'grid',
          gap: '24px'
        }}>
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              style={{
                display: 'block',
                padding: '24px',
                border: '2px solid #ddd',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                background: '#fff'
              }}
              className="tool-card"
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#000',
                  margin: 0
                }}>{tool.name}</h2>
                <span style={{
                  padding: '4px 12px',
                  background: '#000',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>{tool.status}</span>
              </div>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#555',
                margin: 0
              }}>
                {tool.description}
              </p>
            </Link>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .tool-card:hover {
            border-color: #000 !important;
            transform: translate(4px, 4px) !important;
            box-shadow: 8px 8px 0 #000 !important;
          }

          @media (max-width: 768px) {
            .faq-container {
              padding: 80px 16px 40px !important;
            }

            .faq-title {
              font-size: 24px !important;
            }

            .faq-description {
              font-size: 14px !important;
            }

            .tool-card {
              padding: 16px !important;
            }

            .tool-card h2 {
              font-size: 18px !important;
            }

            .tool-card p {
              font-size: 14px !important;
            }
          }
        `}} />
      </div>
      <Footer />
    </>
  );
}
