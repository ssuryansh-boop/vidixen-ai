import { auth } from "@/lib/auth";
import { TrendingSignal } from "@/types";
import { getFallbackSignals } from "./helpers";

// 🧠 Rotating list of perspective modifiers to force unique LLM outputs on every execution
const ANGLE_MODIFIERS = [
  "under-the-radar subculture anomalies and drama",
  "hidden technical structural shifts and anomalies",
  "recent viral case studies, controversies, and unexpected breakdowns",
  "highly specific microneighborhood discussions and underground tactics",
  "unconventional counter-intuitive strategies gaining sudden traction",
  "highly actionable breaking hacks and workflow automation spikes",
  "emerging terminology, meta concepts, and secret industry tools"
];

export async function syncLiveNicheSignals(
  niche: string
): Promise<TrendingSignal[]> {
  const activeNiche = niche || "Technology";

  try {
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      console.error("User is not authenticated.");
      return getFallbackSignals(activeNiche);
    }

    // ⚡ Pick a completely random angle context to force variable API outputs on reload
    const randomAngle = ANGLE_MODIFIERS[Math.floor(Math.random() * ANGLE_MODIFIERS.length)];

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        systemMode: "trends",
        niche: activeNiche,
        // 🔥 UPDATED: Injects dynamic seed context so your backend prompt stays completely fresh
        randomSeedContext: randomAngle, 
      }),
    });

    const data = await response.json();

    if (data.error || !data.result) {
      console.error("API Error:", data.error);
      return getFallbackSignals(activeNiche);
    }

    let cleanJsonString = data.result.trim();

    if (cleanJsonString.startsWith("```json")) {
      cleanJsonString = cleanJsonString
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/, "");
    } else if (cleanJsonString.startsWith("```")) {
      cleanJsonString = cleanJsonString
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "");
    }

    const parsedArray = JSON.parse(cleanJsonString);

    return Array.isArray(parsedArray)
      ? parsedArray
      : getFallbackSignals(activeNiche);
  } catch (error) {
    console.error("Trend sync failed:", error);
    return getFallbackSignals(activeNiche);
  }
}