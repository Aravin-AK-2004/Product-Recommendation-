import { GoogleGenAI, Type } from "@google/genai";

// Read API key from Vite environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

// Initialize GoogleGenAI client (safe for optional key handling during UI state checks)
let ai = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

/**
 * Recommends products based on user queries and a lists of products using the Gemini API.
 * 
 * @param {string} userQuery - The user's preference query (e.g. "phones under $500")
 * @param {Array} productList - List of smartphone objects
 * @returns {Promise<number[]>} - Recommended product IDs
 */
export async function recommendProducts(userQuery, productList) {
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY in your env secrets panel."
    );
  }

  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }

  // Simple, direct prompt detailing our catalog structure and formatting constraints
  const promptText = `
    You are a professional smartphone helper.
    Based on the user's preference query, select matching smartphones strictly from the product catalog provided below.
    
    Product Catalog:
    ${JSON.stringify(productList, null, 2)}
    
    User Query:
    "${userQuery}"
    
    Instructions:
    1. Filter and match products based on criteria mentioned in the user query (e.g. price limits, features, brand, operating system, specs as described).
    2. Respond strictly with a JSON object containing the matching product IDs under the list "recommended_ids".
    3. Only include IDs that really exist in the provided catalog.
    4. If no phones are applicable or no matches fit, return '{"recommended_ids": []}'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommended_ids: {
              type: Type.ARRAY,
              items: {
                type: Type.INTEGER,
              },
              description: "Array of product ID integers that match the user request."
            }
          },
          required: ["recommended_ids"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No data returned by Gemini.");
    }

    const parsed = JSON.parse(resultText);
    return parsed.recommended_ids || [];
  } catch (error) {
    console.error("Gemini API Recommendation Error:", error);
    throw new Error(error?.message || "Failed to retrieve smartphone recommendation from Gemini.");
  }
}
