import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, category, subject, message } = await request.json();

    // 入力検証
    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // Discord Webhook URL
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('DISCORD_WEBHOOK_URL is not set');
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      );
    }

    // カテゴリによって色を変更
    const categoryColors: Record<string, number> = {
      '不具合報告': 0xED4245, // Red
      '機能の要望': 0x57F287, // Green
      'フィードバック・感想': 0x5865F2, // Blue
      '使い方の質問': 0xFEE75C, // Yellow
      'その他': 0x99AAB5, // Gray
    };

    const color = categoryColors[category] || 0x5865F2;

    // Discordに送信するメッセージを整形
    const discordMessage = {
      embeds: [
        {
          title: `📨 新しいお問い合わせ【${category}】`,
          color: color,
          fields: [
            {
              name: '👤 お名前',
              value: name,
              inline: true,
            },
            {
              name: '📧 メールアドレス',
              value: email,
              inline: true,
            },
            {
              name: '📂 カテゴリ',
              value: category,
              inline: false,
            },
            {
              name: '📝 件名',
              value: subject,
              inline: false,
            },
            {
              name: '💬 お問い合わせ内容',
              value: message.length > 1024 ? message.substring(0, 1021) + '...' : message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'ひとふで お問い合わせシステム',
          },
        },
      ],
    };

    // Discord Webhookに送信
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: '送信に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    );
  }
}
