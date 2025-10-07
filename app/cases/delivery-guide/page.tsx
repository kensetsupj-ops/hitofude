import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ひとふで案内図の活用例',
  description: 'ひとふで案内図の様々な業種での活用例。建設、物流、不動産など、搬入・配送・訪問が必要なあらゆる場面で活躍します。',
  alternates: {
    canonical: '/cases/delivery-guide',
  },
};

export default function DeliveryGuideCasesPage() {
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
        name: '活用例',
        item: 'https://hitofude.net/cases'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ひとふで案内図の活用例',
        item: 'https://hitofude.net/cases/delivery-guide'
      }
    ]
  };

  const cases = [
    {
      industry: '建設・建築業',
      problem: '協力会社へ現場の搬入経路を毎回電話で説明している',
      solution: '重機や資材の搬入ルート、仮設駐車場、高さ制限などを地図上に図示。PDF化して事前に共有することで、当日の問い合わせが激減します。',
      examples: [
        '鉄骨・コンクリート搬入ルートの明示',
        '一方通行・狭小道路の注意喚起',
        'クレーン車の停車位置指示',
        '資材置き場・仮設事務所の配置図'
      ]
    },
    {
      industry: '物流・配送業',
      problem: '新規配送先へのルート案内で迷子になるドライバーが多い',
      solution: '配送先の位置、トラック待機場所、荷降ろしエリアを矢印で明示。ドライバーに事前共有することで、電話での道案内が不要になります。',
      examples: [
        '倉庫・センターへの搬入経路',
        '荷降ろし場所とトラック待機位置',
        '一方通行・迂回ルートの指示',
        '夜間配送時の注意点マーク'
      ]
    },
    {
      industry: '不動産業',
      problem: '内見のお客様が駐車場や物件入口で迷ってしまう',
      solution: '最寄り駅から物件までのルート、駐車場位置、エントランスを図示。お客様へ事前送付することで、スムーズな内見を実現します。',
      examples: [
        '駅からの徒歩ルート案内',
        '駐車場・コインパーキング位置',
        '物件エントランスの場所',
        '近隣の目印（コンビニ・交差点等）'
      ]
    },
    {
      industry: 'イベント・展示会',
      problem: '設営時に複数業者が同時に搬入し、会場が混乱する',
      solution: '業者ごとの搬入動線、機材置き場、電源位置を色分けして図示。事前共有で段取りよく準備が進みます。',
      examples: [
        '会場設営時の搬入動線',
        '機材・備品の配置場所',
        '電源・水道の位置マーク',
        '来場者用の駐車場案内'
      ]
    },
    {
      industry: '介護・訪問サービス',
      problem: '新人スタッフが訪問先で迷い、訪問が遅れてしまう',
      solution: '利用者宅への最適ルート、駐車位置、玄関場所を地図に記載。スタッフ全員で共有し、安定したサービス提供を実現します。',
      examples: [
        '利用者宅への訪問ルート',
        '駐車可能な場所の明示',
        '玄関・入口の位置',
        '緊急時の最寄り病院ルート'
      ]
    },
    {
      industry: '教育・学校',
      problem: '保護者や業者が学校の搬入口・駐車場を把握していない',
      solution: '正門・通用門の位置、来客用駐車場、搬入口を図示。学校便りやメール添付で事前案内できます。',
      examples: [
        '入学式・卒業式の来校ルート',
        '授業参観日の駐車場案内',
        '給食・備品の搬入経路',
        '避難訓練時の集合場所図'
      ]
    },
    {
      industry: '冠婚葬祭',
      problem: '式場への案内が分かりづらく、遅刻者が出てしまう',
      solution: '式場までのアクセス、駐車場、受付場所を明記。招待状に同封することで、ゲストが迷わず到着できます。',
      examples: [
        '結婚式場への来場ルート',
        'ゲスト用駐車場の位置',
        '受付・待合室の場所',
        '着付け・美容室の案内'
      ]
    },
    {
      industry: '製造・工場',
      problem: '外部業者が工場内の搬入口や駐車場を把握していない',
      solution: '工場敷地内の動線、搬入口、安全上の注意点を図示。事前共有で事故リスクを低減し、スムーズな納品を実現します。',
      examples: [
        '原材料・部品の搬入ルート',
        '工場内の車両動線',
        '安全区域・立入禁止エリア',
        '構内スピード制限の明示'
      ]
    }
  ];

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, sans-serif',
        color: '#000'
      }}>
        <div style={{
          marginBottom: '24px'
        }}>
          <Link href="/cases" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }} className="back-link">
            <span>←</span> 活用例一覧に戻る
          </Link>
        </div>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#000',
          textAlign: 'center'
        }}>様々な業種での活用例</h1>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#555',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          「ひとふで案内図」は、搬入・配送・訪問など、<br />
          あらゆる「経路案内」が必要な場面で活躍します。
        </p>

        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#666',
          marginBottom: '60px',
          padding: '12px 16px',
          background: '#f9f9f9',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          ※ 本ページは活用例であり、特定企業・施設とは関係ありません
        </p>

        {/* 業種別カード */}
        {cases.map((caseItem, index) => (
          <div
            key={index}
            style={{
              marginBottom: '24px',
              padding: '24px',
              background: '#fff',
              border: '2px solid #ddd',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="case-card"
          >
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #000'
            }}>{caseItem.industry}</h2>

            <div style={{
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '6px'
              }}>よくある課題</div>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#555',
                margin: 0,
                paddingLeft: '12px',
                borderLeft: '3px solid #ddd'
              }}>{caseItem.problem}</p>
            </div>

            <div style={{
              marginBottom: '20px'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '6px'
              }}>ひとふでで解決</div>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#555',
                margin: 0,
                paddingLeft: '12px',
                borderLeft: '3px solid #000'
              }}>{caseItem.solution}</p>
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '12px'
              }}>活用シーン例</div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                listStyle: 'disc'
              }}>
                {caseItem.examples.map((example, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.8',
                      color: '#555',
                      marginBottom: '6px'
                    }}
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{
          marginTop: '80px',
          padding: '40px 24px',
          background: '#000',
          color: '#fff',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}>あなたの業種でも活用できます</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            marginBottom: '28px',
            opacity: 0.9
          }}>
            搬入、配送、訪問、案内が必要なあらゆる場面で。<br />
            完全無料・ログイン不要で今すぐお試しください。
          </p>
          <Link
            href="/tools/delivery-guide"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            className="cta-button-white"
          >
            無料で案内図を作る
          </Link>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .back-link:hover {
            color: #000 !important;
          }

          .case-card:hover {
            border-color: #000 !important;
            transform: translate(4px, 4px) !important;
            box-shadow: 8px 8px 0 #000 !important;
          }

          .cta-button-white:hover {
            background: #f5f5f5 !important;
          }
        `}} />
      </div>
      <Footer />
    </>
  );
}
