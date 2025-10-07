import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '活用例｜ひとふで',
  description: '「ひとふで案内図」の様々な業種での活用例をご紹介します。建設、物流、不動産、イベント、介護、教育、冠婚葬祭など幅広い業界で活躍します。',
  alternates: {
    canonical: '/cases/delivery-guide',
  },
};

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
