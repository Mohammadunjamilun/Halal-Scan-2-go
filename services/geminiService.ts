import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, IngredientStatus, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeImage = async (base64Image: string, language: Language): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Analyze the image provided, which is a label of a food product containing an ingredients list.
    
    Instructions:
    1. Extract all ingredients text with high detail.
    2. **CRITICAL: Do not use generic terms.** Do not say just "Flavorings", "Spices", "Vegetable Oil", or "Seasoning". 
       - Break down composite ingredients into their specific components. 
       - If the label lists "Vegetable Oil (Palm, Sunflower)", list "Palm Oil" and "Sunflower Oil" separately.
       - If the label says "Flavorings", try to identify the specific type or write "Unspecified Flavorings" only as a last resort. 
       - Expand E-numbers to their names (e.g., "E120 (Cochineal)").
    3. For each ingredient, determine if it is strictly Halal, Haram, or Mushbooh (doubtful/needs verification) according to Islamic dietary laws.
    4. Provide the output in the requested language: ${language}.
    5. Provide a very brief reason for the classification (e.g., "Pork derivative", "Alcohol based", "Plant based", "Insect derived").
    6. Determine an overall status for the product.
    
    Return strictly JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1], // Remove 'data:image/jpeg;base64,' prefix
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallStatus: {
              type: Type.STRING,
              enum: [IngredientStatus.HALAL, IngredientStatus.HARAM, IngredientStatus.MUSHBOOH, IngredientStatus.UNKNOWN],
            },
            summary: {
              type: Type.STRING,
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: {
                    type: Type.STRING,
                    enum: [IngredientStatus.HALAL, IngredientStatus.HARAM, IngredientStatus.MUSHBOOH, IngredientStatus.UNKNOWN],
                  },
                  reason: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};