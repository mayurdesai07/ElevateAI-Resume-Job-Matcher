import { NextRequest, NextResponse } from "next/server";
import { generateContextualAiResponse, AiCoachContext } from "@/lib/aiCoach";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, context, userApiKey, apiProvider } = body as {
      prompt: string;
      context: AiCoachContext;
      userApiKey?: string;
      apiProvider?: "gemini" | "openai" | "groq";
    };

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const safeContext: AiCoachContext = {
      profile: context?.profile || {
        name: "Friend",
        title: "Technology Professional",
        summary: "Driven professional",
        technicalSkills: ["Analysis", "Problem Solving", "Modern Workflows"],
        softSkills: ["Communication", "Leadership"],
        toolsAndSoftware: ["Git", "Excel"],
        experienceLevel: "Mid",
        yearsOfExperience: 3,
        keyStrengths: ["Execution & Strategy"],
        targetRoles: ["Senior Lead"],
      },
      jobMatches: context?.jobMatches || [],
      oneSkillUnlocks: context?.oneSkillUnlocks || [],
      activeBlueprint: context?.activeBlueprint,
    };

    const systemPrompt = `You are Aria, an elite Executive Career Coach, Talent Architect, and empathetic AI friend at ElevateAI.
User Context:
- Candidate Name: ${safeContext.profile?.name}
- Current Position: ${safeContext.profile?.title}
- Known Technical Skills: ${safeContext.profile?.technicalSkills?.join(", ")}
- Known Tools: ${safeContext.profile?.toolsAndSoftware?.join(", ")}
- Top Job Fit Match: ${safeContext.jobMatches?.[0]?.title || "Senior Analyst"} at ${safeContext.jobMatches?.[0]?.company || "Tech Company"}
- One-Skill Unlock: Missing ${safeContext.oneSkillUnlocks?.[0]?.missingSkills?.join(", ") || "Cloud Data Warehouse"} for +${safeContext.oneSkillUnlocks?.[0]?.salaryBoostPercent || 35}% salary jump
- Currently Viewed Career Blueprint: ${safeContext.activeBlueprint?.title || "Data & Tech"}

Communication Guidelines:
1. Speak warmly, naturally, and supportively like a real human mentor and expert friend.
2. If the user gives a casual greeting or friendly question (e.g. "Hello, what are you doing?", "What do you want from me?", "How are you?"), answer warmly and conversationally first, and naturally connect to how you can support their career goals.
3. If they ask about jobs, study roadmaps, skills, resume rewrites, or salary negotiations, provide concrete, actionable, high-impact advice formatted with clean Markdown headings, bullet points, and practical examples.
4. You have general intelligence—answer ANY question the user asks (career, technical, coding, interview prep, life advice, general knowledge) accurately and engagingly.`;

    // 1. Google Gemini (User key or process.env)
    const geminiKey = userApiKey && apiProvider === "gemini" 
      ? userApiKey 
      : process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

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
                      text: `${systemPrompt}\n\nUser Question: ${prompt}`
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
        console.warn("Gemini call failed, continuing to fallback:", err);
      }
    }

    // 2. OpenAI (User key or process.env)
    const openAiKey = userApiKey && apiProvider === "openai" 
      ? userApiKey 
      : process.env.OPENAI_API_KEY;

    if (openAiKey) {
      try {
        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt }
            ],
            temperature: 0.7
          })
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          const reply = openAiData?.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, source: "openai" });
          }
        }
      } catch (err) {
        console.warn("OpenAI call failed, continuing to fallback:", err);
      }
    }

    // 3. Live Universal AI Engine (Zero-Key Real-Time GPT/Claude via Pollinations)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout for fast response

      // Ultra-fast GET endpoint
      const promptEncoded = encodeURIComponent(prompt.slice(0, 500));
      const sysEncoded = encodeURIComponent(systemPrompt.slice(0, 400));
      const aiRes = await fetch(`https://text.pollinations.ai/${promptEncoded}?system=${sysEncoded}&model=openai`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (aiRes.ok) {
        const reply = await aiRes.text();
        if (reply && reply.trim().length > 5) {
          return NextResponse.json({ reply: reply.trim(), source: "live-ai-engine" });
        }
      }
    } catch (err) {
      // Quietly fallback
    }

    // 4. Default High-Precision Built-in Reasoning Engine (Zero-Downtime Guarantee)
    const reply = generateContextualAiResponse(prompt, safeContext);
    return NextResponse.json({ reply, source: "elevate-ai-core" });
  } catch (error) {
    console.error("AI Coach API error:", error);
    return NextResponse.json(
      { error: "Internal server error in AI Career Coach" },
      { status: 500 }
    );
  }
}
