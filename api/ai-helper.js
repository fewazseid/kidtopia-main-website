import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context, action, lang, tone } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let systemInstruction = `You are an expert educational administrator, childcare legal consultant, and policy writer. 
Your goal is to help write, refine, and rephrase childcare policies, rules, and guidelines for 'Kidtopia International Daycare'.
You write in a professional, clear, authoritative, yet welcoming tone. Maintain legal precision and clarity.`;

    let contents = '';
    if (action === 'rephrase') {
      contents = `Please rephrase the following policy text to make it more ${tone || 'professional'} and clear. 
Maintain the same core meaning and details, but improve readability, flow, and formatting (e.g. use clean lists, bold headers).
Write in ${lang === 'am' ? 'Amharic' : 'English'}.

Original Text:
"${context || ''}"

Refinement instructions from user:
"${prompt}"

Provide ONLY the updated, beautiful, and complete policy text with NO introductory or concluding remarks.`;
    } else if (action === 'add_clause') {
      contents = `Please add a new policy clause or modify the existing policies based on this instruction:
"${prompt}"

Tone: ${tone || 'Professional & Authoritative'}
Language: ${lang === 'am' ? 'Amharic' : 'English'}

Existing Policy Document Context:
"${context || ''}"

Integrate the new clause seamlessly into the existing policy. If it makes sense to format it as a new numbered section, do so.
Provide ONLY the complete, newly updated entire policy document text, retaining all existing sections and incorporating the new change beautifully. No intro/outro.`;
    } else {
      // action === 'generate' (or fallback)
      contents = `Please generate a highly professional policy clause or section based on the following description:
"${prompt}"

Tone: ${tone || 'Professional & Authoritative'}
Language: ${lang === 'am' ? 'Amharic' : 'English'}

Provide ONLY the direct policy text clause. Do not add any extra explanations or quotes. Ready to be pasted.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const resultText = response.text?.trim() || '';
    if (resultText) {
      return res.status(200).json({ success: true, text: resultText });
    } else {
      throw new Error('Empty response from Gemini AI helper model');
    }
  } catch (err) {
    console.error('Gemini AI helper failed:', err);
    return res.status(500).json({ error: 'Failed to process AI request: ' + (err.message || String(err)) });
  }
}
