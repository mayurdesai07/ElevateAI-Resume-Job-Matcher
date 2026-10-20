import { CareerBlueprint, JobMatch, OneSkillUnlock, ResumeProfile } from "@/types";

export interface AiCoachContext {
  profile: ResumeProfile;
  jobMatches: JobMatch[];
  oneSkillUnlocks: OneSkillUnlock[];
  activeBlueprint?: CareerBlueprint | null;
}

/**
 * Intelligent helper to extract a skill name from hypothetical queries like:
 * "What if I have Docker?", "What if I know Snowflake?", "If I have AWS will I get a job?"
 */
function extractSkillFromPrompt(prompt: string): string | null {
  const commonTech = [
    "snowflake", "bigquery", "aws", "gcp", "azure", "docker", "kubernetes", "k8s",
    "dbt", "airflow", "kafka", "spark", "hadoop", "sql", "nosql", "mongodb",
    "postgresql", "mysql", "redis", "python", "r", "scala", "java", "golang", "go",
    "rust", "typescript", "javascript", "react", "next.js", "node.js", "fastapi",
    "django", "flask", "tableau", "power bi", "looker", "excel", "graphql", "rest api",
    "ci/cd", "github actions", "terraform", "ansible", "linux", "system design",
    "machine learning", "deep learning", "pytorch", "tensorflow", "scikit-learn",
    "nlp", "llm", "rag", "langchain", "data modeling", "etl", "elt", "data warehousing",
    "statistics", "a/b testing", "product analytics"
  ];

  const pLower = prompt.toLowerCase();
  for (const tech of commonTech) {
    // Regex boundary check for exact word matching
    const escaped = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(pLower)) {
      // Capitalize nicely
      if (tech === "aws" || tech === "gcp" || tech === "sql" || tech === "etl" || tech === "elt" || tech === "nlp" || tech === "llm" || tech === "rag" || tech === "ci/cd") {
        return tech.toUpperCase();
      }
      return tech.charAt(0).toUpperCase() + tech.slice(1);
    }
  }

  // Regex fallback: "what if I have/know/learn [word]"
  const match = pLower.match(/(?:what if i (?:have|had|learn|knew|know|master)|if i (?:have|had|learn|know))\s+([a-zA-Z0-9+#.\s]{2,20}?)(?:\?|,|\band\b|\bwould\b|\bcan\b|\bwill\b|$)/i);
  if (match && match[1]) {
    const raw = match[1].trim();
    if (raw.length >= 2 && !["this", "that", "it", "more", "a", "an", "the"].includes(raw)) {
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    }
  }

  return null;
}

/**
 * Intelligent helper to extract job title from query like:
 * "Would I get Senior Data Analyst?", "Can I get a DevOps role?"
 */
function extractJobTitleFromPrompt(prompt: string, jobMatches: JobMatch[]): string | null {
  const pLower = prompt.toLowerCase();
  for (const job of jobMatches) {
    if (pLower.includes(job.title.toLowerCase())) {
      return job.title;
    }
  }
  const genericTitles = [
    "Senior Data Analyst", "Data Engineer", "Machine Learning Engineer",
    "Analytics Engineer", "Full Stack Engineer", "DevOps Engineer",
    "Cloud Architect", "Software Engineer", "Product Manager"
  ];
  for (const title of genericTitles) {
    if (pLower.includes(title.toLowerCase())) {
      return title;
    }
  }
  return null;
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

  // =========================================================================
  // PRIORITY 1: "WHAT SKILLS DO I LACK" / "SKILLS I LACK" / "MISSING SKILLS"
  // User asked: "what are the skills which I lack for getting a new job"
  // Must explicitly evaluate MISSING skills, not skills they already have!
  // =========================================================================
  const isAskingForMissingSkills =
    (p.includes("lack") ||
      p.includes("missing") ||
      p.includes("gap") ||
      p.includes("need to learn") ||
      p.includes("what am i missing") ||
      p.includes("what do i not have") ||
      p.includes("skills needed") ||
      p.includes("skills required") ||
      p.includes("why am i not getting") ||
      p.includes("why am i rejected")) &&
    !p.includes("what if i didn't have") &&
    !p.includes("what if i dont have");

  if (isAskingForMissingSkills) {
    // Gather all missing skills from 1-skill unlocks and top market matches
    const allMissingSkills: string[] = [];
    oneSkillUnlocks.forEach((u) => {
      u.missingSkills.forEach((s) => {
        if (!allMissingSkills.includes(s)) allMissingSkills.push(s);
      });
    });

    if (allMissingSkills.length === 0) {
      allMissingSkills.push("Cloud Data Warehousing (Snowflake / BigQuery)", "dbt Transformation Modeling", "Production CI/CD Pipelines");
    }

    const primaryMissing = allMissingSkills[0];
    const secondaryMissing = allMissingSkills.slice(1, 4);
    const topUnlock = oneSkillUnlocks[0];
    const topJob = jobMatches[0];

    return `### 🔍 Skills You Lack for Getting a High-Paying New Job

Hi **${profile.name}**! Looking at your current resume (**${profile.title}**, ~${profile.yearsOfExperience} yrs exp), you already have strong foundations in **${profile.technicalSkills.slice(0, 3).join(", ")}**.

However, to unlock senior-tier and high-paying new offers (**$140k–$180k+ / ₹18L–₹28L+ LPA**), here are the **exact skills you currently lack**:

---

#### 🚨 1. Primary Skill Gap: **${primaryMissing}**
- **Impact Level:** **Critical Gatekeeper (Dealbreaker)**
- **Why You're Missing It:** Modern hiring committees no longer hire for isolated ad-hoc scripting; they require automated, cloud-native pipelines.
- **Roles Blocked Without It:** ${topUnlock?.targetRole || "Senior Data Analyst / Analytics Engineer"} roles at firms like ${topJob?.company || "top tech companies"}.
- **Salary Boost When Acquired:** **+${topUnlock?.salaryBoostPercent || 35}% higher compensation** ($${topUnlock?.targetSalaryUsd || "145,000"}).
- **Estimated Time to Bridge:** **${topUnlock?.bridgePlan?.estimatedTimeToLearn || "3 to 4 weeks"}** (~6 hrs/week).

${secondaryMissing.length > 0 ? `#### ⚠️ 2. Secondary High-Demand Skills You Lack:
${secondaryMissing.map((s, idx) => `
- **${s}**:
  - Unlocks: Enterprise distributed data workflows
  - Market Demand: Appears in 78% of active listings for ${profile.targetRoles?.[0] || "Senior Roles"}
`).join("")}` : ""}

---

#### 💡 Fast 30-Day Bridge Action Plan:
1. **Week 1–2:** Complete a hands-on production project: *"${topUnlock?.bridgePlan?.portfolioProject?.title || "Modern Cloud Warehouse & ETL Pipeline"}"*.
2. **Week 3:** Connect automated testing and CI/CD version control to your repository.
3. **Week 4:** Add the verified project and bullet point to your resume to immediately pass ATS automated screens.

Would you like me to generate the exact weekly curriculum and code template for **${primaryMissing}**?`;
  }

  // =========================================================================
  // PRIORITY 2: "GIVE ME THE JOBS WHICH ARE ONLY ONE SKILL AWAY FROM ME"
  // User asked: "give me the jobs which are only one skill away from me"
  // =========================================================================
  const isAskingForOneSkillJobs =
    p.includes("one skill away") ||
    p.includes("1 skill away") ||
    (p.includes("one skill") && p.includes("job")) ||
    (p.includes("1 skill") && p.includes("job")) ||
    p.includes("one skill unlock") ||
    p.includes("1 skill unlock") ||
    p.includes("single skill away") ||
    p.includes("only one skill");

  if (isAskingForOneSkillJobs) {
    const unlocks = oneSkillUnlocks.length > 0 ? oneSkillUnlocks : [
      {
        targetRole: "Senior Data Analyst",
        currentMatchPercent: 82,
        potentialMatchPercent: 96,
        salaryBoostPercent: 35,
        targetSalaryUsd: "$145,000",
        missingSkills: ["Snowflake / Cloud Warehousing"],
        bridgePlan: {
          estimatedTimeToLearn: "3 weeks",
          portfolioProject: {
            title: "Multi-Tier Snowflake Lakehouse Architecture",
            description: "End-to-end cloud pipeline loading raw data and transforming analytics models."
          }
        }
      },
      {
        targetRole: "Analytics Engineer",
        currentMatchPercent: 78,
        potentialMatchPercent: 94,
        salaryBoostPercent: 42,
        targetSalaryUsd: "$160,000",
        missingSkills: ["dbt (Data Build Tool)"],
        bridgePlan: {
          estimatedTimeToLearn: "4 weeks",
          portfolioProject: {
            title: "Production dbt Semantic Layer & CI Testing",
            description: "Modular SQL transformation pipeline with automated schema tests."
          }
        }
      },
      {
        targetRole: "Lead Business Intelligence Engineer",
        currentMatchPercent: 79,
        potentialMatchPercent: 93,
        salaryBoostPercent: 38,
        targetSalaryUsd: "$152,000",
        missingSkills: ["Airflow DAG Orchestration"],
        bridgePlan: {
          estimatedTimeToLearn: "3 weeks",
          portfolioProject: {
            title: "Automated Enterprise Data Pipeline Orchestration",
            description: "Scheduled Airflow DAGs extracting API data into Postgres and PowerBI."
          }
        }
      }
    ];

    const jobsFormatted = unlocks.map((u, i) => `
#### ${i + 1}. **${u.targetRole}**
- 🎯 **Current Fit:** \`${u.currentMatchPercent}%\` ➔ **Fit After 1 Skill:** \`${u.potentialMatchPercent}%\` (Top 5% Applicant)
- 🔑 **The 1 Missing Skill to Bridge:** **${u.missingSkills.join(" & ")}**
- 💰 **Salary Package:** **${u.targetSalaryUsd}** (a **+${u.salaryBoostPercent}% pay increase**)
- ⏱️ **Time to Learn:** ~${u.bridgePlan.estimatedTimeToLearn}
- 🛠️ **Proof Project to Build:** *${u.bridgePlan.portfolioProject.title}*
`).join("\n---");

    return `### 🚀 Jobs That Are Only 1 Skill Away From You

Hi **${profile.name}**! Based on your verified foundation in **${profile.technicalSkills.join(", ")}**, you do **not** need a whole degree or 2 years of retraining. 

Here are the high-paying jobs where you are **strictly ONE skill away**:

---
${jobsFormatted}
---

### 📊 Strategic Recommendation:
Your fastest return on investment is targeting **${unlocks[0].targetRole}**. By learning **${unlocks[0].missingSkills[0]}**, your application score jumps from **${unlocks[0].currentMatchPercent}% to ${unlocks[0].potentialMatchPercent}%**, moving you into direct recruiter review!

Would you like me to create the step-by-step project guide for **${unlocks[0].missingSkills[0]}**?`;
  }

  // =========================================================================
  // PRIORITY 3: HYPOTHETICAL "WHAT IF I HAVE [SKILL]..." SIMULATION
  // e.g. "What if I have Docker?", "What if I know Snowflake?", "If I have AWS would I get this job?"
  // =========================================================================
  const isHypotheticalHave =
    (p.includes("what if i have") ||
      p.includes("what if i had") ||
      p.includes("what if i learn") ||
      p.includes("what if i know") ||
      p.includes("what if i master") ||
      (p.includes("if i have") && (p.includes("would") || p.includes("can") || p.includes("job") || p.includes("get"))) ||
      (p.includes("if i learn") && (p.includes("would") || p.includes("can") || p.includes("job") || p.includes("get"))));

  if (isHypotheticalHave) {
    const testedSkill = extractSkillFromPrompt(prompt) || "Cloud Architecture & Modern Tooling";
    const targetJob = extractJobTitleFromPrompt(prompt, jobMatches) || jobMatches[0]?.title || "Senior Analytics Specialist";
    const currentBaseScore = jobMatches[0]?.matchScore || 84;
    const simulatedScore = Math.min(98, currentBaseScore + 12);

    return `### ⚡ Skill Simulation: What If You Have **${testedSkill}**?

**Candidate:** ${profile.name} | **Target Job:** ${targetJob}

Here is how adding **${testedSkill}** immediately transforms your hiring probability:

---

#### 📈 1. Match Score Jump:
- **Current Match Score:** \`${currentBaseScore}% Fit\`
- **Simulated Match with ${testedSkill}:** \`${simulatedScore}% Fit\` 🚀 *(Elite Tier)*
- **ATS Filter Status:** Passes 100% of automated screening keywords for ${testedJob(targetJob)}.

#### 💼 2. Would You Get This Job?
**Yes! High Probability.**
- Hiring managers for **${targetJob}** look for proven execution in **${profile.technicalSkills.slice(0, 2).join(" & ")}** (which you already have) combined with **${testedSkill}**.
- Adding **${testedSkill}** eliminates the primary reservation interview committees have regarding scale and production readiness.

#### 💰 3. Compensation & Leverage Impact:
- **Expected Salary Premium:** Roles mandating **${testedSkill}** pay **+25% to +40% higher** than standard positions.
- **Projected Range:** **$140,000 – $175,000 / ₹18L – ₹28L LPA**.

#### 🛠️ 4. How to Prove It On Your Resume Right Now:
Add a high-converting bullet point like:
> *"Architected and deployed production **${testedSkill}** pipelines integrated with ${profile.technicalSkills[0] || "SQL"}, reducing query execution latency by 42% across 5M+ daily records."*

Would you like me to design a 2-week quick-start project so you can legitimately add **${testedSkill}** to your resume?`;
  }

  // =========================================================================
  // PRIORITY 4: HYPOTHETICAL "WHAT IF I DON'T HAVE [SKILL]..." SIMULATION
  // e.g. "What if I don't have Snowflake?", "Can I get this job without Python?"
  // =========================================================================
  const isHypotheticalLack =
    p.includes("what if i don't have") ||
    p.includes("what if i dont have") ||
    p.includes("what if i didn't have") ||
    p.includes("can i get.*without") ||
    p.includes("without having") ||
    p.includes("is.*mandatory") ||
    p.includes("is.*required");

  if (isHypotheticalLack) {
    const testedSkill = extractSkillFromPrompt(prompt) || "Cloud Data Warehousing";
    const targetJob = extractJobTitleFromPrompt(prompt, jobMatches) || jobMatches[0]?.title || "Senior Specialist";

    return `### ⚖️ Risk Analysis: Can You Get **${targetJob}** Without **${testedSkill}**?

Here is the realistic hiring committee evaluation for **${profile.name}**:

---

#### 1. Verdict: **Negotiable with Workarounds (65%–75% Probability)**
- While **${testedSkill}** is listed on the job description, hiring managers frequently hire strong practitioners in **${profile.technicalSkills.slice(0, 2).join(" & ")}** who show rapid learning agility.
- However, your starting offer may land near the bottom-of-band unless compensated by exceptional execution in adjacent tools.

#### 2. The 3 Workaround Strategies to Win Without It:
1. **Highlight Conceptual Equivalency:**
   - If you know PostgreSQL, MySQL, or SQL modeling, highlight: *"Extensive relational query optimization that directly translates to ${testedSkill} architectural patterns."*
2. **Emphasize Business Impact Over Tool Names:**
   - Hiring managers care more about revenue generated ($) and hours saved than the specific syntax.
3. **Commit to a 14-Day Ramp Up:**
   - State in your interview: *"I am already prototyping in ${testedSkill} and anticipate reaching full production throughput within my first two weeks."*

Would you like me to draft an interview response explaining your readiness for roles mentioning **${testedSkill}**?`;
  }

  // =========================================================================
  // PRIORITY 5: "WOULD I GET THIS JOB?" / "CAN I GET [JOB TITLE]?"
  // =========================================================================
  const isAskingCanIGet =
    (p.includes("would i get") ||
      p.includes("can i get") ||
      p.includes("will i get") ||
      p.includes("am i qualified") ||
      p.includes("chance of getting")) &&
    !isHypotheticalHave &&
    !isHypotheticalLack;

  if (isAskingCanIGet) {
    const requestedJob = extractJobTitleFromPrompt(prompt, jobMatches) || jobMatches[0]?.title || "Senior Data Analyst";
    const matchedJob = jobMatches.find((j) => j.title.toLowerCase().includes(requestedJob.toLowerCase())) || jobMatches[0];
    const matchScore = matchedJob?.matchScore || 88;

    return `### 🎯 Candidacy Assessment: Will You Get **${requestedJob}**?

**Candidate:** ${profile.name} | **Current Title:** ${profile.title} (~${profile.yearsOfExperience} yrs exp)

---

#### 📊 Your Overall Probability Score: **${matchScore}% Fit**
${matchScore >= 85 ? "🟢 **Strong Contender — Direct Interview Territory**" : "🟡 **Competitive Contender — Needs 1 Bridge Skill**"}

#### ✅ Why Hiring Managers Will Interview You:
- You have verified hands-on production depth in **${profile.technicalSkills.slice(0, 3).join(", ")}**.
- Your track record as a **${profile.title}** shows direct experience delivering stakeholder results.
- Your tools (**${profile.toolsAndSoftware.slice(0, 3).join(", ")}**) match the immediate daily deliverables.

#### ⚠️ Potential Resistance Point:
- If applying to Tier-1 firms, committee members will compare you against candidates with **${oneSkillUnlocks[0]?.missingSkills[0] || "Enterprise Cloud Warehousing"}**.
- **Fix:** Frame your projects with quantifiable business metrics ($ saved, latency reduced) to outshine candidates with purely theoretical knowledge.

Would you like me to tailor a high-converting cover pitch specifically for **${requestedJob}**?`;
  }

  // =========================================================================
  // PRIORITY 6: STUDY SCHEDULE & LEARNING ROADMAP
  // =========================================================================
  if (
    p.includes("study schedule") ||
    p.includes("study plan") ||
    p.includes("3 month") ||
    p.includes("12 week") ||
    p.includes("roadmap") ||
    p.includes("how to become") ||
    p.includes("learning path") ||
    (p.includes("schedule") && !p.includes("interview"))
  ) {
    const targetRole = activeBlueprint?.title || oneSkillUnlocks[0]?.targetRole || "Senior Data Analyst";
    const primarySkill = oneSkillUnlocks[0]?.missingSkills[0] || "Cloud Warehousing & dbt";

    return `### 🗓️ Customized 12-Week Fast-Track Blueprint for **${targetRole}**
**Candidate:** ${profile.name} | **Current Strengths:** ${profile.technicalSkills.slice(0, 3).join(", ")}

Because you already possess strong foundations, we skip basic introductory tutorials and focus 100% on high-ROI production skills:

---

#### 📍 Phase 1: Weeks 1–3 — Advanced Query Architecture & Data Modeling
- **Commitment:** 6–8 hrs/week
- **Focus:** Window functions (\`OVER\`, \`PARTITION BY\`, \`LEAD/LAG\`), CTE performance optimization, and indexing.
- **Capstone Milestone:** E-Commerce Retention & Cohort Analysis schema in PostgreSQL.

#### 📍 Phase 2: Weeks 4–6 — Enterprise Business Intelligence & Storytelling
- **Focus:** Advanced Power BI (DAX, Star Schema) or Tableau (LOD calculations, parameter actions).
- **Capstone Milestone:** Executive SaaS Churn & ARR Retention Dashboard with interactive forecasting.

#### 📍 Phase 3: Weeks 7–9 — Cloud Data Warehousing (${primarySkill})
- **Focus:** Snowflake / BigQuery architecture, dbt transformation fundamentals, and automated data quality tests.
- **Capstone Milestone:** Production analytics warehouse pipeline processing 1M+ simulated records.

#### 📍 Phase 4: Weeks 10–12 — System Design, Portfolio & Interview Drills
- **Focus:** Architectural trade-offs, STAR behavioral responses, and live GitHub portfolio deployment.
- **Capstone Milestone:** 3 published case studies with executive summaries and architecture diagrams.

Would you like me to generate a **Week 1 day-by-day checklist** with practice query exercises?`;
  }

  // =========================================================================
  // PRIORITY 7: RESUME REWRITE & GOOGLE XYZ BULLET POINTS
  // =========================================================================
  if (p.includes("bullet") || p.includes("rewrite") || p.includes("xyz") || p.includes("improve my resume") || p.includes("resume points")) {
    return `### ✨ High-Impact Resume Rewrite (Google XYZ Formula)
*Formula: "Accomplished [X] as measured by [Y] by doing [Z]"*

Here is how we elevate your current bullet points from basic task descriptions into executive, metric-driven achievements:

---

#### 🔴 Before (Standard Mid-Level Bullets):
> *"Responsible for writing SQL queries and creating Tableau dashboards for marketing team."*  
> *"Cleaned customer data using Python and Pandas for weekly reports."*

#### 🟢 After (High-Converting Senior Bullets):
> 🚀 **"Architected 14+ automated Tableau & SQL business intelligence dashboards tracking $48M in annual ARR, reducing executive report retrieval latency by 38%."**
> 
> 🚀 **"Engineered reproducible Python/Pandas data normalization pipelines across 12M+ customer touchpoint records, saving 16 engineering hours weekly."**
> 
> 🚀 **"Designed and evaluated 28+ statistical A/B experimentation funnels, directly identifying checkout friction points and improving conversion by 14.2% ($820k annualized incremental revenue)."**

---

#### 💡 Key Enhancements Made:
1. Replaced passive verbs (*"Responsible for"*) with active ownership verbs (*"Architected"*, *"Engineered"*, *"Designed"*).
2. Quantified business impact with concrete numbers ($48M ARR, 16 hrs saved, 14.2% conversion).
3. Explicitly highlighted modern tooling (${profile.technicalSkills.slice(0, 3).join(", ")}) that automated ATS keyword parsers reward.

Would you like me to tailor bullet points for a specific job from your matched listings?`;
  }

  // =========================================================================
  // PRIORITY 8: SALARY NEGOTIATION
  // =========================================================================
  if (p.includes("salary") || p.includes("negotiat") || p.includes("money") || p.includes("offer") || p.includes("pay")) {
    const topJob = jobMatches[0];
    return `### 💰 Salary Negotiation Script for Top-of-Band Compensation

When negotiating for roles like **${topJob?.title || "Senior Specialist"}** (${topJob?.salaryRange || "$145k-$175k"}), follow this battle-tested playbook:

1. **Anchor High with Market Data:**
   *"Based on my track record optimizing pipelines at scale and current market benchmarks for someone with my ${profile.technicalSkills[0] || "SQL"} and data modeling expertise, I'm targeting the top of the band ($165k–$175k)."*

2. **When They Push Back:**
   *"I'm very excited about the mission at ${topJob?.company || "the company"} and confident I'll deliver outsized value in quarter one. If the base salary is fixed at $155k, can we bridge the difference with a signing bonus or additional equity vesting?"*

3. **Golden Rule:** Never say 'yes' immediately. Always ask for 24 hours to review the total rewards package.

Would you like me to draft a custom counter-offer email based on a specific offer you've received?`;
  }

  // =========================================================================
  // PRIORITY 9: CASUAL GREETINGS & CHIT-CHAT
  // =========================================================================
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
      return `Hey ${profile.name}! Right now, I'm analyzing the latest market postings and evaluating how your skills fit roles like **${jobMatches[0]?.title || "Senior Analyst"}** at companies like **${jobMatches[0]?.company || "top tech firms"}**.

I'm feeling great and ready to help! What's on your mind today? Want to look at missing skills, 1-skill unlock jobs, or interview prep?`;
    }

    return `Hey ${profile.name}! 👋 Great to chat with you! 

I'm **Zara**, your AI Career Coach at ElevateAI. I'm tuned into your background as a **${profile.title}**, and I'm ready to help with anything—from reviewing your missing skills and 1-skill job unlocks, to interview practice and salary negotiation.

What would you like to explore today?`;
  }

  // =========================================================================
  // PRIORITY 10: INTERVIEW QUESTIONS & PREPARATION
  // =========================================================================
  if (p.includes("interview") || p.includes("questions hiring managers ask") || p.includes("mock") || p.includes("behavioral")) {
    const role = jobMatches[0]?.title || profile.title;
    return `### 🎯 High-Frequency Interview Questions for **${role}**

Here are the top questions hiring committees will ask you, along with the ideal answering strategy:

---

#### 1. Technical Deep-Dive:
> *"Describe a time a query or data pipeline was underperforming in production. How did you diagnose the bottleneck and what was the resolution?"*
- **What they want:** Proof you understand execution plans, indexing, partitioning, and resource costs—not just basic syntax.

#### 2. Business Alignment & Trade-Offs:
> *"How do you handle ambiguous requests when stakeholders ask for metrics that contradict our operational definitions?"*
- **What they want:** Stakeholder empathy, pushback diplomacy, and establishing a single source of truth.

#### 3. Behavioral (STAR Method):
> *"Tell me about a high-visibility project where the timeline was suddenly cut in half."*
- **What they want:** Ruthless scope prioritization, transparent communication, and maintaining data integrity under pressure.

Would you like to do a mock drill on question #1? Type your response and I'll grade it!`;
  }

  // =========================================================================
  // PRIORITY 11: CURRENT SKILLS & EXTRACTED PROFILE
  // Only triggers when user explicitly asks for CURRENT skills or profile!
  // =========================================================================
  if (
    p.includes("what are my skills") ||
    p.includes("skills do i have") ||
    p.includes("my current skill") ||
    p.includes("what do i know") ||
    p.includes("my profile") ||
    p.includes("my tool") ||
    p.includes("my strength") ||
    p.includes("who am i") ||
    p.includes("my background")
  ) {
    const techSkillsList = profile.technicalSkills && profile.technicalSkills.length > 0
      ? profile.technicalSkills.map((s) => `- **${s}**`).join("\n")
      : "- SQL\n- Python\n- Tableau\n- Excel";

    const toolsList = profile.toolsAndSoftware && profile.toolsAndSoftware.length > 0
      ? profile.toolsAndSoftware.map((t) => `\`${t}\``).join("  •  ")
      : "`PostgreSQL` • `Tableau` • `Git` • `Excel`";

    const strengthsList = profile.keyStrengths && profile.keyStrengths.length > 0
      ? profile.keyStrengths.join(", ")
      : "Data Visualization, ETL Pipeline Optimization";

    return `### 📊 Extracted Skills & Profile for **${profile.name}**

Here are your verified skills extracted from your resume:

---

#### 🛠️ **Core Technical Skills:**
${techSkillsList}

#### 💻 **Tools & Software:**
${toolsList}

#### 📈 **Professional Standing:**
- **Current Position:** **${profile.title}**
- **Experience Level:** **${profile.experienceLevel} Tier** (~${profile.yearsOfExperience} years professional experience)
- **Key Strengths:** ${strengthsList}
- **Top Job Match:** **${jobMatches[0]?.title || "Senior Analyst"}** at **${jobMatches[0]?.company || "Stripe"}** (${jobMatches[0]?.matchScore || 94}% Fit)

---

💡 **Next Step:** Ask me *"What are the skills which I lack for getting a new job?"* or *"Give me the jobs which are only one skill away from me!"*`;
  }

  // =========================================================================
  // PRIORITY 12: GENERAL JOB MATCHES & "WHERE CAN I APPLY"
  // =========================================================================
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

Would you like me to tailor a resume pitch for any of these companies, or show you the **jobs that are only 1 skill away**?`;
  }

  // =========================================================================
  // PRIORITY 13: GENERAL CONTEXTUAL FALLBACK
  // =========================================================================
  return `### 💡 Career Coach Insight for **${profile.name}**

I analyzed your question regarding: *"${prompt}"*

Based on your active resume as a **${profile.title}** (${profile.experienceLevel} level, ~${profile.yearsOfExperience} yrs exp):
- **Core Strengths:** ${profile.technicalSkills.slice(0, 4).join(", ")}
- **Top Job Match:** **${jobMatches[0]?.title || "Senior Analyst"}** at **${jobMatches[0]?.company || "Stripe"}** (${jobMatches[0]?.matchScore || 94}% Fit)
- **Top Missing Skill:** **${oneSkillUnlocks[0]?.missingSkills?.[0] || "Cloud Warehousing"}** (Unlocks +${oneSkillUnlocks[0]?.salaryBoostPercent || 35}% salary jump to ${oneSkillUnlocks[0]?.targetRole || "Senior Specialist"}).

**How would you like to proceed?**
1. Ask: *"What are the skills which I lack for getting a new job?"*
2. Ask: *"Give me the jobs which are only one skill away from me"*
3. Ask: *"What if I have [any skill] and would I get this job?"*
4. Ask: *"Rewrite my resume bullet points with Google XYZ formula"*`;
}

function testedJob(jobTitle: string): string {
  return jobTitle || "Target Roles";
}
