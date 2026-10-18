import { CareerBlueprint, JobMatch, OneSkillUnlock, ResumeProfile } from "@/types";

export interface AiCoachContext {
  profile: ResumeProfile;
  jobMatches: JobMatch[];
  oneSkillUnlocks: OneSkillUnlock[];
  activeBlueprint?: CareerBlueprint | null;
}

export function generateContextualAiResponse(
  prompt: string,
  context?: AiCoachContext
): string {
  const p = prompt ? prompt.toLowerCase().trim() : "";
  const safeContext = context || ({} as AiCoachContext);
  const profile = safeContext.profile || {
    name: "Friend",
    title: "Technology Professional",
    technicalSkills: ["Analysis", "Problem Solving", "Modern Workflows"],
    softSkills: ["Communication"],
    toolsAndSoftware: ["Software Tooling"],
    experienceLevel: "Mid" as const,
    yearsOfExperience: 3,
    keyStrengths: ["Execution & Strategy"],
    targetRoles: ["Senior Role"],
    summary: "Dedicated professional",
  };
  const activeBlueprint = safeContext.activeBlueprint;
  const oneSkillUnlocks = safeContext.oneSkillUnlocks || [];
  const jobMatches = safeContext.jobMatches || [];

  // 1. Casual greetings & Human chit-chat
  if (
    p.match(/^(hi|hello|hey|hola|greetings|good\s*(morning|afternoon|evening))\b/i) ||
    p.includes("what are you doing") ||
    p.includes("how are you") ||
    p.includes("what's up") ||
    p.includes("what do you want") ||
    p.includes("who are you")
  ) {
    if (p.includes("what do you want") || p.includes("what want from me")) {
      return `Hey ${profile.name}! 😊 Nothing complicated at all—I'm just here as your personal career mentor and partner. 

Whether you want to find a high-paying job, figure out what skills you need next, rewrite your resume bullets, or just chat about how your career is going, I've got your back. 

How are you doing today? Are you looking for new job opportunities, or just exploring?`;
    }

    if (p.includes("what are you doing")) {
      return `Hey ${profile.name}! Right now, I'm analyzing the latest job market postings and looking at how your resume fits roles like **${jobMatches[0]?.title || "Senior Analyst"}** at companies like **${jobMatches[0]?.company || "Stripe"}**.

I'm feeling great and ready to help! What are you working on today? Want to look at some job matches, or have a question on your mind?`;
    }

    return `Hey ${profile.name}! 👋 Great to chat with you! 

I'm **Aria**, your AI Career Coach at ElevateAI. I'm tuned into your background as a **${profile.title}**, and I'm ready to help with anything—from practicing interview questions and salary negotiation, to planning your next career move, or just talking through ideas.

What's on your mind today? How can I help you out?`;
  }

  // 2. "Tell me a joke" or lighthearted prompts
  if (p.includes("joke") || p.includes("make me laugh")) {
    return `Here's one for tech professionals: 😄

*Why do programmers prefer dark mode?*
**Because light attracts bugs!** 🐛

*And for data people:*
*There are 10 types of people in this world: those who understand binary, and those who don't.*

Now back to business—how can I help you land that next high-paying role today?`;
  }

  // 3. Gratitude
  if (p.includes("thank") || p.includes("thanks") || p.includes("appreciate")) {
    return `You're so very welcome, ${profile.name}! ❤️ That's what I'm here for. Feel free to ask anything else anytime—whether it's big career moves, quick resume tweaks, or interview tips. We've got this!`;
  }

  // 4. Why missing out on Senior roles
  if (p.includes("senior") || p.includes("missing out") || p.includes("unlock") || p.includes("gap")) {
    const topUnlock = oneSkillUnlocks[0];
    const missing = topUnlock ? topUnlock.missingSkills.join(" & ") : "Cloud Architecture and System Design";
    const target = topUnlock ? topUnlock.targetRole : "Senior Specialist";
    const boost = topUnlock ? `+${topUnlock.salaryBoostPercent}% salary boost` : "+35% salary boost";

    return `### 🎯 Why You're Missing Out on Senior Roles Right Now

Looking at your profile (**${profile.name}**, currently positioned as **${profile.title}** with ~${profile.yearsOfExperience} years of experience), here is the exact diagnosis:

1. **You already have the core execution muscle (80%–90% fit):**
   - You have strong command over **${profile.technicalSkills.slice(0, 4).join(", ")}**.
   - Hiring managers already trust you to complete assigned tickets and build standard deliverables.

2. **The "Missing Link" holding you back:**
   - For **${target}** roles paying upwards of **$140k–$180k**, hiring committees look for candidates who master **${missing}**.
   - Right now, your resume reflects individual execution rather than architectural leverage and cloud-scale ownership.

3. **Your Fast-Track Remedy (${boost}):**
   - **Step 1:** Complete the targeted bridge project: *"${topUnlock?.bridgePlan?.portfolioProject?.title || "Modern Cloud Pipeline"}"*.
   - **Step 2:** Update your resume bullet points from "Assisted with queries" to "Architected distributed pipelines cutting data latency by 40%".
   - **Estimated Time to Close This Gap:** **${topUnlock?.bridgePlan?.estimatedTimeToLearn || "3 to 4 weeks"}** dedicating ~6–8 hours/week.

Would you like me to generate a tailored 4-week study schedule for **${missing}**, or draft the exact bullet points for your resume right now?`;
  }

  // 5. Explanations (e.g. "Explain machine learning", "What is SQL?")
  if (p.includes("explain") || p.startsWith("what is ") || p.includes("how does ")) {
    if (p.includes("machine learning") || p.includes("ai")) {
      return `### 🤖 Machine Learning Explained Simply (Like You're 5!)

Imagine you want to teach a child to recognize a dog:
1. You don't write down a list of rules like *"A dog has 4 legs, fur, and two eyes"* (because cats and bears do too!).
2. Instead, you show them **thousands of pictures** of dogs: *"Look, that's a dog! That's a dog too!"*
3. Eventually, their brain spots the patterns on its own. When they see a brand new dog at the park, they instantly shout: *"Dog!"*

**That is Machine Learning!**
Instead of humans programming every single rule, we feed the computer lots of examples (data). The computer finds the mathematical patterns and learns how to make predictions on its own!

In modern tech roles, ML powers Spotify song recommendations, Netflix shows, and self-driving cars. 

Would you like to know how machine learning fits into your current career path?`;
    }

    if (p.includes("python")) {
      return `### 🐍 What is Python?
**Python** is one of the world's most popular programming languages because it reads almost like plain English. 

It is the #1 tool for:
- **Data Analysis & AI:** Pandas, NumPy, and PyTorch
- **Web Development:** Backend APIs with FastAPI and Django
- **Automation:** Writing scripts that do in 2 seconds what used to take 2 hours!

Because of its simplicity and power, Python skills command salaries between **$110k–$190k** across data and software roles.`;
    }
  }

  // 6. Study schedule & Learning Roadmaps
  if (
    p.includes("study schedule") ||
    p.includes("study plan") ||
    p.includes("3 months") ||
    p.includes("12 weeks") ||
    p.includes("roadmap") ||
    p.includes("how to become") ||
    (p.includes("schedule") && !p.includes("interview"))
  ) {
    const targetRole = activeBlueprint?.title || "Data Analyst";

    return `### 🗓️ Customized 12-Week Fast-Track Blueprint for **${targetRole}**
**Candidate:** ${profile.name} | **Current Strengths:** ${profile.technicalSkills.slice(0, 3).join(", ") || "Foundational Skills"}

Because you already bring valuable analytical and technical foundations, we can skip beginner fluff and accelerate directly into high-ROI skills.

---

#### 📍 Phase 1: Weeks 1–3 — Advanced SQL & Database Modeling
- **Weekly Commitment:** 8 hours (1 hr weekday, 3 hrs weekend)
- **Focus:** Window functions (\`OVER\`, \`PARTITION BY\`, \`ROW_NUMBER\`, \`LEAD/LAG\`), CTEs, and query indexing.
- **Milestone Project:** Build an E-Commerce Retention & Cohort Analysis schema in PostgreSQL.
- **Verified Resources:** LeetCode SQL 50 + StrataScratch real company interview questions.

#### 📍 Phase 2: Weeks 4–6 — Executive BI & Visual Storytelling
- **Focus:** Power BI (DAX, Star Schema) or Tableau (LOD expressions, Parameter Actions).
- **Milestone Project:** Executive SaaS Churn & Revenue Retention Dashboard with interactive filters.
- **Verified Resources:** Maven Analytics / Tableau Public gallery case studies.

#### 📍 Phase 3: Weeks 7–9 — Python Automation & Statistical A/B Testing
- **Focus:** Pandas dataframe transformations, clean EDA, hypothesis testing (p-values, confidence intervals).
- **Milestone Project:** Automated marketing campaign funnel evaluation script calculating statistical significance.

#### 📍 Phase 4: Weeks 10–12 — Cloud Warehouse (Snowflake) & Interview Prep
- **Focus:** Snowflake basics, dbt transformation fundamentals, behavioral STAR stories, and portfolio presentation.
- **Capstone Deliverable:** Live GitHub portfolio showcasing 3 end-to-end case studies with executive summary decks.

Would you like me to break down **Week 1's day-by-day checklist** with practice query exercises?`;
  }

  // 6. Resume rewrite
  if (p.includes("bullet") || p.includes("rewrite") || p.includes("resume") || p.includes("xyz")) {
    return `### ✨ High-Impact Resume Rewrite (Google XYZ Formula)
*Formula: "Accomplished [X] as measured by [Y] by doing [Z]"*

Here is how we elevate your current bullet points from basic task descriptions into executive, metric-driven achievements:

---

#### 🔴 Before (Standard Mid-Level Bullets):
> *"Responsible for writing SQL queries and creating Tableau dashboards for marketing team."*
> *"Cleaned customer data using Python and Pandas for weekly reports."*

#### 🟢 After (High-Converting Senior Bullets):
> 🚀 **"Architected 12+ automated Tableau & SQL business intelligence dashboards tracking $45M in annual ARR, reducing executive report retrieval latency by 38%."**
> 
> 🚀 **"Engineered reproducible Python/Pandas data normalization pipelines across 10M+ customer touchpoint records, saving 15 engineering hours weekly."**
> 
> 🚀 **"Designed and evaluated 25+ statistical A/B experimentation funnels, directly identifying checkout friction points and improving conversion by 14.2% ($820k annualized incremental revenue)."**

---

#### 💡 Key Enhancements Made:
1. Replaced passive verbs (*"Responsible for"*) with active ownership verbs (*"Architected"*, *"Engineered"*, *"Designed"*).
2. Quantified business impact with concrete numbers ($45M ARR, 15 hrs saved, 14.2% conversion).
3. Explicitly highlighted modern tooling (SQL, Tableau, Python, A/B Testing) that automated ATS keyword parsers reward.

Would you like me to tailor bullet points for a specific job from your matched listings?`;
  }

  // 7. Salary negotiation
  if (p.includes("salary") || p.includes("negotiat") || p.includes("money") || p.includes("offer")) {
    return `### 💰 Salary Negotiation Script for Top-of-Band Compensation

When negotiating for roles like **${jobMatches[0]?.title || "Senior Analyst"}** (${jobMatches[0]?.salaryRange || "$145k-$175k"}), follow this battle-tested playbook:

1. **Anchor High with Market Data:**
   *"Based on my track record optimizing pipelines at scale and the current market benchmarks for someone with my SQL and modeling expertise, I'm targeting the $170k–$175k range."*

2. **When They Push Back:**
   *"I'm very excited about the mission at ${jobMatches[0]?.company || "the company"} and confident I'll deliver outsized value in quarter one. If the base salary is fixed at $155k, can we bridge the difference with a signing bonus or additional equity vesting?"*

3. **Golden Rule:** Never say 'yes' immediately. Always ask for 24 hours to review the total rewards package.

Would you like me to draft a custom counter-offer email based on a specific offer you've received?`;
  }

  // 8. General conversational fallback
  return `### 💡 Career Coach Insight for **${profile.name}**

I hear you! As your dedicated career strategist, here is how we can move forward:

- **Top Job Opportunity:** You have a **${jobMatches[0]?.matchScore || 94}% match** for **${jobMatches[0]?.title || "Senior Analyst"}** at **${jobMatches[0]?.company || "Stripe"}** (${jobMatches[0]?.salaryRange || "$140k+"}).
- **High-ROI Skill Unlock:** If you acquire **${oneSkillUnlocks[0]?.missingSkills?.[0] || "Cloud Warehousing"}**, you can unlock an estimated **${oneSkillUnlocks[0]?.salaryBoostPercent || 35}% salary jump**.
${activeBlueprint ? `- **Target Blueprint:** You are exploring the **${activeBlueprint.title}** track with average market compensation of **${activeBlueprint.averageSalaryUsd}**.` : ""}

**What would you like to explore next?**
1. Ask: *"Why am I missing out on Senior roles right now?"*
2. Ask: *"Give me a weekly study schedule based on my current resume."*
3. Ask: *"Rewrite my resume bullet points for maximum ATS impact."*
4. Ask: *"How do I negotiate for the top of the salary band during final rounds?"*
Or simply ask me any general career, tech, or personal growth question!`;
}
