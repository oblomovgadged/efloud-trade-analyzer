import { GoogleGenAI } from '@google/genai';
import { buildTraderPrompt, buildTeacherPrompt } from './prompts';

// Candidate models in order of priority
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export async function analyzeTweet(
  tweetText: string,
  imageUrls: string[]
): Promise<{
  traderAnalysis: any;
  teacherExplanation: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY tanımlanmamış. Lütfen Vercel veya .env dosyasında geçerli bir Gemini API Key ayarlayın.');
  }

  const genAI = new GoogleGenAI({ apiKey });

  // Fetch images and convert to base64 inline data for Gemini Vision
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
  const traderPrompt = buildTraderPrompt(tweetText);
  const parts: any[] = [...validImages, { text: traderPrompt }];

  // Robust generator trying candidate models sequentially
  async function generateContentWithCandidates(contents: any[]) {
    let lastError: any = null;
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const res = await genAI.models.generateContent({
          model: modelName,
          contents,
        });
        if (res && res.text) return res;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }
    const errMsg = lastError?.message || JSON.stringify(lastError);
    if (errMsg.includes('NOT_FOUND') || errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key')) {
      throw new Error(`Gemini API Key yetkisiz veya modeller erişilemez. Lütfen https://aistudio.google.com/ adresinden aldığınız geçerli API key'i Vercel'e ekleyin. (Detay: ${errMsg})`);
    }
    throw new Error(`Gemini analiz üretemedi: ${errMsg}`);
  }

  // 1. Step: Trader Analysis using Gemini Vision
  const traderResult = await generateContentWithCandidates([{ role: 'user', parts }]);
  const rawText = traderResult.text || '';
  let traderAnalysis: any = {};

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      traderAnalysis = JSON.parse(jsonMatch[0]);
    } else {
      traderAnalysis = {
        summary: rawText,
        detailedAnalysis: rawText,
        primaryInstrument: 'GENEL',
        instruments: ['GENEL'],
        bias: 'neutral',
        biasConfidence: 50,
      };
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
  }

  // 2. Step: Teacher Explanation
  const teacherPrompt = buildTeacherPrompt(
    traderAnalysis.detailedAnalysis || traderAnalysis.summary || tweetText,
    traderAnalysis.primaryInstrument || 'Piyasa'
  );

  const teacherResult = await generateContentWithCandidates([
    { role: 'user', parts: [{ text: teacherPrompt }] },
  ]);

  const teacherExplanation = teacherResult.text || 'Açıklama oluşturulamadı.';

  return { traderAnalysis, teacherExplanation };
}
