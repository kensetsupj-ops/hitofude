'use client';

import { useEffect } from 'react';

export default function PageLoader() {
  useEffect(() => {
    // DOMが完全に読み込まれたら表示
    const handleLoad = () => {
      document.body.classList.add('loaded');
    };

    // すでに読み込み済みの場合
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // 最悪の場合でも500ms後には表示
    const fallbackTimeout = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 500);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return null;
}
