'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FAQ = {
  question: string;
  answer: string | string[];
  category: string;
};

export default function DeliveryGuideFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        name: 'FAQ',
        item: 'https://hitofude.net/faq'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ひとふで案内図のFAQ',
        item: 'https://hitofude.net/faq/delivery-guide'
      }
    ]
  };

  const faqs: FAQ[] = [
    // 基本・料金
    {
      category: '基本・料金',
      question: '料金はかかりますか？',
      answer: '完全無料でご利用いただけます。アカウント登録も不要です。今後も基本機能は無料で提供し続けます。'
    },
    {
      category: '基本・料金',
      question: 'ログインやアカウント登録は必要ですか？',
      answer: '不要です。ブラウザを開いてすぐにご利用いただけます。個人情報の入力も一切不要で、匿名でお使いいただけます。'
    },
    {
      category: '基本・料金',
      question: '商用利用はできますか？',
      answer: '可能です。建設業、物流業、イベント運営など、業務でもご自由にご利用ください。利用規約の範囲内であれば、法人・個人問わずお使いいただけます。'
    },

    // 機能
    {
      category: '機能',
      question: 'どんな図形が描けますか？',
      answer: '矢印、直線、円、四角、ポリゴン、テキスト、マーカー、フリーハンドなど、豊富な描画ツールを用意しています。色や太さ、塗りつぶしも自由に調整できます。'
    },
    {
      category: '機能',
      question: 'PDF保存できますか？',
      answer: 'できます。「印刷」ボタンを押すとプレビューが表示され、ブラウザの印刷機能からPDFとして保存できます。A4横向き、高品質で出力されます。'
    },
    {
      category: '機能',
      question: '作成した案内図を関係者に共有したい',
      answer: 'PDFとして保存し、メールに添付したり、社内システムにアップロードすることで共有できます。印刷した紙を配布することも可能です。'
    },

    // 使い方
    {
      category: '使い方',
      question: '使い方が分かりません',
      answer: '「使い方ガイド」ページで、初めての方でも分かるよう4ステップで解説しています。3分程度で基本操作をマスターできます。'
    },
    {
      category: '使い方',
      question: '住所検索がうまくいきません',
      answer: [
        '以下をお試しください：',
        '• 都道府県から正確に入力（例：東京都千代田区丸の内1-9-1）',
        '• 建物名やランドマークで検索（例：東京駅、○○ビル）',
        '• 半角スペースを入れて検索',
        '',
        'それでも見つからない場合は、近くの大きな建物を検索してから地図を手動で移動してください。'
      ]
    },
    {
      category: '使い方',
      question: '描いた図形を削除したい',
      answer: '図形をクリックして選択状態にし、キーボードの「Delete」キーを押すか、ツールバーの「削除」ツールを選んで図形をクリックしてください。間違えた場合は「元に戻す」ボタンで取り消せます。'
    },
    {
      category: '使い方',
      question: '地図が表示されません',
      answer: [
        '以下をご確認ください：',
        '• インターネット接続が有効か',
        '• ブラウザのJavaScriptが有効か',
        '• 広告ブロッカーが地図の読み込みを妨げていないか',
        '',
        'ページを再読み込みしてもらうと改善することがあります。'
      ]
    },

    // データ・セキュリティ
    {
      category: 'データ・セキュリティ',
      question: 'データは保存されますか？',
      answer: '入力したデータはサーバーには送信されず、主にブラウザ内（ローカルストレージ）で管理されます。作成した案内図は印刷またはPDF保存してご利用ください。'
    },
    {
      category: 'データ・セキュリティ',
      question: '個人情報は収集されますか？',
      answer: 'アカウント登録不要のため、氏名・メールアドレスなどの個人情報は収集しません。アクセス解析のため匿名の利用統計を取得する場合がありますが、個人を特定できる情報は含まれません。'
    },
    {
      category: 'データ・セキュリティ',
      question: 'データが消えてしまいました',
      answer: 'ブラウザのキャッシュやCookieをクリアすると、ローカルストレージのデータも削除される可能性があります。重要なデータは必ずPDF保存しておくことを推奨します。'
    },

    // 環境・互換性
    {
      category: '環境・互換性',
      question: 'スマートフォンでも使えますか？',
      answer: '使えますが、より快適にご利用いただくにはパソコンやタブレットを推奨します。スマートフォンでは画面サイズの制約により、一部の操作がしづらい場合があります。'
    },
    {
      category: '環境・互換性',
      question: 'どのブラウザで使えますか？',
      answer: '最新版のChrome、Edge、Safari、Firefoxでご利用いただけます。Internet Explorerには対応していません。'
    },
    {
      category: '環境・互換性',
      question: 'インターネット接続は必要ですか？',
      answer: '必要です。Googleマップなどの外部サービスを利用するため、インターネット環境が必須です。オフラインでの利用には対応していません。'
    },
    {
      category: '環境・互換性',
      question: '印刷するとレイアウトが崩れます',
      answer: [
        '以下をお試しください：',
        '• ブラウザの印刷設定で「背景のグラフィック」を有効にする',
        '• 用紙サイズを「A4」、向きを「横」に設定',
        '• 余白を「標準」または「なし」に設定',
        '• ブラウザをChrome/Edgeの最新版に更新'
      ]
    }
  ];

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: Array.isArray(faq.answer) ? faq.answer.join('\n') : faq.answer
      }
    }))
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
        maxWidth: '700px',
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, sans-serif',
        color: '#000'
      }}>
        <div style={{
          marginBottom: '24px'
        }}>
          <Link href="/faq" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }} className="back-link">
            <span>←</span> FAQ一覧に戻る
          </Link>
        </div>

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
          「ひとふで案内図」について、よくいただく質問と回答をまとめました。<br />
          質問をクリックすると回答が表示されます。
        </p>

        {categories.map((category, catIndex) => (
          <section key={catIndex} style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#000',
              paddingBottom: '12px',
              borderBottom: '2px solid #000'
            }}>{category}</h2>

            {faqs.filter(f => f.category === category).map((faq, idx) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openIndex === globalIndex;

              return (
                <div
                  key={idx}
                  style={{
                    marginBottom: '16px',
                    border: '2px solid #ddd',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  className="faq-item"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: isOpen ? '#f9f9f9' : '#fff',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#000',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <span style={{ paddingRight: '16px' }}>
                      <span style={{ marginRight: '8px', color: '#666' }}>Q.</span>
                      {faq.question}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      flexShrink: 0,
                      transition: 'transform 0.3s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>▼</span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '20px',
                      background: '#f9f9f9',
                      borderTop: '1px solid #ddd',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <div style={{ color: '#666', marginBottom: '8px', fontWeight: '600' }}>A.</div>
                      {Array.isArray(faq.answer) ? (
                        <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
                          {faq.answer.map((line, i) => (
                            <div key={i} style={{ marginBottom: line === '' ? '8px' : '2px' }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', margin: 0 }}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        {/* 困ったときは */}
        <div style={{
          marginTop: '80px',
          padding: '32px',
          background: '#f9f9f9',
          border: '2px solid #ddd',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '16px'
          }}>解決しない場合は</h3>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '24px'
          }}>
            上記で解決しない場合は、お気軽にお問い合わせください。<br />
            できる限り迅速に対応いたします。
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#000',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }} className="contact-button">
            お問い合わせ
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
          }}>すぐに使ってみる</h3>
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
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .back-link:hover {
            color: #000 !important;
          }

          .faq-item:hover {
            border-color: #000 !important;
          }

          .contact-button:hover,
          .cta-button:hover {
            transform: translate(4px, 4px) !important;
            box-shadow: 4px 4px 0 #000 !important;
          }
        `}} />
      </div>
      <Footer />
    </>
  );
}
