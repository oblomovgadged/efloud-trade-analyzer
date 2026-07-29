export const INSTRUMENT_CONFIG: Record<string, { label: string; color: string; category: string }> = {
  DXY:     { label: 'US Dollar Index', color: '#4ade80', category: 'Forex' },
  EURUSD:  { label: 'Euro / US Dollar', color: '#60a5fa', category: 'Forex' },
  GBPUSD:  { label: 'British Pound / US Dollar', color: '#f472b6', category: 'Forex' },
  USDJPY:  { label: 'US Dollar / Japanese Yen', color: '#fb923c', category: 'Forex' },
  XAUUSD:  { label: 'Gold / US Dollar', color: '#fbbf24', category: 'Commodity' },
  BTCUSD:  { label: 'Bitcoin / US Dollar', color: '#f97316', category: 'Crypto' },
  ETHUSD:  { label: 'Ethereum / US Dollar', color: '#818cf8', category: 'Crypto' },
  US30:    { label: 'Dow Jones', color: '#34d399', category: 'Index' },
  NAS100:  { label: 'Nasdaq 100', color: '#a78bfa', category: 'Index' },
  SPX500:  { label: 'S&P 500', color: '#fb7185', category: 'Index' },
  USOIL:   { label: 'Crude Oil', color: '#78716c', category: 'Commodity' },
};

export const BIAS_COLORS = {
  bullish: { bg: '#064e3b', text: '#6ee7b7', border: '#10b981', emoji: '🟢' },
  bearish: { bg: '#4c0519', text: '#fda4af', border: '#f43f5e', emoji: '🔴' },
  neutral: { bg: '#422006', text: '#fde68a', border: '#f59e0b', emoji: '🟡' },
} as const;

export const STRENGTH_COLORS = {
  strong:   '#ef4444',
  moderate: '#f59e0b',
  weak:     '#6b7280',
} as const;
