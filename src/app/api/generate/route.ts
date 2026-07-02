import { NextResponse } from 'next/server';
import { adminAuth } from "@/lib/firebase-admin";
import { canUseCredit, consumeCredit } from "@/lib/credits";
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

if (!authHeader?.startsWith("Bearer ")) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const token = authHeader.split("Bearer ")[1];

const decoded = await adminAuth.verifyIdToken(token);

const uid = decoded.uid;
const creditStatus = await canUseCredit(uid);

if (!creditStatus.allowed) {
  return NextResponse.json(
    {
      error: "No credits remaining.",
      code: "NO_CREDITS",
      remaining: 0,
    },
    { status: 403 }
  );
}
    const { systemMode, niche, channelHandle, messageHistory } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Gateway Configuration Key Missing" }, { status: 500 });
    }

    let systemInstruction = "";

   if (systemMode === 'chat') {
  systemInstruction = `You are the Vidixen AI Enterprise Ideation Partner. The operator is auditing channel handle @${channelHandle || 'General Context'} inside the "${niche}" macro-sector.

CRITICAL VISUAL FORMATTING & ADAPTIVE LANGUAGE MECHANICS:
Act as a premium layout engine. Avoid messy, unorganized paragraphs. You must dynamically adjust your output language based on the operator's prompt using these strict mechanics:

1. DYNAMIC LANGUAGE MAPPING (CRITICAL):
   - MODE A (DEFAULT HYBRID): If the operator asks for a regional/native script (e.g., "write a script in Punjabi/Hindi"), keep all structural tags, labels, [VISUAL DIRECTION], and [VIRAL MECHANIC] strictly in professional English. ONLY generate the spoken dialogue text (👤 PERSON A, 👥 PERSON B) in the raw, authentic native language (using its native script or clean phonetic Romanized text).
   - MODE B (FULL OVERRIDE): If the operator explicitly demands everything to be in their native language (e.g., "give me everything in Punjabi", "full script in Hindi text only", "all text in Spanish"), you MUST completely translate every single element—including headers, technical brackets, scene notes, mechanics, and labels—into that specific target native language.

2. SECTION HEADERS: Use high-end emojis and uppercase clean spacing.
   Example (Mode A): "⚡ TIMELINE WORKFLOW TRACK" or "📈 RETENTION ACCELERATORS"

3. CINEMATIC SCRIPT SEQUENCE TIMELINES: For scripts, use this exact line-path structure:
   💎 ━━━━━━━━━━━━━━━━━━━━━━━━━ ◯ [START_TIME - END_TIME]
   
   Indent the inner details neatly underneath using dedicated layout assets exactly as shown (translating labels too if Mode B is active):
   🎬 ［VISUAL DIRECTION］ ➔ (Camera actions, transition styles, and editing notes)
   👤 ［PERSON A］ ➔ "Spoken dialogue script lines."
   👥 ［PERSON B］ ➔ "Secondary character response lines."

4. HOOK & VALUE HIGHLIGHTS: Use solid theme color icons for crucial insights.
   ✅ [VIRAL MECHANIC] ➔ Explain why this specific line holds psychological attention.
   🔥 [RETENTION ANGLE] ➔ Highlight pacing edits, B-roll insertions, or audio sound effect cues.

Ensure maximum clean vertical spacing. Make the layout look remarkably sharp, symmetrical, and fully optimized for premium dark-mode dashboards across all language states.`;
} else if (systemMode === 'trends') {
  systemInstruction = `You are the Vidixen AI Real-Time YouTube Data Analyst Engine.
  Analyze the current breakout topics, metadata shifts, and content vectors specifically for the "${niche}" niche.
  Return your findings strictly as a valid JSON array containing exactly 3 objects. Each object must have these exact string keys: "id", "topic", "velocity" (Must be either "Critical", "High", or "Surging"), and "hookAngle".
  Do not wrap the array in markdown code blocks or backticks. Output absolute raw JSON.`;
}
    // Format conversation data for the Gemini multi-turn endpoint
    const contents = systemMode === 'chat'
      ? messageHistory.map((msg: any) => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }))
      : [{ parts: [{ text: `Extract breaking trending signals for ${niche}.` }] }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: systemMode === 'trends' ? { responseMimeType: "application/json" } : undefined
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Upstream Processing Fault: ${errorText}` }, { status: response.status });
    }

    const payload = await response.json();
    const rawAiText = payload.candidates[0].content.parts[0].text;
await consumeCredit(uid);
    const updatedCredits = await canUseCredit(uid);

return NextResponse.json({
  result: rawAiText,
  remainingCredits: updatedCredits.remaining,
});
  } catch (error: any) {
    console.error("API Gateway Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}