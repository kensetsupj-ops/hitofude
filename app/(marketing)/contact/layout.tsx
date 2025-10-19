import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ｜ひとふで',
  description: 'ひとふでへのお問い合わせフォーム。ご質問、ご要望、不具合報告など、お気軽にご連絡ください。',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
