import { NextRequest, NextResponse } from "next/server";
import { generateContextualAiResponse, AiCoachContext } from "@/lib/aiCoach";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, context } = body as { prompt: string; context: AiCoachContext };

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Check for optional API keys (Gemini, OpenAI, Groq)
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are Aria, an elite Executive Career Coach and AI Talent Architect at ElevateAI.
User Context:
- Name: ${context.profile?.name}
- Current Title: ${context.profile?.title}
- Skills: ${context.profile?.technicalSkills?.join(", ")}
- Tools: ${context.profile?.toolsAndSoftware?.join(", ")}
- Top Job Match: ${context.jobMatches?.[0]?.title} at ${context.jobMatches?.[0]?.company}
- One-Skill Unlock: Missing ${context.oneSkillUnlocks?.[0]?.missingSkills?.join(", ")} for +${context.oneSkillUnlocks?.[0]?.salaryBoostPercent}% salary boost
- Currently Viewed Career Track: ${context.activeBlueprint?.title || "None"}

Provide an encouraging, ultra-crisp, high-impact career advisory response in Markdown format.
User Prompt: ${prompt}`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, source: "gemini" });
          }
        }
      } catch (err) {
        console.warn("Gemini call failed, falling back to built-in reasoning engine:", err);
      }
    }

    // Default high-precision built-in AI reasoning engine
    const reply = generateContextualAiResponse(prompt, context);
    return NextResponse.json({ reply, source: "elevate-ai-core" });
  } catch (error) {
    console.error("AI Coach API error:", error);
    return NextResponse.json(
      { error: "Internal server error in AI Career Coach" },
      { status: 500 }
    );
  }
}
