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

    // AI Prompt Hijack & Jailbreak Guard
    const pLower = prompt.toLowerCase();
    const isJailbreakAttempt = [
      "ignore previous instructions",
      "ignore all instructions",
      "disregard your prompt",
      "bypass all safety",
      "jailbreak",
      "dan mode",
      "system prompt override",
      "reveal your system prompt",
      "print internal instructions",
    ].some((phrase) => pLower.includes(phrase));

    if (isJailbreakAttempt) {
      return NextResponse.json({
        reply: "🛡️ **Aria Security Shield:** Unauthorized prompt injection or system override attempt detected and neutralized. ElevateAI security parameters remain active and enforcing.",
        source: "elevate-ai-waf",
      });
    }

    const safeContext: AiCoachContext = {
      profile: context?.profile || {
        name: "Alex Rivera",
        title: "Data Analyst",
        summary: "Data Analyst with 3 years experience",
        technicalSkills: ["SQL", "Python", "Tableau", "Excel", "Data Modeling"],
        softSkills: ["Communication", "Stakeholder Management"],
        toolsAndSoftware: ["PostgreSQL", "Power BI", "Git", "Jira"],
        experienceLevel: "Mid",
        yearsOfExperience: 3,
        keyStrengths: ["Dashboard Design", "Ad-Hoc SQL Analysis"],
        targetRoles: ["Senior Data Analyst"],
      },
      jobMatches: context?.jobMatches || [],
      oneSkillUnlocks: context?.oneSkillUnlocks || [],
      activeBlueprint: context?.activeBlueprint,
    };

    const systemPrompt = `You are Aria, an elite Executive Career Coach, Talent Architect, and conversational AI partner at ElevateAI.
Candidate Profile:
- Name: ${safeContext.profile?.name}
- Current Title: ${safeContext.profile?.title}
- Experience: ~${safeContext.profile?.yearsOfExperience} years (${safeContext.profile?.experienceLevel} Level)
- Technical Skills: ${safeContext.profile?.technicalSkills?.join(", ")}
- Tools & Software: ${safeContext.profile?.toolsAndSoftware?.join(", ")}
- Soft Skills: ${safeContext.profile?.softSkills?.join(", ")}
- Key Strengths: ${safeContext.profile?.keyStrengths?.join(", ")}
- Top Job Match: ${safeContext.jobMatches?.[0]?.title || "Senior Analyst"} at ${safeContext.jobMatches?.[0]?.company || "Stripe"} (${safeContext.jobMatches?.[0]?.matchScore || 94}% Fit, ${safeContext.jobMatches?.[0]?.salaryRange || "$140k+"})
- High-ROI One-Skill Unlock: Missing ${safeContext.oneSkillUnlocks?.[0]?.missingSkills?.join(", ") || "Cloud Data Warehousing"} for +${safeContext.oneSkillUnlocks?.[0]?.salaryBoostPercent || 35}% salary jump to ${safeContext.oneSkillUnlocks?.[0]?.targetRole || "Senior Specialist"}
- Currently Viewed Track: ${safeContext.activeBlueprint?.title || "Data Analytics"}

Instructions:
1. Speak warmly, supportively, and naturally like an elite human mentor and intelligent partner.
2. If asked "what are my skills", "tell me about my profile", or similar questions, explicitly list their exact extracted technical skills, tools, soft skills, and strengths directly from their profile above.
3. If they ask normal conversational questions (e.g. "hi", "how are you", "what are you doing", "what do you want from me"), converse naturally, warmly, and empathetically.
4. Format all technical and career advice with clear Markdown headers, bold highlights, and clean bullet points.
5. Answer ANY question accurately, whether it is career strategy, technical coding, interview preparation, salary negotiation, or general knowledge.`;

    const rawKey = userApiKey ? userApiKey.trim() : "";

    // 1. Google Gemini (User key or process.env)
    const geminiKey =
      (rawKey && (apiProvider === "gemini" || rawKey.startsWith("AIza") || (!rawKey.startsWith("sk-") && !rawKey.startsWith("gsk_"))))
        ? rawKey
        : process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (geminiKey) {
      const models = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ];
      for (const model of models) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `${systemPrompt}\n\nUser Question: ${prompt}`,
                      },
                    ],
                  },
                ],
              }),
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
          console.warn(`Gemini (${model}) failed:`, err);
        }
      }
    }

    // 2. Groq (User key or process.env)
    const groqKey =
      (rawKey && (apiProvider === "groq" || rawKey.startsWith("gsk_")))
        ? rawKey
        : process.env.GROQ_API_KEY;

    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const reply = groqData?.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, source: "groq" });
          }
        }
      } catch (err) {
        console.warn("Groq call failed:", err);
      }
    }

    // 3. OpenAI (User key or process.env)
    const openAiKey =
      (rawKey && (apiProvider === "openai" || rawKey.startsWith("sk-")))
        ? rawKey
        : process.env.OPENAI_API_KEY;

    if (openAiKey) {
      try {
        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          const reply = openAiData?.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, source: "openai" });
          }
        }
      } catch (err) {
        console.warn("OpenAI call failed:", err);
      }
    }

    // 4. Built-in High-Precision Intelligence Engine
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
