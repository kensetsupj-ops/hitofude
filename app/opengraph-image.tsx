import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ひとふで｜搬入経路図';
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
            fontSize: 80,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 20,
          }}
        >
          ひとふで｜搬入経路図
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#64748b',
          }}
        >
          迷いを、ひとふで。
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
