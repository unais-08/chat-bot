/**
 * Gemini AI Service
 * 
 * Integration with Google Gemini API (v1 SDK) for AI responses
 * Using Gemini 2.5 Flash Lite model for fast, cost-efficient responses
 */

import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class GeminiService {
  constructor() {
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not configured");
      this.ai = null;
    } else {
      this.ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
      });
    }
  }

  /**
   * Generate AI response using Gemini 2.5 Flash Lite
   * @param {string} prompt - The user prompt
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} The generated response text
   */
  async generateResponse(prompt, options = {}) {
    if (!this.ai) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const config = {
        temperature: options.temperature ?? 1,
        topP: options.topP ?? 0.95,
        topK: options.topK ?? 40,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
      };

      // Optional: Enable thinking for more complex tasks
      if (options.enableThinking) {
        config.thinkingConfig = {
          thinkingLevel: options.thinkingLevel ?? ThinkingLevel.LOW,
        };
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config,
      });

      const text = response.text;
      
      if (!text) {
        throw new Error("No response text received from Gemini API");
      }

      console.log("Gemini response generated successfully");
      return text;
    } catch (error) {
      console.error("Gemini API error:", error);

      // Handle specific errors
      if (error.message?.includes("API key")) {
        throw new Error("Invalid Gemini API key");
      }
      if (error.message?.includes("quota")) {
        throw new Error("API quota exceeded. Please try again later.");
      }
      if (error.message?.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
      if (error.message?.includes("INVALID_ARGUMENT")) {
        throw new Error("Invalid request parameters. Please check your input.");
      }

      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  /**
   * Generate streaming response from Gemini
   * @param {string} prompt - The user prompt
   * @param {Function} onChunk - Callback function for each text chunk
   * @param {Object} options - Optional configuration
   */
  async generateStreamingResponse(prompt, onChunk, options = {}) {
    if (!this.ai) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const config = {
        temperature: options.temperature ?? 1,
        topP: options.topP ?? 0.95,
        topK: options.topK ?? 40,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
      };

      if (options.enableThinking) {
        config.thinkingConfig = {
          thinkingLevel: options.thinkingLevel ?? ThinkingLevel.LOW,
        };
      }

      const response = await this.ai.models.generateContentStream({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config,
      });

      for await (const chunk of response.stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          onChunk(chunkText);
        }
      }
    } catch (error) {
      console.error("Gemini streaming error:", error);
      throw new Error(
        `Failed to generate streaming response: ${error.message}`
      );
    }
  }

  /**
   * Generate response with thinking enabled for complex tasks
   * @param {string} prompt - The user prompt
   * @param {string} thinkingLevel - ThinkingLevel.LOW, MEDIUM, or HIGH
   * @returns {Promise<Object>} Response object with thinking and text
   */
  async generateResponseWithThinking(prompt, thinkingLevel = ThinkingLevel.LOW) {
    if (!this.ai) {
      throw new Error("Gemini API key not configured");
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: thinkingLevel,
          },
          maxOutputTokens: 4096,
        },
      });

      return {
        text: response.text,
        thinking: response.thinking || null,
        usageMetadata: response.usageMetadata || null,
      };
    } catch (error) {
      console.error("Gemini thinking response error:", error);
      throw new Error(
        `Failed to generate response with thinking: ${error.message}`
      );
    }
  }
}

export const geminiService = new GeminiService();