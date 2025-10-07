'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';

    return () => {
      document.documentElement.style.overflowX = '';
      document.documentElement.style.overflowY = '';
      document.body.style.overflowX = '';
      document.body.style.overflowY = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, []);

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
