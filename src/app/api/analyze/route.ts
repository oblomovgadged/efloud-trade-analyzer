import { NextRequest, NextResponse } from 'next/server';
import { analyzeTweet } from '@/lib/gemini';
import type { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { tweetText, imageUrls } = await request.json();

    if (!tweetText || !imageUrls || !imageUrls.length) {
      return NextResponse.json(
        { success: false, error: 'tweetText ve imageUrls alanları zorunludur.' } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const result = await analyzeTweet(tweetText, imageUrls);

    return NextResponse.json({
      success: true,
      data: result,
    } satisfies ApiResponse<any>);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Analiz hatası' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
