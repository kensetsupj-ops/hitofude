'use client';

import InArticleAd from './InArticleAd';

export default function TextContentSection() {
  // テキスト量を概算（使い方セクション約400字 + FAQセクション約800字 = 合計1200字超）
  // → 600字以上あるため広告を挿入
  const shouldShowAd = true; // 本文が600字以上の場合true

  return (
    <div className="text-content-section">
      {/* HowTo Section */}
      <section id="howto" className="content-section">
        <h2>使い方｜簡単3ステップ</h2>
        <div className="howto-steps">
          <div className="step">
            <h3>1. 住所を入力して地図を表示</h3>
            <p>
              右側の「現場情報」パネルで住所を入力し、エンターキーを押してください。Googleマップが自動で該当地点へ移動します。
              地図をドラッグ・ピンチで拡大縮小し、最適な表示範囲に調整できます。
            </p>
          </div>
          <div className="step">
            <h3>2. 経路や重要箇所を描画</h3>
            <p>
              ツールバーの「矢印」「円」「テキスト」などで、搬入経路・目印・注意点を地図上に描きます。
              「詳細設定」を開けば、色・太さ・塗りつぶしなども自由に変更可能。間違えても「戻る」ボタンでやり直せます。
            </p>
          </div>
          <div className="step">
            <h3>3. 印刷</h3>
            <p>
              「印刷」ボタンでA4横向きのプレビュー画面を表示し、ブラウザの印刷機能でPDF保存や実際の印刷が可能です。
              作成した案内図を紙やPDFで関係者へ配布できます。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="content-section">
        <h2>よくある質問（FAQ）</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>Q1. ログインは必要ですか？</h3>
            <p>A. いいえ、ログイン不要で全機能を無料で利用できます。</p>
          </div>
          <div className="faq-item">
            <h3>Q2. 地図が表示されません</h3>
            <p>A. ブラウザのJavaScriptが有効か確認してください。また、一時的な通信エラーの可能性があるため、ページを再読み込みしてみてください。</p>
          </div>
          <div className="faq-item">
            <h3>Q3. 印刷時にGoogleロゴが切れてしまいます</h3>
            <p>A. 仕様上、Googleロゴと著作権表示は常に完全表示されるよう自動調整されます。もし切れる場合はブラウザのページ設定で余白を確認してください。</p>
          </div>
          <div className="faq-item">
            <h3>Q4. 作成した案内図を保存できますか？</h3>
            <p>A. 「印刷」ボタンからPDF保存を行うことで、案内図を保存できます。また、ブラウザのローカルストレージに一時的に保存されるため、ページを閉じる前であれば作成中の案内図は維持されます。</p>
          </div>
          <div className="faq-item">
            <h3>Q5. スマホでも使えますか？</h3>
            <p>A. はい、スマートフォン・タブレットでも利用可能です。ただし、より快適にご利用いただくにはパソコンやタブレットを推奨します。</p>
          </div>
        </div>

        {/* In-article広告（FAQの50%地点、Q5とQ6の間） */}
        {shouldShowAd && <InArticleAd id="faq-mid-article" minHeight={280} />}

        <div className="faq-list">
          <div className="faq-item">
            <h3>Q6. 複数の案件を同時に管理できますか？</h3>
            <p>A. 各案件ごとにPDF保存を行い、ファイル名で管理することをお勧めします。複数のタブで開いて作業することも可能です。</p>
          </div>
          <div className="faq-item">
            <h3>Q7. 地図の範囲を変更したら描画がずれました</h3>
            <p>A. 描画は地理座標（緯度経度）に紐づいているため、地図を動かしても位置はずれません。もしずれる場合はブラウザをリフレッシュしてみてください。</p>
          </div>
          <div className="faq-item">
            <h3>Q8. 印刷品質を上げるには？</h3>
            <p>A. ブラウザの印刷設定で「背景のグラフィック」を有効にし、用紙サイズをA4横向きに設定してください。</p>
          </div>
          <div className="faq-item">
            <h3>Q9. 商用利用は可能ですか？</h3>
            <p>A. はい、利用規約の範囲内で商用利用も可能です。ただし、地図データはGoogleマップの利用規約に従います。</p>
          </div>
          <div className="faq-item">
            <h3>Q10. データはどこに保存されますか？</h3>
            <p>A. すべてブラウザ内（ローカルストレージ）で管理されます。サーバーには送信されません。</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="content-section">
        <h2>活用事例</h2>
        <div className="use-case-list">
          <div className="use-case-item">
            <h3>建設・建築業界</h3>
            <p>
              重機や資材の搬入経路を図示し、現場監督から協力会社へ共有。狭い道路や高さ制限、通行止め区間を明示することで、
              当日のトラブルを防止。A4横1枚で全員が同じ認識を持てます。
            </p>
          </div>
          <div className="use-case-item">
            <h3>物流・配送業</h3>
            <p>
              新規配送先や複雑なルート指示をドライバーへ事前共有。倉庫の搬入口、トラック待機場所、
              一方通行の迂回ルートなどを矢印とテキストで分かりやすく図示できます。
            </p>
          </div>
          <div className="use-case-item">
            <h3>不動産業</h3>
            <p>
              物件内見時の案内図や駐車場の位置をお客様へ事前共有。最寄り駅からの徒歩ルート、
              コインパーキングの場所、物件の入口などを明示して、スムーズな内見をサポートします。
            </p>
          </div>
          <div className="use-case-item">
            <h3>イベント・展示会</h3>
            <p>
              会場設営時の搬入動線、機材置き場、電源位置などを地図上にマーク。
              複数の業者が同時に動く際の混乱を防ぎ、スムーズな準備が可能になります。
            </p>
          </div>
          <div className="use-case-item">
            <h3>介護・訪問サービス</h3>
            <p>
              訪問先への最適ルート、駐車場所、玄関位置を新人スタッフへ共有。
              住宅街の入り組んだ道でも迷わず到着でき、サービス品質の向上につながります。
            </p>
          </div>
          <div className="use-case-item">
            <h3>教育機関</h3>
            <p>
              校外学習や遠足の集合場所、避難経路、通学路の危険箇所を保護者や生徒へ共有。
              新入生向けのキャンパスマップや、部活動の遠征先への案内図作成にも活用できます。
            </p>
          </div>
          <div className="use-case-item">
            <h3>冠婚葬祭</h3>
            <p>
              結婚式場や葬儀場への案内図を招待状やご案内に添付。駅からのルート、駐車場の位置、
              複数の入口がある会場では正しい受付場所を明示して、ゲストの迷いを防ぎます。
            </p>
          </div>
          <div className="use-case-item">
            <h3>飲食・ケータリング</h3>
            <p>
              デリバリースタッフへの配達先案内や、ケータリングサービスの搬入経路を図示。
              大型ビルの搬入口、マンションの駐車場、わかりにくい入口を事前に共有して配達ミスを削減。
            </p>
          </div>
          <div className="use-case-item">
            <h3>自治体・公共機関</h3>
            <p>
              防災訓練の避難経路、災害時の避難所への誘導マップ、工事・イベント時の迂回路案内など。
              住民への分かりやすい情報提供により、地域の安全・安心に貢献します。
            </p>
          </div>
          <div className="use-case-item">
            <h3>医療・往診</h3>
            <p>
              在宅医療や訪問看護の往診ルートを医師・看護師へ共有。患者宅への細かい道順、
              駐車スペース、緊急時の最短ルートなどを記録・管理できます。
            </p>
          </div>
          <div className="use-case-item">
            <h3>観光・旅行業</h3>
            <p>
              ツアー参加者への集合場所案内、観光スポット周遊ルート、おすすめ散策コースの提案など。
              地図に見どころやトイレ、休憩所をマークして、旅行者に親切な案内を提供できます。
            </p>
          </div>
          <div className="use-case-item">
            <h3>農業・圃場管理</h3>
            <p>
              広大な農地や複数の圃場への作業員の誘導、収穫物の集荷トラックへの案内図作成。
              農道の入口、ゲートの位置、作業エリアを明示して、スムーズな農作業をサポートします。
            </p>
          </div>
        </div>
      </section>

      {/* Changelog Section */}
      <section id="changelog" className="content-section">
        <h2>更新履歴</h2>
        <div className="changelog-list">
          <div className="changelog-item">
            <h3>2025年10月 - v0.9 ベータ版リリース</h3>
            <ul>
              <li>住所入力による地図自動移動機能</li>
              <li>矢印・直線・円・四角・テキスト・フリーハンド描画</li>
              <li>折れ線矢印・角丸四角形の描画対応</li>
              <li>A4横向き印刷機能</li>
            </ul>
          </div>
        </div>
      </section>

      <style jsx>{`
        .text-content-section {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          font-family: system-ui, "Noto Sans JP", sans-serif;
        }

        .content-section {
          margin-bottom: 60px;
          scroll-margin-top: 80px; /* ヘッダー(52px) + 余白(28px) */
        }

        .content-section h2 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 3px solid #333;
          color: #333;
        }

        .howto-steps {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step {
          padding: 20px;
          background: #f9f9f9;
          border-left: 4px solid #333;
        }

        .step h3 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
          color: #333;
        }

        .step p {
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }

        .faq-list,
        .use-case-list,
        .changelog-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .faq-item,
        .use-case-item,
        .changelog-item {
          padding: 16px;
          background: #fafafa;
          border: 1px solid #e0e0e0;
        }

        .faq-item h3,
        .use-case-item h3,
        .changelog-item h3 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }

        .faq-item p,
        .use-case-item p {
          font-size: 15px;
          line-height: 1.7;
          color: #555;
        }

        .changelog-item ul {
          margin-left: 20px;
          font-size: 15px;
          line-height: 1.8;
          color: #555;
        }

        .changelog-item li {
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .text-content-section {
            padding: 0 16px;
            margin: 30px auto;
          }

          .content-section h2 {
            font-size: 24px;
          }

          .step h3,
          .faq-item h3,
          .use-case-item h3,
          .changelog-item h3 {
            font-size: 16px;
          }

          .step p,
          .faq-item p,
          .use-case-item p,
          .changelog-item ul {
            font-size: 14px;
          }
        }

        @media print {
          .text-content-section {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}