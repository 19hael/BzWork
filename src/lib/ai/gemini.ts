import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getGeminiModel(model = "gemini-1.5-flash") {
  if (!genAI) {
    throw new Error("Gemini API key is not configured");
  }
  return genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      topK: 40,
    },
  });
}

export async function generateJsonResponse(
  prompt: string,
  model = "gemini-1.5-flash"
) {
  if (!genAI) {
    throw new Error("Gemini API key is not configured");
  }
  const gemini = getGeminiModel(model);
  const result = await gemini.generateContent(prompt);
  const text = result.response.text();
  return parseGeminiJson(text);
}

export function parseGeminiJson(text: string) {
  if (!text) {
    throw new Error("Gemini response was empty");
  }
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const payload = fenced ? fenced[1] : text;
  const clean = payload
    .trim()
    .replace(/^```/, "")
    .replace(/```$/, "");
  return JSON.parse(clean);
}

export async function logAIInteraction(
  supabase: SupabaseClient<Database>,
  payload: {
    userId: string;
    interactionType: string;
    input: unknown;
    output: unknown;
  }
) {
  try {
    await supabase.from("ai_interactions").insert({
      user_id: payload.userId,
      interaction_type: payload.interactionType,
      input_data: payload.input as Record<string, unknown>,
      output_data: payload.output as Record<string, unknown>,
      is_simulated: false,
    });
  } catch (error) {
    console.error("Failed to log AI interaction", error);
  }
}
