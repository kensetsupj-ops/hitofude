import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, type, message } = await request.json();

    // 入力検証
    if (!message) {
      return NextResponse.json(
        { error: '内容を入力してください' },
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

    // typeの日本語ラベル
    const typeLabels: Record<string, string> = {
      'feedback': 'ご意見・ご要望',
      'bug': '不具合報告',
      'question': '質問',
      'other': 'その他',
    };

    const typeLabel = typeLabels[type] || type;

    // typeによって色を変更
    const typeColors: Record<string, number> = {
      'feedback': 0x5865F2, // Blue
      'bug': 0xED4245, // Red
      'question': 0xFEE75C, // Yellow
      'other': 0x99AAB5, // Gray
    };

    const color = typeColors[type] || 0x5865F2;

    // Discordに送信するメッセージを整形
    const discordMessage = {
      embeds: [
        {
          title: `💬 案内図の新しいフィードバック【${typeLabel}】`,
          color: color,
          fields: [
            ...(email ? [{
              name: '📧 メールアドレス',
              value: email,
              inline: false,
            }] : []),
            {
              name: '📂 種類',
              value: typeLabel,
              inline: false,
            },
            {
              name: '💬 内容',
              value: message.length > 1024 ? message.substring(0, 1021) + '...' : message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'ひとふで フィードバックシステム',
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
    console.error('Feedback form error:', error);
    return NextResponse.json(
      { error: '送信に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    );
  }
}
