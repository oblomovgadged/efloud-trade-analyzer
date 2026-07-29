import { GoogleGenAI } from '@google/genai';
import { buildTraderPrompt, buildTeacherPrompt } from './prompts';

const MODEL_NAME = 'gemini-2.0-flash';
const FALLBACK_MODEL_NAME = 'gemini-1.5-flash';

export async function analyzeTweet(
  tweetText: string,
  imageUrls: string[]
): Promise<{
  traderAnalysis: any;
  teacherExplanation: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
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

  // Helper for generating content with model fallback
  async function generateWithFallback(contents: any[]) {
    try {
      return await genAI.models.generateContent({
        model: MODEL_NAME,
        contents,
      });
    } catch (err: any) {
      console.warn(`Model ${MODEL_NAME} failed, trying ${FALLBACK_MODEL_NAME}:`, err?.message);
      return await genAI.models.generateContent({
        model: FALLBACK_MODEL_NAME,
        contents,
      });
    }
  }

  // 1. Step: Trader Analysis using Gemini Vision
  const traderResult = await generateWithFallback([{ role: 'user', parts }]);
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

  const teacherResult = await generateWithFallback([
    { role: 'user', parts: [{ text: teacherPrompt }] },
  ]);

  const teacherExplanation = teacherResult.text || 'Açıklama oluşturulamadı.';

  return { traderAnalysis, teacherExplanation };
}
