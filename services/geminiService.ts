
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getMotivationalQuote(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, powerful motivational quote for a runner. Make it inspiring and under 20 words.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational quote:", error);
    return "The journey of a thousand miles begins with a single step. Keep going!";
  }
}
   