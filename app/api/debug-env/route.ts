import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT_FOUND',
    envVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
  });
}
