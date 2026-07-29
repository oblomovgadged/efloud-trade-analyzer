import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { fetchLatestChartTweet } from '@/lib/twitterFetcher';
import { analyzeTweet } from '@/lib/gemini';
import { saveAnalysis } from '@/lib/storage';
import type { TweetAnalysis } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    if (!username) {
      return NextResponse.json({ success: false, error: 'username parametresi gerekli.' }, { status: 400 });
    }

    // 1. Fetch latest chart tweet
    const tweet = await fetchLatestChartTweet(username);
    if (!tweet) {
      return NextResponse.json({
        success: false,
        error: `@${username} için grafikli tweet bulunamadı. Hesabın doğru olduğundan ve görselli paylaşım yaptığından emin olun.`,
      }, { status: 404 });
    }

    // 2. Run AI analysis
    const { traderAnalysis, teacherExplanation } = await analyzeTweet(
      tweet.tweetText,
      tweet.imageUrls
    );

    // 3. Build & save analysis
    const analysis: TweetAnalysis = {
      id: uuidv4(),
      tweetUrl: tweet.tweetUrl,
      tweetText: tweet.tweetText,
      traderUsername: `@${tweet.authorUsername}`,
      traderDisplayName: tweet.authorUsername,
      imageUrls: tweet.imageUrls,
      analyzedAt: new Date().toISOString(),
      tweetDate: tweet.tweetDate,
      analysis: {
        instruments: traderAnalysis.instruments || ['GENEL'],
        primaryInstrument: traderAnalysis.primaryInstrument || 'GENEL',
        bias: traderAnalysis.bias || 'neutral',
        biasConfidence: traderAnalysis.biasConfidence ?? 50,
        biasReasoning: traderAnalysis.biasReasoning || '',
        summary: traderAnalysis.summary || '',
        detailedAnalysis: traderAnalysis.detailedAnalysis || '',
        teacherExplanation,
        keyLevels: traderAnalysis.keyLevels || [],
        tradingSignals: traderAnalysis.tradingSignals || [],
        chartPatterns: traderAnalysis.chartPatterns || [],
        marketContext: traderAnalysis.marketContext || '',
        riskWarnings: traderAnalysis.riskWarnings || [],
      },
    };

    await saveAnalysis(analysis);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error('Fetch-tweets error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Tweet çekme veya analiz sırasında hata oluştu.',
    }, { status: 500 });
  }
}
