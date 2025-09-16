
import { GoogleGenAI } from "@google/genai";

const getAIResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. Returning a mock response.");
    return new Promise(resolve => setTimeout(() => resolve("This is a mock response because the API key is not configured. In a real environment, I would provide a thoughtful and mindful reply."), 1000));
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are Aura, a personal productivity and wellness companion. Your responses should be calm, concise, and encouraging, fostering a mindful and non-intrusive interaction. Avoid overly complex language and keep the tone serene and supportive."
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export { getAIResponse };
