/**
 * OpenRouter AI Interface for Aynzo Tools
 * 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
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.aynzo.com";
const SITE_NAME = "Aynzo Tools Platform";

export async function askAI(prompt: string, model: string = "google/gemini-2.0-flash-001") {
  if (!OPENROUTER_API_KEY) {
    console.error("[AI] No OpenRouter Key Found");
    return null;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": model,
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("[AI] Error:", data);
        return null;
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("[AI] Fetch Error:", error);
    return null;
  }
}
