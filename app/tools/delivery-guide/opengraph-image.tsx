import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '搬入経路図｜A4横・PDF対応';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#f8fafc',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 20,
          }}
        >
          搬入経路図
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#64748b',
          }}
        >
          A4横・PDF対応｜ひとふで
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
