import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '建設業向け｜ひとふで案内図',
  description: '建設業界の搬入管理に特化したひとふで案内図の活用法。資材搬入、重機運搬、安全管理などの現場業務を効率化します。',
  alternates: {
    canonical: '/tools/delivery-guide/industries/construction',
  },
};

export default function ConstructionPage() {
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
      }}>建設業向け｜ひとふで案内図</h1>

      <p style={{
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#333',
        marginBottom: '40px'
      }}>
        建設現場の安全と効率を支える搬入経路図作成ツール。
        Googleマップに矢印と注釈を描くだけで、誰にでもわかる案内図が完成します。
      </p>

      <section style={{
        marginBottom: '80px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#000'
        }}>建設現場での課題</h2>

        <div style={{
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000'
          }}>複雑な搬入ルートを正確に伝えたい</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            狭い道路、一方通行、重量制限など、建設現場特有の制約を図面化。
            協力業者や運送会社へ正確に伝達できます。
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
          }}>口頭説明だけでは伝わりにくい</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            電話やメールの文章だけでは誤解が生じやすい搬入ルート。
            地図に矢印を描くことで視覚的に共有できます。
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
          }}>安全管理資料として活用したい</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            朝礼や安全ミーティングで配布できるA4横向きの印刷資料。
            全作業員が同じ情報を共有し、事故リスクを低減します。
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
        }}>ひとふで案内図でできること</h2>

        <ul style={{
          listStyle: 'disc',
          paddingLeft: '20px',
          marginBottom: '16px'
        }}>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            資材搬入ルートを矢印で明示
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            重機搬送経路の事前共有
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            仮設駐車場や荷降ろし位置の図示
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            道幅・電線・橋梁などの注意点を丸印で強調
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            A4横向きで印刷・PDF保存
          </li>
        </ul>
      </section>

      <section style={{
        marginBottom: '80px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#000'
        }}>導入メリット</h2>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '16px'
        }}>
          ・無料で今すぐ使える（アカウント登録不要）<br />
          ・Googleマップベースで現場の位置が正確<br />
          ・印刷して配布、PDF化してメール送付も可能<br />
          ・現場監督も職人も、誰でも直感的に操作できる
        </p>
      </section>

      <section style={{
        textAlign: 'center',
        paddingTop: '60px',
        borderTop: '1px solid #ddd'
      }}>
        <Link href="/tools/delivery-guide" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#000',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '15px',
          marginRight: '16px'
        }}>
          ツールを使う
        </Link>
        <Link href="/guides/cases-construction" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#fff',
          color: '#000',
          border: '1px solid #000',
          textDecoration: 'none',
          fontSize: '15px'
        }}>
          活用例を見る
        </Link>
      </section>
    </div>
  );
}
