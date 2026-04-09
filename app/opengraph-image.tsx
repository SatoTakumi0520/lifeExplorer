import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Life Explorer — さまざまなライフスタイルを探索・実践';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FDFCF8 0%, #f5f0e8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '8px', height: '48px', background: '#1c1917', borderRadius: '4px' }} />
          <span style={{ fontSize: '64px', fontWeight: 'bold', color: '#1c1917', letterSpacing: '0.05em' }}>
            Life Explorer
          </span>
        </div>
        <p style={{ fontSize: '28px', color: '#78716c', marginTop: '0' }}>
          誰かのライフスタイルを借りて、まだ知らない自分に出会おう
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          {['ルーティン管理', 'ペルソナ探索', '朝のリマインダー'].map((label) => (
            <div
              key={label}
              style={{
                padding: '12px 28px',
                background: '#1c1917',
                color: '#FDFCF8',
                borderRadius: '24px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
