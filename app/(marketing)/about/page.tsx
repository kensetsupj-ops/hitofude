import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ひとふでについて｜ひとふで',
  description: 'ひとふでのミッション、原則、ストーリー、ロードマップ。誰でも迷わず要点をすぐ形にできるツール群を提供します。',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ひとふで',
    url: 'https://hitofude.net',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@hitofude.net',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, "Noto Sans JP", sans-serif',
        lineHeight: 1.8
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#0f172a'
        }}>ひとふでについて</h1>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#0f172a',
            borderLeft: '4px solid #2563eb',
            paddingLeft: '12px'
          }}>ミッション</h2>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
            「ひとふで」は、誰でも迷わず"要点をすぐ形に"できる小さなツール群です。
          </p>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
            案内、チェック、指示、共有まで。余計を足さず、伝わるを最短で。
          </p>
          <p style={{ fontSize: '15px', color: '#475569' }}>
            現場作業、式典、イベント運営、日常業務など、あらゆる場面で「伝える」を効率化し、
            誰もが迷わず行動できる環境をつくることを目指します。
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#0f172a',
            borderLeft: '4px solid #2563eb',
            paddingLeft: '12px'
          }}>原則</h2>
          <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, paddingLeft: '24px' }}>
            <li style={{ marginBottom: '8px' }}>シンプルであること：専門知識不要、直感的な操作</li>
            <li style={{ marginBottom: '8px' }}>すぐ使えること：ログイン不要、無料、ブラウザで完結</li>
            <li style={{ marginBottom: '8px' }}>伝わること：要点だけを整理し、誰にでもわかりやすく</li>
            <li style={{ marginBottom: '8px' }}>実用的であること：現場で本当に役立つ機能に絞る</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#0f172a',
            borderLeft: '4px solid #2563eb',
            paddingLeft: '12px'
          }}>ストーリー</h2>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
            「もっとシンプルに、もっと伝わりやすく」
          </p>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
            建設現場での搬入調整、配送業務での道案内、イベント運営での会場案内など、
            日々の業務で「伝える」ことに時間を取られている現場を数多く見てきました。
          </p>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '12px' }}>
            複雑なツールや手間のかかる作業ではなく、
            誰でもすぐに使えて、要点だけをサッと形にできる。
            そんなツールがあれば、現場の負担は大きく減るはずです。
          </p>
          <p style={{ fontSize: '15px', color: '#475569' }}>
            「ひとふで」は、その想いから生まれました。
            余計な機能を削ぎ落とし、本当に必要なものだけを提供する。
            それがひとふでの姿勢です。
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#0f172a',
            borderLeft: '4px solid #2563eb',
            paddingLeft: '12px'
          }}>ロードマップ</h2>
          <p style={{ fontSize: '15px', color: '#475569', marginBottom: '16px' }}>
            現在は「ひとふで案内図」を提供中です。今後、以下のツールを順次リリース予定です。
          </p>
          <ul style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, paddingLeft: '24px' }}>
            <li style={{ marginBottom: '8px' }}>チェックリスト作成ツール（作業リスト、点検項目の整理）</li>
            <li style={{ marginBottom: '8px' }}>指示書作成ツール（作業手順、マニュアルの簡易作成）</li>
            <li style={{ marginBottom: '8px' }}>座席図・配置図ツール（レイアウト、組織図の可視化）</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px', paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#0f172a'
          }}>運営者情報</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            屋号：ひとふで
            <br />
            所在地：日本国内
            <br />
            Email: <a href="mailto:support@hitofude.net" style={{ color: '#2563eb', textDecoration: 'none' }}>support@hitofude.net</a>
            <br />
            お問い合わせ: <a href="/contact" style={{ color: '#2563eb', textDecoration: 'none' }}>お問い合わせフォーム</a>
          </p>
        </section>
      </div>
    </>
  );
}
