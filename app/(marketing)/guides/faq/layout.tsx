import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'よくある質問｜ひとふで',
  description: '「ひとふで」についてよくいただく質問と回答をまとめました。料金、機能、使い方などの疑問を解消できます。',
  alternates: {
    canonical: '/faq/delivery-guide',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
