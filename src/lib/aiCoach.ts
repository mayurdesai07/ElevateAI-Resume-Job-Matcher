import { CareerBlueprint, JobMatch, OneSkillUnlock, ResumeProfile } from "@/types";

export interface AiCoachContext {
  profile: ResumeProfile;
  jobMatches: JobMatch[];
  oneSkillUnlocks: OneSkillUnlock[];
  activeBlueprint?: CareerBlueprint | null;
}

export function generateContextualAiResponse(
  prompt: string,
  context: AiCoachContext
): string {
  const p = prompt.toLowerCase();
  const { profile, activeBlueprint, oneSkillUnlocks, jobMatches } = context;

  // 1. Why missing out on Senior roles
  if (p.includes("senior") || p.includes("missing out") || p.includes("unlock")) {
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

  // 2. Study schedule (e.g. Data Analyst in 3 months)
  if (p.includes("schedule") || p.includes("3 months") || p.includes("study plan") || p.includes("learn") || p.includes("data analyst in 3 months") || p.includes("roadmap")) {
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

Would you like me to break down **Week 1's day-by-day checklist** with practice SQL query exercises?`;
  }

  // 3. Resume bullet points rewrite
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

  // 4. Default intelligent career guidance
  return `### 💡 Career Coach Insight for **${profile.name}**

I've analyzed your resume and current job fit across our market datasets:

- **Current Match Leader:** You have a **${jobMatches[0]?.matchScore || 94}% match** for **${jobMatches[0]?.title || "Senior Analyst"}** at **${jobMatches[0]?.company || "Stripe"}** (${jobMatches[0]?.salaryRange || "$140k+"}).
- **High-ROI Skill Unlock:** If you acquire **${oneSkillUnlocks[0]?.missingSkills?.[0] || "Cloud Warehousing"}**, you can unlock an estimated **${oneSkillUnlocks[0]?.salaryBoostPercent || 35}% salary jump**.
${activeBlueprint ? `- **Viewing Career Blueprint:** You are exploring the **${activeBlueprint.title}** track with average market compensation of **${activeBlueprint.averageSalaryUsd}**.` : ""}

**What would you like to tackle next?**
1. Ask: *"Why am I missing out on Senior roles right now?"*
2. Ask: *"Give me a weekly study schedule based on my current resume."*
3. Ask: *"Rewrite my resume bullet points for maximum ATS impact."*
4. Ask: *"How do I negotiate for the top of the salary band during final rounds?"*`;
}
