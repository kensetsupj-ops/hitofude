import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hitofude.net';
  const lastModified = new Date();

  return [
    // トップページ
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // ツール一覧
    {
      url: `${baseUrl}/tools`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // メインツール
    {
      url: `${baseUrl}/tools/delivery-guide`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // 使い方
    {
      url: `${baseUrl}/how-to`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/how-to/delivery-guide`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // FAQ
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq/delivery-guide`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 活用例
    {
      url: `${baseUrl}/cases`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cases/delivery-guide`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    // 業種別（既存）
    {
      url: `${baseUrl}/tools/delivery-guide/industries/construction`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/delivery-guide/industries/logistics`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // その他ページ
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/sponsors`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
