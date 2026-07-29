import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { analyzeTweet } from '@/lib/gemini';
import { saveAnalysis } from '@/lib/storage';
import type { SubmitTweetRequest, TweetAnalysis, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const adminPass = process.env.ADMIN_PASSWORD;
    if (adminPass) {
      const authHeader = request.headers.get('x-admin-password');
      if (authHeader !== adminPass) {
        return NextResponse.json(
          { success: false, error: 'Yetkisiz erişim. Geçersiz admin şifresi.' } satisfies ApiResponse<never>,
          { status: 401 }
        );
      }
    }

    const body: SubmitTweetRequest = await request.json();

    if (!body.tweetText || !body.imageUrls || body.imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tweet metni ve en az 1 görsel URL\'si zorunludur.' } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Run AI analysis
    const { traderAnalysis, teacherExplanation } = await analyzeTweet(
      body.tweetText,
      body.imageUrls
    );

    const analysis: TweetAnalysis = {
      id: uuidv4(),
      tweetUrl: body.tweetUrl || '',
      tweetText: body.tweetText,
      traderUsername: body.traderUsername || '@Efloud',
      traderDisplayName: body.traderDisplayName || 'Efloud',
      imageUrls: body.imageUrls,
      analyzedAt: new Date().toISOString(),
      tweetDate: body.tweetDate || new Date().toISOString(),
      analysis: {
        instruments: traderAnalysis.instruments || [traderAnalysis.primaryInstrument || 'EURUSD'],
        primaryInstrument: traderAnalysis.primaryInstrument || 'EURUSD',
        bias: traderAnalysis.bias || 'neutral',
        biasConfidence: traderAnalysis.biasConfidence ?? 70,
        biasReasoning: traderAnalysis.biasReasoning || '',
        summary: traderAnalysis.summary || '',
        detailedAnalysis: traderAnalysis.detailedAnalysis || '',
        teacherExplanation: teacherExplanation,
        keyLevels: traderAnalysis.keyLevels || [],
        tradingSignals: traderAnalysis.tradingSignals || [],
        chartPatterns: traderAnalysis.chartPatterns || [],
        marketContext: traderAnalysis.marketContext || '',
        riskWarnings: traderAnalysis.riskWarnings || [],
      },
    };

    await saveAnalysis(analysis);

    return NextResponse.json(
      { success: true, data: analysis } satisfies ApiResponse<TweetAnalysis>,
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Analiz oluşturulurken hata meydana geldi.' } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
