import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export const generateTaskDescription = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // keep this
    });

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};