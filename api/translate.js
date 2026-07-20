import { GoogleGenAI } from '@google/genai';

async function fallbackTranslate(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Translate fallback failed with status ${response.status}`);
  }
  const data = await response.json();
  if (data && data[0]) {
    return data[0].map((x) => x[0]).join('').trim();
  }
  return '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, sourceLang, targetLang } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for translation' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Falling back to Google Translate.");
      const translatedText = await fallbackTranslate(text, sourceLang, targetLang);
      return res.status(200).json({ success: true, translatedText });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Translate the following text from ${sourceLang === 'en' ? 'English' : 'Amharic'} to ${targetLang === 'en' ? 'English' : 'Amharic'}. Provide ONLY the direct translation, nothing else, no quotes, no surrounding text:
      
      "${text}"`,
    });

    const translatedText = response.text?.trim() || '';
    if (translatedText) {
      return res.status(200).json({ success: true, translatedText });
    } else {
      throw new Error('Empty response from Gemini translation model');
    }
  } catch (err) {
    console.warn('Gemini translate failed, trying Google Translate fallback. Error:', err.message || err);
    try {
      const translatedText = await fallbackTranslate(text, sourceLang, targetLang);
      return res.status(200).json({ success: true, translatedText });
    } catch (fallbackErr) {
      console.error('All translation methods failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to translate: ' + (fallbackErr.message || String(fallbackErr)) });
    }
  }
}
