export type Instrument =
  | 'DXY' | 'EURUSD' | 'GBPUSD' | 'USDJPY'
  | 'XAUUSD' | 'BTCUSD' | 'ETHUSD' | 'US30'
  | 'NAS100' | 'SPX500' | 'USOIL'
  | string;

export type Bias = 'bullish' | 'bearish' | 'neutral';
export type LevelStrength = 'strong' | 'moderate' | 'weak';
export type TradeDirection = 'long' | 'short';

export interface KeyLevel {
  type: 'support' | 'resistance';
  price: number;
  label: string;
  description: string;
  strength: LevelStrength;
}

export interface TradingSignal {
  direction: TradeDirection;
  entryZone: string;
  stopLoss: string;
  takeProfit: string[];
  riskReward: string;
  reasoning: string;
}

export interface ChartPattern {
  name: string;
  status: string;
  implication: string;
}

export interface TweetAnalysis {
  id: string;
  tweetUrl: string;
  tweetText: string;
  traderUsername: string;
  traderDisplayName: string;
  imageUrls: string[];
  analyzedAt: string;
  tweetDate: string;
  analysis: {
    instruments: Instrument[];
    primaryInstrument: Instrument;
    bias: Bias;
    biasConfidence: number;
    biasReasoning: string;
    summary: string;
    detailedAnalysis: string;
    teacherExplanation: string;
    keyLevels: KeyLevel[];
    tradingSignals: TradingSignal[];
    chartPatterns: ChartPattern[];
    marketContext: string;
    riskWarnings: string[];
  };
}

export interface SubmitTweetRequest {
  tweetUrl: string;
  tweetText: string;
  traderUsername: string;
  traderDisplayName: string;
  imageUrls: string[];
  tweetDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnalysisFilters {
  instrument?: string;
  trader?: string;
  bias?: Bias;
  dateFrom?: string;
  dateTo?: string;
}
