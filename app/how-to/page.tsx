import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '使い方｜ひとふで',
  description: 'ひとふでの各ツールの使い方ガイド。はじめての方でも迷わず使えるように、ステップごとに丁寧に解説します。',
  alternates: {
    canonical: '/how-to',
  },
};

export default function HowToIndexPage() {
  const tools = [
    {
      name: 'ひとふで案内図',
      description: '地図に描いて、印刷して、共有する。搬入経路図・案内図を3分で作成',
      href: '/how-to/delivery-guide',
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
      }}>使い方ガイド</h1>

      <p style={{
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#555',
        marginBottom: '60px',
        textAlign: 'center'
      }}>
        各ツールの使い方をステップごとに解説します。<br />
        はじめての方でも迷わず使えます。
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
            .container {
              padding: 140px 16px 40px !important;
            }

            h1 {
              font-size: 24px !important;
            }

            p {
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
