import { GoogleGenAI } from '@google/genai';
import { buildUnifiedTraderPrompt } from './prompts';

const PRIMARY_MODEL = 'gemini-2.0-flash';

export async function analyzeTweet(
  tweetText: string,
  imageUrls: string[]
): Promise<{
  traderAnalysis: any;
  teacherExplanation: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY bulunamadı. Lütfen Vercel veya .env.local dosyasında geçerli bir Gemini API Key ayarlayın.');
  }

  const genAI = new GoogleGenAI({ apiKey });

  // Fetch images and convert to base64 inline data for Gemini Vision (optimized size)
  const imageContents = await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch image from URL: ${url}`);
        }
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        return {
          inlineData: { mimeType, data: base64 },
        };
      } catch (err) {
        console.warn(`Could not load image ${url}:`, err);
        return null;
      }
    })
  );

  const validImages = imageContents.filter((img): img is NonNullable<typeof img> => img !== null);
  const unifiedPrompt = buildUnifiedTraderPrompt(tweetText);
  const parts: any[] = [...validImages, { text: unifiedPrompt }];

  async function callGemini(contents: any[]) {
    try {
      return await genAI.models.generateContent({
        model: PRIMARY_MODEL,
        contents,
      });
    } catch (err: any) {
      const errMsg = err?.message || JSON.stringify(err);
      if (err?.status === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('Gemini API Kotası Doldu (429 Rate Limit): Verilen API Key kotalara takıldı veya günlük limit aşıldı. Lütfen https://aistudio.google.com/app/apikey adresinden "AIzaSy..." ile başlayan yeni bir ücretsiz key oluşturun.');
      }
      throw new Error(`Gemini API Hatası: ${errMsg}`);
    }
  }

  // SINGLE API CALL for both Trader Analysis and Teacher Explanation
  const result = await callGemini([{ role: 'user', parts }]);
  const rawText = result.text || '';
  let traderAnalysis: any = {};
  let teacherExplanation = '';

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      traderAnalysis = JSON.parse(jsonMatch[0]);
      teacherExplanation = traderAnalysis.teacherExplanation || '';
    } else {
      traderAnalysis = {
        summary: rawText,
        detailedAnalysis: rawText,
        primaryInstrument: 'GENEL',
        instruments: ['GENEL'],
        bias: 'neutral',
        biasConfidence: 50,
      };
      teacherExplanation = rawText;
    }
  } catch (e) {
    console.error('Failed to parse JSON from Gemini response:', e);
    traderAnalysis = {
      summary: rawText,
      detailedAnalysis: rawText,
      primaryInstrument: 'GENEL',
      instruments: ['GENEL'],
      bias: 'neutral',
      biasConfidence: 50,
    };
    teacherExplanation = rawText;
  }

  return { traderAnalysis, teacherExplanation };
}
