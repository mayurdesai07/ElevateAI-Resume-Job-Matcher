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
    name: "Alex Rivera",
    title: "Data Analyst",
    technicalSkills: ["SQL", "Python", "Tableau", "Excel", "Data Modeling"],
    softSkills: ["Analytical Thinking", "Cross-Functional Communication"],
    toolsAndSoftware: ["PostgreSQL", "Power BI", "Git", "Jira"],
    experienceLevel: "Mid" as const,
    yearsOfExperience: 3,
    keyStrengths: ["Dashboard Design", "Ad-Hoc SQL Analysis"],
    targetRoles: ["Senior Data Analyst", "Analytics Engineer"],
    summary: "Experienced Data Analyst with 3+ years optimizing analytics pipelines.",
  };
  const activeBlueprint = safeContext.activeBlueprint;
  const oneSkillUnlocks = safeContext.oneSkillUnlocks || [];
  const jobMatches = safeContext.jobMatches || [];

  // 1. Exact Skills & Profile Breakdown
  if (
    p.includes("skill") ||
    p.includes("what do i know") ||
    p.includes("my tool") ||
    p.includes("my profile") ||
    p.includes("my strength") ||
    p.includes("who am i") ||
    p.includes("my experience") ||
    p.includes("my background")
  ) {
    const techSkillsList = profile.technicalSkills && profile.technicalSkills.length > 0
      ? profile.technicalSkills.map((s) => `- **${s}**`).join("\n")
      : "- SQL\n- Python\n- Tableau\n- Excel";

    const toolsList = profile.toolsAndSoftware && profile.toolsAndSoftware.length > 0
      ? profile.toolsAndSoftware.map((t) => `\`${t}\``).join("  •  ")
      : "`PostgreSQL` • `Tableau` • `Git` • `Excel`";

    const softSkillsList = profile.softSkills && profile.softSkills.length > 0
      ? profile.softSkills.map((s) => `- **${s}**`).join("\n")
      : "- Data Storytelling\n- Stakeholder Management";

    const strengthsList = profile.keyStrengths && profile.keyStrengths.length > 0
      ? profile.keyStrengths.join(", ")
      : "Data Visualization, ETL Pipeline Optimization";

    return `### 📊 Extracted Skills & Profile for **${profile.name}**

Here is your complete profile extracted from your resume:

---

#### 🛠️ **Core Technical Skills:**
${techSkillsList}

#### 💻 **Tools & Software:**
${toolsList}

#### 🤝 **Soft Skills & Mindset:**
${softSkillsList}

#### 📈 **Professional Standing:**
- **Current Position:** **${profile.title}**
- **Experience Level:** **${profile.experienceLevel} Tier** (~${profile.yearsOfExperience} years professional experience)
- **Key Strengths:** ${strengthsList}
- **Top Job Match:** **${jobMatches[0]?.title || "Senior Analyst"}** at **${jobMatches[0]?.company || "Stripe"}** (${jobMatches[0]?.matchScore || 94}% Fit)

---

💡 **The 1-Skill High-ROI Unlock:**
You already have 85%+ of what Senior roles require! Your single biggest missing skill is **${oneSkillUnlocks[0]?.missingSkills?.join(", ") || "Cloud Warehousing (Snowflake / BigQuery)"}**, which unlocks roles paying **${oneSkillUnlocks[0]?.targetRole || "Senior Specialist"}** (+${oneSkillUnlocks[0]?.salaryBoostPercent || 35}% salary jump).

Would you like a 3-week study roadmap to master **${oneSkillUnlocks[0]?.missingSkills?.[0] || "this missing skill"}**?`;
  }

  // 2. Job Matches & "What jobs can I get?"
  if (
    p.includes("job") ||
    p.includes("where can i apply") ||
    p.includes("who is hiring") ||
    p.includes("match") ||
    p.includes("companies")
  ) {
    const topJobs = jobMatches.slice(0, 3);
    const jobsList = topJobs.map((j, i) => 
      `${i + 1}. **${j.title}** at **${j.company}**
   - 🎯 **Match Score:** ${j.matchScore}% Fit
   - 📍 **Location:** ${j.location} (${j.workplaceType})
   - 💰 **Salary:** ${j.salaryRange}
   - ✨ **Why You Fit:** ${j.whyYouFit}`
    ).join("\n\n");

    return `### 🎯 Top Job Matches for **${profile.name}**

Based on your verified skills in **${profile.technicalSkills.slice(0, 3).join(", ")}**, here are your highest-probability matches ready to apply right now:

---

${jobsList}

---

Would you like me to tailor a resume pitch for any of these companies?`;
  }

  // 3. Casual greetings & Human chit-chat
  if (
    p.match(/^(hi|hello|hey|hola|greetings|good\s*(morning|afternoon|evening))\b/i) ||
    p.includes("what are you doing") ||
    p.includes("how are you") ||
    p.includes("what's up") ||
    p.includes("what do you want") ||
    p.includes("who are you")
  ) {
    if (p.includes("what do you want") || p.includes("what want from me")) {
      return `Hey ${profile.name}! 😊 Nothing complicated at all—I'm just here as your personal AI career mentor and talent partner. 

Whether you want to check your job matches, discover which missing skills will unlock a 35%+ salary jump, tailor your resume bullets, or prep for interviews, I'm here for you.

How are you doing today? What would you like to work on?`;
    }

    if (p.includes("what are you doing")) {
      return `Hey ${profile.name}! Right now, I'm analyzing the latest job market postings and looking at how your skills fit roles like **${jobMatches[0]?.title || "Senior Analyst"}** at companies like **${jobMatches[0]?.company || "Stripe"}**.

I'm feeling great and ready to help! What's on your mind today? Want to look at job matches, interview prep, or missing skills?`;
    }

    return `Hey ${profile.name}! 👋 Great to chat with you! 

I'm **Aria**, your AI Career Coach at ElevateAI. I'm tuned into your background as a **${profile.title}**, and I'm ready to help with anything—from reviewing your skills and roadmaps, to interview practice and salary negotiation.

What would you like to explore today?`;
  }

  // 4. "Tell me a joke" or lighthearted prompts
  if (p.includes("joke") || p.includes("make me laugh")) {
    return `Here's one for you: 😄

*Why do programmers prefer dark mode?*
**Because light attracts bugs!** 🐛

*And for data professionals:*
*There are 10 types of people in this world: those who understand binary, and those who don't.*

Now back to business—how can I help you land that next high-paying role today?`;
  }

  // 5. Gratitude
  if (p.includes("thank") || p.includes("thanks") || p.includes("appreciate")) {
    return `You're so very welcome, ${profile.name}! ❤️ That's what I'm here for. Feel free to ask anything else anytime—whether it's big career moves, quick resume tweaks, or interview tips. We've got this!`;
  }

  // 6. Why missing out on Senior roles & High ROI 1-Skill Unlocks
  if (p.includes("senior") || p.includes("missing out") || p.includes("unlock") || p.includes("gap") || p.includes("missing skill")) {
    const topUnlock = oneSkillUnlocks[0];
    const missing = topUnlock ? topUnlock.missingSkills.join(" & ") : "Cloud Architecture (Snowflake / BigQuery)";
    const target = topUnlock ? topUnlock.targetRole : "Senior Specialist";
    const boost = topUnlock ? `+${topUnlock.salaryBoostPercent}% salary boost` : "+35% salary boost";

    return `### 🎯 Why You're Missing Out on Senior Roles Right Now

Looking at your profile (**${profile.name}**, currently positioned as **${profile.title}** with ~${profile.yearsOfExperience} years of experience), here is the exact diagnosis:

1. **You already have the core execution muscle (80%–90% fit):**
   - You have strong command over **${profile.technicalSkills.slice(0, 4).join(", ")}**.
   - Hiring managers already trust you to complete assigned deliverables.

2. **The "Missing Link" holding you back:**
   - For **${target}** roles paying upwards of **$140k–$180k**, hiring committees look for candidates who master **${missing}**.
   - Right now, your resume reflects individual execution rather than architectural leverage and cloud-scale ownership.

3. **Your Fast-Track Remedy (${boost}):**
   - **Step 1:** Complete the targeted bridge project: *"${topUnlock?.bridgePlan?.portfolioProject?.title || "Modern Cloud Pipeline"}"*.
   - **Step 2:** Update your resume bullet points from "Assisted with queries" to "Architected distributed pipelines cutting data latency by 40%".
   - **Estimated Time to Close This Gap:** **${topUnlock?.bridgePlan?.estimatedTimeToLearn || "3 to 4 weeks"}** dedicating ~6–8 hours/week.

Would you like me to generate a tailored 4-week study schedule for **${missing}**, or draft the exact bullet points for your resume right now?`;
  }

  // 7. Study schedule & Learning Roadmaps
  if (
    p.includes("study schedule") ||
    p.includes("study plan") ||
    p.includes("3 month") ||
    p.includes("12 week") ||
    p.includes("roadmap") ||
    p.includes("how to become") ||
    (p.includes("schedule") && !p.includes("interview"))
  ) {
    const targetRole = activeBlueprint?.title || "Data Analyst";

    return `### 🗓️ Customized 12-Week Fast-Track Blueprint for **${targetRole}**
**Candidate:** ${profile.name} | **Current Strengths:** ${profile.technicalSkills.slice(0, 3).join(", ") || "Foundational Skills"}

Because you already bring valuable analytical and technical foundations, we can skip beginner fluff and accelerate directly into high-ROI skills:

---

#### 📍 Phase 1: Weeks 1–3 — Advanced SQL & Database Modeling
- **Weekly Commitment:** 8 hours (1 hr weekday, 3 hrs weekend)
- **Focus:** Window functions (\`OVER\`, \`PARTITION BY\`, \`ROW_NUMBER\`, \`LEAD/LAG\`), CTEs, and query indexing.
- **Milestone Project:** Build an E-Commerce Retention & Cohort Analysis schema in PostgreSQL.

#### 📍 Phase 2: Weeks 4–6 — Executive BI & Visual Storytelling
- **Focus:** Power BI (DAX, Star Schema) or Tableau (LOD expressions, Parameter Actions).
- **Milestone Project:** Executive SaaS Churn & Revenue Retention Dashboard with interactive filters.

#### 📍 Phase 3: Weeks 7–9 — Python Automation & Statistical A/B Testing
- **Focus:** Pandas dataframe transformations, clean EDA, hypothesis testing (p-values, confidence intervals).
- **Milestone Project:** Automated marketing campaign funnel evaluation script calculating statistical significance.

#### 📍 Phase 4: Weeks 10–12 — Cloud Warehouse (Snowflake) & Interview Prep
- **Focus:** Snowflake basics, dbt transformation fundamentals, behavioral STAR stories, and portfolio presentation.
- **Capstone Deliverable:** Live GitHub portfolio showcasing 3 end-to-end case studies with executive summary decks.

Would you like me to break down **Week 1's day-by-day checklist** with practice query exercises?`;
  }

  // 8. Explicit Resume rewrite request (bullet points, xyz formula)
  if (p.includes("bullet") || p.includes("rewrite") || p.includes("xyz") || p.includes("improve my resume")) {
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

  // 9. Salary negotiation
  if (p.includes("salary") || p.includes("negotiat") || p.includes("money") || p.includes("offer") || p.includes("pay")) {
    return `### 💰 Salary Negotiation Script for Top-of-Band Compensation

When negotiating for roles like **${jobMatches[0]?.title || "Senior Analyst"}** (${jobMatches[0]?.salaryRange || "$145k-$175k"}), follow this battle-tested playbook:

1. **Anchor High with Market Data:**
   *"Based on my track record optimizing pipelines at scale and the current market benchmarks for someone with my SQL and modeling expertise, I'm targeting the $170k–$175k range."*

2. **When They Push Back:**
   *"I'm very excited about the mission at ${jobMatches[0]?.company || "the company"} and confident I'll deliver outsized value in quarter one. If the base salary is fixed at $155k, can we bridge the difference with a signing bonus or additional equity vesting?"*

3. **Golden Rule:** Never say 'yes' immediately. Always ask for 24 hours to review the total rewards package.

Would you like me to draft a custom counter-offer email based on a specific offer you've received?`;
  }

  // 10. General conversational fallback with tailored profile awareness
  return `### 💡 Career Coach Insight for **${profile.name}**

I reviewed your question regarding: *"${prompt}"*

Based on your active resume as a **${profile.title}** (${profile.experienceLevel} level):
- **Core Skills:** ${profile.technicalSkills.slice(0, 4).join(", ")}
- **Top Match:** **${jobMatches[0]?.title || "Senior Analyst"}** at **${jobMatches[0]?.company || "Stripe"}** (${jobMatches[0]?.matchScore || 94}% Fit)
- **Salary Opportunity:** ${jobMatches[0]?.salaryRange || "$140k–$175k"}
- **High-ROI Target:** Learn **${oneSkillUnlocks[0]?.missingSkills?.[0] || "Cloud Architecture"}** to unlock **${oneSkillUnlocks[0]?.targetRole || "Senior Role"}** (+${oneSkillUnlocks[0]?.salaryBoostPercent || 35}%).

**How would you like to proceed?**
1. Ask me to list all your extracted skills and tools in detail
2. Ask me for a weekly learning schedule to unlock Senior roles
3. Ask me to rewrite your resume bullet points for ATS compliance
4. Ask me interview practice questions for hiring manager rounds`;
}
