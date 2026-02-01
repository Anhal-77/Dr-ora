
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

const MODEL_NAME = 'gemini-3-pro-preview';

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = this.ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "عذراً، لم أستطع معالجة طلبك حالياً.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.";
    }
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) onChunk(text);
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      onChunk("حدث خطأ أثناء تلقي الرد.");
    }
  }
}

export const geminiService = new GeminiService();
