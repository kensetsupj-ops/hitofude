import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '物流向け｜ひとふで案内図',
  description: '物流業界の配送効率化に役立つひとふで案内図。配送ルート、荷降ろし場所、駐車位置などをわかりやすく図示し、ドライバーに伝えます。',
  alternates: {
    canonical: '/tools/delivery-guide/industries/logistics',
  },
};

export default function LogisticsPage() {
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
      }}>物流向け｜ひとふで案内図</h1>

      <p style={{
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#333',
        marginBottom: '40px'
      }}>
        配送先への正確な道案内で、ドライバーの負担を軽減。
        ひとふで案内図なら、地図に矢印と一言を描くだけで伝わる案内図ができあがります。
      </p>

      <section style={{
        marginBottom: '80px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '32px',
          color: '#000'
        }}>物流現場での課題</h2>

        <div style={{
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000'
          }}>配送先が見つけにくい</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            住所だけではわかりにくい配送先。入口、駐車場、荷降ろし場所を地図上に明示することで、ドライバーが迷わず到着できます。
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
          }}>電話対応の手間を減らしたい</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            「今どこですか？」「どこを曲がればいいですか？」
            こうした問い合わせを減らすため、事前に経路図を共有できます。
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
          }}>複数のドライバーに同じ情報を伝えたい</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555'
          }}>
            定期配送や複数便がある場合、印刷して配布すれば全員に同じ情報を共有できます。
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
            配送ルートを矢印で図示
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            駐車位置、荷降ろし場所を丸印で強調
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            注意点や目印をテキストで追記
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            A4横向きで印刷、またはPDF化してメール送信
          </li>
          <li style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '8px'
          }}>
            Googleマップベースなので位置情報が正確
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
        }}>活用シーン</h2>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '16px'
        }}>
          ・大型トラックの配送ルート案内<br />
          ・倉庫や工場への搬入経路図<br />
          ・イベント会場への荷物搬入<br />
          ・定期配送先の道案内マニュアル<br />
          ・新人ドライバーへの教育資料
        </p>
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
          ・無料・ログイン不要で今すぐ使える<br />
          ・誰でも直感的に操作できるシンプルな設計<br />
          ・配送時間の短縮、問い合わせ対応の削減<br />
          ・ドライバーの負担軽減と安全性向上
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
          fontSize: '15px'
        }}>
          ツールを使う
        </Link>
      </section>
    </div>
  );
}
