import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const translateText = async (userText, settings) => {
  // Make this function async
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  try {
    const prompt = `Translate the following text: "${userText}" to japanese with the following settings: ${JSON.stringify(
      settings
    )}. Return in this JSON format: { "text": "" }.`; // Correctly format the prompt

    const result = await model.generateContent(prompt);
    const response = result.response;
    const script = await response.text();
    return script;
  } catch (error) {
    console.log('Error generating translation:', error);
    return 'Error generating translation';
  }
};

export async function POST(req) {
  // Get the body
  const { userText, settings } = await req.json(); // Ensure the keys match the request
  console.log(userText, settings);
  const translation = await translateText(userText, settings); // Await the translation
  return Response.json({ translatedText: translation }); // Return the translation in the correct format
}
