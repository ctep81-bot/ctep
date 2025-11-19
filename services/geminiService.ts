import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (
  count: number, 
  difficulty: Difficulty, 
  previousQuestions: string[] = []
): Promise<Question[]> => {
  const model = "gemini-2.5-flash";

  // Take the last 30 questions to avoid token limit issues while maintaining context
  const ignoreList = previousQuestions.slice(-30).join("; ");

  const prompt = `
    生成 ${count} 道关于《圣经》旧约出埃及记（Exodus）第1章到第20章的中文选择题。
    难度等级：${difficulty}。
    
    要求：
    1. 问题必须完全基于出埃及记1-20章的内容（如摩西出生、十灾、过红海、十诫、西奈山之约）。
    2. 每道题有4个选项。
    3. 提供正确的圣经章节引用（例如：出埃及记 12:13）。
    4. 解释部分要简短且有教育意义。
    5. 题目风格要**生动有趣**，不要太枯燥。可以考察细节、人物对话、数字或特定物品。
    6. 确保输出是严格的 JSON 格式。

    ${ignoreList ? `【重要】：请绝对避免生成与以下问题重复或高度相似的题目：\n${ignoreList}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The question text in Chinese" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "An array of 4 possible answers"
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "The zero-based index of the correct answer (0-3)" 
              },
              bibleReference: { type: Type.STRING, description: "The Bible verse reference" },
              explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct" }
            },
            required: ["text", "options", "correctAnswerIndex", "bibleReference", "explanation"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const rawQuestions = JSON.parse(text);
    
    // Add IDs to questions
    return rawQuestions.map((q: any, index: number) => ({
      ...q,
      id: `gen_${Date.now()}_${index}`,
    }));

  } catch (error) {
    console.error("Failed to generate questions:", error);
    throw error;
  }
};