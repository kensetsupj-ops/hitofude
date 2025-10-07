import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'よくある質問｜ひとふで案内図',
  description: '「ひとふで案内図」についてよくいただく質問と回答をまとめました。料金、機能、使い方、データ、環境などの疑問を解消できます。',
  alternates: {
    canonical: '/faq/delivery-guide',
  },
};

export default function DeliveryGuideFAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
