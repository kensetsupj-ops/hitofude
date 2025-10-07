import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '使い方｜ひとふで案内図',
  description: 'ひとふで案内図の基本的な使い方をステップごとに解説します。地図への描画から印刷まで、はじめての方でも簡単に搬入経路図を作成できます。',
  alternates: {
    canonical: '/how-to/delivery-guide',
  },
};

export default function HowToPage() {
  redirect('/how-to/delivery-guide');
}
