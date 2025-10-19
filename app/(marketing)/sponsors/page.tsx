import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'スポンサー募集｜ひとふで',
  description: 'ひとふでのスポンサー募集。案内、チェック、指示、共有を支援するツール群の成長を共に支えていただけるパートナーを募集しています。バナー広告掲載、共同開発など様々な形でのご支援を歓迎します。',
  alternates: {
    canonical: '/sponsors',
  },
};

export default function SponsorsPage() {
  return (
    <div style={{
      maxWidth: '640px',
      margin: '0 auto',
      padding: '80px 20px',
      fontFamily: 'system-ui, sans-serif',
      color: '#000'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#000'
      }}>スポンサー募集</h1>

      <p style={{
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#333',
        marginBottom: '40px'
      }}>
        「ひとふで」は、誰でも迷わず"要点をすぐ形に"できる小さなツール群です。
        案内、チェック、指示、共有まで、現場の「伝える」を効率化するサービスの成長を支援いただけるスポンサーを募集しています。
      </p>

      <section style={{
        marginBottom: '80px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#000'
        }}>スポンサーメリット</h2>

        <div style={{
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000'
          }}>サイト全体への掲載</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            各ツールページや本サイト内にスポンサーロゴ・リンクを掲載いたします。
          </p>
        </div>

        <div style={{
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000'
          }}>多様な業界への認知度向上</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            建設、物流、イベント、介護、教育、冠婚葬祭など、幅広い業界のユーザーへリーチできます。
            現場で働く実務担当者に直接アプローチが可能です。
          </p>
        </div>

        <div style={{
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000'
          }}>協働開発・カスタマイズ</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            業界特化版ツールの共同開発や、企業向けカスタマイズのご相談も承ります。
          </p>
        </div>
      </section>

      <section style={{
        marginBottom: '80px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#000'
        }}>募集内容</h2>

        <div style={{
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#000'
          }}>スポンサーシップの形態</h3>
          <ul style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            paddingLeft: '24px',
            marginBottom: '0'
          }}>
            <li style={{ marginBottom: '8px' }}>バナー広告掲載（サイト内・ツール内）</li>
            <li style={{ marginBottom: '8px' }}>業界特化版ツールの共同開発</li>
            <li style={{ marginBottom: '8px' }}>企業向けカスタマイズ版の提供</li>
            <li style={{ marginBottom: '8px' }}>イベント・セミナーでの協賛</li>
            <li style={{ marginBottom: '8px' }}>その他、ご提案ベースでの協働</li>
          </ul>
        </div>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '16px'
        }}>
          「ひとふで」は、今後もツールを拡充し、より多くの現場の課題解決を目指します。
          サービスの成長を共に支えていただけるパートナーをお待ちしています。
        </p>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.8',
          color: '#555'
        }}>
          詳細はお気軽にお問い合わせください。
        </p>
      </section>

      <section style={{
        textAlign: 'center',
        paddingTop: '60px',
        borderTop: '1px solid #ddd'
      }}>
        <Link href="/contact" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#000',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '15px'
        }}>
          お問い合わせ
        </Link>
      </section>
    </div>
  );
}
