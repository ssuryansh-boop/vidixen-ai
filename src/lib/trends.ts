import { auth } from "@/lib/auth";
import { TrendingSignal } from "@/types";
import { getFallbackSignals } from "./helpers";

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

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        systemMode: "trends",
        niche: activeNiche,
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