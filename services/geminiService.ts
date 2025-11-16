
import { GoogleGenAI, Type } from "@google/genai";

export const fetchMotivationalQuotes = async (): Promise<string[]> => {
  try {
    // FIX: Updated Gemini API call to align with SDK guidelines.
    // - Initialize with process.env.API_KEY directly, assuming it is set.
    // - Use responseSchema to get structured JSON output.
    // - Simplified prompt and removed manual JSON parsing logic.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate 10 unique, short, and powerful motivational quotes for a student named Aditya who is preparing for the tough Chartered Accountancy (CA) Foundation exams in India. Keep them encouraging and concise.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A motivational quote for a student.",
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const quotes = JSON.parse(jsonStr);
    
    if (Array.isArray(quotes) && quotes.every(q => typeof q === 'string')) {
      return quotes;
    }
    return [];
  } catch (error) {
    console.error("Error fetching motivational quotes from Gemini:", error);
    return []; // Return empty array on error to trigger fallback
  }
};
