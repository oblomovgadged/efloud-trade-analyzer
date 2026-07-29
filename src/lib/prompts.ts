export function buildTraderPrompt(tweetText: string): string {
  return `Sen profesyonel bir forex/kripto trader ve teknik analistsin. 
Aşağıda bir trader'ın paylaştığı tweet metni ve grafik görseli (veya görselleri) var.

## Görevin:
1. Grafik görselini dikkatle incele — üzerindeki fiyat seviyelerini, kesikli çizgileri, kutuları, formasyonları ve yazılı notları oku.
2. Tweet metnini analiz et.
3. Aşağıdaki JSON formatında tam bir teknik analiz çıkar.

## Tweet Metni:
"""
${tweetText}
"""

## ZORUNLU JSON Output Formatı:
SADECE geçerli bir JSON objesi döndür, markdown kod bloğu dışında hiçbir ekstra açıklama yazma:

{
  "instruments": ["DXY", "EURUSD"],
  "primaryInstrument": "EURUSD",
  "bias": "bearish",
  "biasConfidence": 80,
  "biasReasoning": "DXY'deki bullish ivme ve EURUSD'deki diyagonal destek zorlanması nedeniyle...",
  "summary": "2-3 cümlelik öz anlatım ile ana fikir.",
  "detailedAnalysis": "Paragraf halinde detaylı teknik analiz. Formasyonlar, seviyeler, trend yapısı ve teknik detaylar.",
  "keyLevels": [
    {
      "type": "support",
      "price": 1.1270,
      "label": "Ara Destek",
      "description": "Kesikli çizgi ile belirtilen seviye",
      "strength": "moderate"
    },
    {
      "type": "resistance",
      "price": 1.1500,
      "label": "Ana Direnç",
      "description": "Fiyatın tepki vermesi muhtemel üst bölge",
      "strength": "strong"
    }
  ],
  "tradingSignals": [
    {
      "direction": "short",
      "entryZone": "1.1380 - 1.1400",
      "stopLoss": "1.1450",
      "takeProfit": ["1.1270", "1.1000"],
      "riskReward": "1:2.5",
      "reasoning": "Diyagonal kırılımı veya direnç reddi ile short pozisyon."
    }
  ],
  "chartPatterns": [
    {
      "name": "Bearish Flag",
      "status": "Oluşuyor",
      "implication": "Trend yönünde aşağı devam beklentisi"
    }
  ],
  "marketContext": "Fed faiz kararı ve makroekonomik beklentiler.",
  "riskWarnings": ["Haber saatinde yüksek volatilite ve iki yönlü iğne (spike) riski"]
}

## Kurallar:
- Fiyat seviyelerini (numbers) tam veya yaklaşık sayısal değerler olarak yaz.
- Grafikteki Türkçe veya İngilizce tüm metin notlarını oku.
- Bias mutlaka 'bullish', 'bearish' veya 'neutral' olmalı.
- SADECE JSON objesi döndür.`;
}

export function buildTeacherPrompt(traderAnalysis: string, instrument: string): string {
  return `Sen deneyimli ve samimi bir trading eğitmenisin.
Aşağıda profesyonel bir analistin ${instrument} için hazırladığı teknik analiz var.

Bu analizi, piyasaya yeni başlayan birinin kolayca anlayabileceği, anlaşılır ve eğitici bir dille açıkla.

## Analiz Metni:
"""
${traderAnalysis}
"""

## Açıklama Rehberin:
1. Karmaşık terimleri parantez içinde kısaca açıkla (örn. "Bearish Flag (Düşüş Bayrağı): Fiyatın düşmeye devam edeceğini gösteren bayrak şeklindeki formasyon").
2. "Ne Yapmalı?" başlığı altında trader'ın stratejisini basitçe özetle.
3. Emojilerle (📈📉🎯⚠️🟢🔴) okunabilirliği artır.
4. Sonuna samimi bir risk uyarısı ekle.
5. Türkçe yanıt ver. Markdown biçiminde olsun.`;
}
