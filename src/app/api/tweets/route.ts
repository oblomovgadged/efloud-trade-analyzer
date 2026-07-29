import { NextRequest, NextResponse } from 'next/server';
import { getAllAnalyses, getFilteredAnalyses } from '@/lib/storage';
import type { ApiResponse, TweetAnalysis } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instrument = searchParams.get('instrument') || undefined;
    const trader = searchParams.get('trader') || undefined;
    const bias = (searchParams.get('bias') as any) || undefined;

    let analyses: TweetAnalysis[];

    if (instrument || trader || bias) {
      analyses = await getFilteredAnalyses({ instrument, trader, bias });
    } else {
      analyses = await getAllAnalyses();
    }

    return NextResponse.json({
      success: true,
      data: analyses,
    } satisfies ApiResponse<TweetAnalysis[]>);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
