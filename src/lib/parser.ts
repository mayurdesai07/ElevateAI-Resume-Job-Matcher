import { JobMatch, OneSkillUnlock, ResumeProfile } from "@/types";
import { MASTER_JOB_LISTINGS } from "@/data/jobListings";

// Known skill catalog for heuristic extraction
const KNOWN_SKILLS = [
  // Programming & Dev
  "Python", "JavaScript", "TypeScript", "SQL", "HTML5", "CSS3", "React.js", "React", "Next.js", "Node.js",
  "Express", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Git", "GitHub", "Docker", "Kubernetes", "AWS",
  "GCP", "Azure", "Linux", "Bash", "GraphQL", "REST APIs", "Tailwind CSS", "Prisma", "CI/CD",
  // Data & AI
  "Pandas", "NumPy", "Scikit-learn", "PyTorch", "TensorFlow", "Tableau", "Power BI", "Excel", "Data Modeling",
  "ETL Pipelines", "Statistical Analysis", "A/B Testing", "Data Cleaning", "dbt", "Snowflake", "BigQuery",
  "Apache Spark", "Airflow", "Jupyter", "Machine Learning", "Linear Algebra", "RAG", "Vector Databases",
  // Product & Agile
  "Product Strategy", "Agile", "Scrum", "Jira", "Figma", "User Research", "PRD Writing", "Roadmapping",
  "Feature Prioritization", "Stakeholder Communication", "A/B Testing", "Mixpanel", "Amplitude",
  // Cyber & SecOps
  "Networking", "TCP/IP", "Wireshark", "Splunk", "SIEM", "Incident Response", "EDR", "MITRE ATT&CK",
  "Vulnerability Scanning", "Nessus", "Cloud Security", "Firewalls"
];

export function parseResumeText(rawText: string, fileName?: string): ResumeProfile {
  // Sanitize binary PDF/DOCX artifacts: keep printable ASCII and clean whitespace
  const sanitizedText = rawText.replace(/[^\x20-\x7E\r\n\t]/g, " ").replace(/\s+/g, " ");
  const textUpper = (sanitizedText || rawText).toUpperCase();
  const lowerText = (sanitizedText || rawText).toLowerCase();

  // Extract candidate name: from first valid line or fallback to file name
  const lines = rawText
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !l.startsWith("%PDF") && !l.includes("obj") && !l.includes("<<"));

  let extractedName = "";
  if (lines.length > 0) {
    const candidate = lines[0].replace(/[^a-zA-Z\s]/g, "").trim();
    if (candidate.length > 2 && candidate.length < 35 && !candidate.toUpperCase().includes("RESUME") && !candidate.toUpperCase().includes("CURRICULUM")) {
      extractedName = candidate;
    }
  }

  // If candidate name wasn't cleanly extracted from binary header, derive from filename
  if (!extractedName && fileName) {
    const cleanFileName = fileName
      .replace(/\.(pdf|docx?|txt|rtf)$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b(resume|cv|profile|final|updated|latest|new|202[0-9])\b/gi, "")
      .trim();
    if (cleanFileName.length >= 2) {
      extractedName = cleanFileName
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  const name = extractedName || "Candidate Profile";

  // Email extraction
  const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  const email = emailMatch ? emailMatch[1] : undefined;

  // Title extraction heuristic
  let title = "Technology Professional";
  if (textUpper.includes("DATA ANALYST")) title = "Data Analyst";
  else if (textUpper.includes("SOFTWARE ENGINEER") || textUpper.includes("FULL STACK")) title = "Full-Stack Software Engineer";
  else if (textUpper.includes("MACHINE LEARNING") || textUpper.includes("AI ENGINEER") || textUpper.includes("DATA SCIENTIST")) title = "AI / Data Science Specialist";
  else if (textUpper.includes("PRODUCT MANAGER")) title = "Product Manager";
  else if (textUpper.includes("SECURITY") || textUpper.includes("CYBER")) title = "Cybersecurity Analyst";

  // Detected skills
  const detectedSkills: string[] = [];
  KNOWN_SKILLS.forEach(skill => {
    // Regex boundary check
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i");
    if (regex.test(rawText)) {
      detectedSkills.push(skill);
    }
  });

  // Categorize
  const technicalSkills: string[] = [];
  const toolsAndSoftware: string[] = [];
  const toolKeywords = ["Tableau", "Power BI", "Excel", "Git", "GitHub", "Jira", "Figma", "Docker", "Kubernetes", "VS Code", "Postman", "Splunk", "Wireshark", "Notion", "Linear", "Mixpanel"];

  detectedSkills.forEach(s => {
    if (toolKeywords.some(t => t.toLowerCase() === s.toLowerCase())) {
      toolsAndSoftware.push(s);
    } else {
      technicalSkills.push(s);
    }
  });

  // Experience level heuristic
  let experienceLevel: ResumeProfile["experienceLevel"] = "Mid";
  let yearsOfExperience = 3;
  if (/(\b\d+(\.\d+)?\+?\s*(years|yrs|year)\b)/i.test(rawText)) {
    const match = rawText.match(/(\d+(\.\d+)?)\+?\s*(years|yrs|year)/i);
    if (match) {
      yearsOfExperience = parseFloat(match[1]);
      if (yearsOfExperience < 2) experienceLevel = "Entry";
      else if (yearsOfExperience >= 5 && yearsOfExperience < 8) experienceLevel = "Senior";
      else if (yearsOfExperience >= 8) experienceLevel = "Lead";
    }
  }

  // Summary
  const summary = rawText.slice(0, 320).replace(/[\r\n]+/g, " ").trim() + "...";

  return {
    name,
    title,
    email,
    summary: summary.length > 50 ? summary : "Driven professional with proven domain execution, cross-functional collaboration, and technical mastery.",
    technicalSkills: technicalSkills.length > 0 ? Array.from(new Set(technicalSkills)) : ["Problem Solving", "Analytical Thinking", "Data Management", "Technical Execution"],
    softSkills: ["Stakeholder Communication", "Strategic Execution", "Cross-Functional Collaboration", "Continuous Learning"],
    toolsAndSoftware: toolsAndSoftware.length > 0 ? Array.from(new Set(toolsAndSoftware)) : ["Git", "Excel", "Modern Workflows"],
    experienceLevel,
    yearsOfExperience,
    keyStrengths: [
      `Demonstrated mastery in ${technicalSkills.slice(0, 2).join(" & ") || "core technical systems"}`,
      `Hands-on production track record with modern enterprise workflows`,
      `High adaptability to next-generation tools and cloud architectures`
    ],
    targetRoles: [title, `Senior ${title}`, "Lead Specialist"],
    rawText
  };
}

// Job matching algorithm with score calculation
export function calculateJobMatches(profile: ResumeProfile): JobMatch[] {
  const allUserSkills = [
    ...profile.technicalSkills.map(s => s.toLowerCase()),
    ...profile.toolsAndSoftware.map(s => s.toLowerCase()),
    ...profile.softSkills.map(s => s.toLowerCase()),
    profile.title.toLowerCase()
  ];

  return MASTER_JOB_LISTINGS.map(job => {
    const matched: string[] = [];
    const missing: string[] = [];

    job.matchedSkills.forEach(req => {
      const isMatch = allUserSkills.some(userSkill =>
        userSkill.includes(req.toLowerCase()) || req.toLowerCase().includes(userSkill)
      );
      if (isMatch) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    // Score computation
    let score = 55; // baseline
    if (job.matchedSkills.length > 0) {
      const matchRatio = matched.length / job.matchedSkills.length;
      score = Math.round(50 + matchRatio * 45);
    }

    // Role relevance bonus
    const titleWords = job.title.toLowerCase().split(" ");
    const hasRoleOverlap = titleWords.some(w => w.length > 3 && profile.title.toLowerCase().includes(w));
    if (hasRoleOverlap) score = Math.min(99, score + 6);

    // Clamp score
    const finalScore = Math.min(98, Math.max(68, score));

    return {
      ...job,
      matchScore: finalScore,
      matchedSkills: matched.length > 0 ? matched : [job.matchedSkills[0] || "Foundational Experience"],
      missingSkills: missing.length > 0 ? missing : job.missingSkills
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// The "One-Skill Unlock" Generator (High ROI Opportunities)
export function generateOneSkillUnlocks(profile: ResumeProfile): OneSkillUnlock[] {
  const userSkillSet = new Set([
    ...profile.technicalSkills.map(s => s.toLowerCase()),
    ...profile.toolsAndSoftware.map(s => s.toLowerCase()),
  ]);

  const unlocks: OneSkillUnlock[] = [];

  // Data Analyst -> Senior / Cloud Analytics Unlock
  if (profile.title.toLowerCase().includes("data") || profile.technicalSkills.some(s => ["sql", "tableau", "python", "excel"].includes(s.toLowerCase()))) {
    unlocks.push({
      id: "unlock-snowflake-dbt",
      targetRole: "Senior Analytics Engineer / Modern Cloud Data Lead",
      currentRole: profile.title,
      currentEstimatedSalary: 95000,
      unlockedEstimatedSalary: 148000,
      salaryBoostPercent: 55,
      missingSkills: ["Snowflake Cloud Data Warehouse", "dbt (Data Build Tool)"],
      possessedSkills: ["SQL", "Data Modeling", "ETL Pipelines", "Python", "Business Intelligence"],
      headline: "You already know SQL & Data Modeling. Learn Snowflake + dbt to unlock $145k+ Cloud Analytics roles.",
      unlockReasoning:
        "Top-paying tech companies have migrated from legacy SQL servers to modern Cloud Warehouses (Snowflake) and modular transformation (dbt). Because you already understand schema design and complex SQL queries, you only need to learn Snowflake syntax and dbt DAG orchestration to qualify for Senior Analytics Engineer bands.",
      bridgePlan: {
        estimatedTimeToLearn: "3 - 4 Weeks (6 hrs/wk)",
        weeklyHoursCommitment: 6,
        recommendedCourses: [
          {
            name: "Snowflake Fundamentals & Modern Data Stack",
            platform: "Snowflake University (Free Certification Prep)",
            url: "https://learn.snowflake.com",
            isFree: true,
            duration: "8 hours"
          },
          {
            name: "dbt Learn Fundamentals",
            platform: "dbt Labs Official (Free)",
            url: "https://courses.getdbt.com",
            isFree: true,
            duration: "5 hours"
          }
        ],
        portfolioProject: {
          title: "End-to-End Snowflake + dbt Transformation Pipeline",
          description:
            "Build an automated data pipeline that ingests raw Stripe payment events into Snowflake, models them into fact/dimension tables using dbt tests and documentation, and pushes to a live dashboard.",
          deliverable: "Public GitHub repository with dbt DAG docs, SQL schema models, and Snowflake architecture diagram.",
          impactStatement: "Demonstrates production modern data stack competency, turning a standard analyst profile into a high-demand Analytics Engineer.",
          technologies: ["Snowflake", "dbt Core", "SQL", "GitHub Actions"]
        }
      }
    });

    unlocks.push({
      id: "unlock-spark-ml",
      targetRole: "Senior Predictive Data Scientist",
      currentRole: profile.title,
      currentEstimatedSalary: 100000,
      unlockedEstimatedSalary: 155000,
      salaryBoostPercent: 55,
      missingSkills: ["PySpark / Distributed Big Data", "Machine Learning Pipeline Deployments"],
      possessedSkills: ["Python", "Pandas", "Statistical Analysis", "A/B Testing", "SQL"],
      headline: "Upgrade from single-machine Pandas to PySpark to handle Big Data at scale.",
      unlockReasoning:
        "You already write clean Python and understand exploratory analysis. By learning PySpark's resilient distributed datasets (RDDs) and MLlib, you cross the barrier into Big Data engineering and algorithmic Data Science.",
      bridgePlan: {
        estimatedTimeToLearn: "4 Weeks (7 hrs/wk)",
        weeklyHoursCommitment: 7,
        recommendedCourses: [
          {
            name: "Taming Big Data with Apache Spark and Python",
            platform: "Coursera / Databricks Academy",
            url: "https://academy.databricks.com",
            isFree: true,
            duration: "12 hours"
          }
        ],
        portfolioProject: {
          title: "Distributed Churn Prediction Engine on 50 Million Records",
          description:
            "Train a Random Forest classifier over a 50GB synthetic telecommunications dataset using PySpark on a multi-node cluster, achieving 94% ROC-AUC.",
          deliverable: "PySpark Jupyter Notebook and Databricks community edition shareable link.",
          impactStatement: "Proves you can handle scale beyond local memory constraints, commanding senior compensation.",
          technologies: ["Apache Spark", "PySpark", "MLlib", "AWS S3"]
        }
      }
    });
  }

  // Full-Stack / Software Engineer -> Cloud Architect / DevOps Unlock
  if (profile.title.toLowerCase().includes("software") || profile.title.toLowerCase().includes("full-stack") || profile.technicalSkills.some(s => ["react", "node.js", "typescript", "javascript"].includes(s.toLowerCase()))) {
    unlocks.push({
      id: "unlock-k8s-cloud",
      targetRole: "Senior Cloud Platform & Infrastructure Engineer",
      currentRole: profile.title,
      currentEstimatedSalary: 120000,
      unlockedEstimatedSalary: 185000,
      salaryBoostPercent: 54,
      missingSkills: ["Docker & Kubernetes Orchestration", "Terraform (Infrastructure as Code)"],
      possessedSkills: ["TypeScript", "Node.js", "Next.js", "PostgreSQL", "REST APIs", "Git"],
      headline: "You build web apps. Master Kubernetes & Terraform to unlock $185k+ Cloud Platform roles.",
      unlockReasoning:
        "Companies are paying top dollar for engineers who not only write application logic, but can automate zero-downtime deployments, manage container clusters, and define cloud environments in code.",
      bridgePlan: {
        estimatedTimeToLearn: "3 - 5 Weeks (8 hrs/wk)",
        weeklyHoursCommitment: 8,
        recommendedCourses: [
          {
            name: "Kubernetes for Developers (CKAD Prep)",
            platform: "Linux Foundation / KodeKloud",
            url: "https://kodekloud.com",
            isFree: false,
            duration: "16 hours"
          },
          {
            name: "Terraform Associate 003 Crash Course",
            platform: "freeCodeCamp (YouTube)",
            url: "https://youtube.com",
            isFree: true,
            duration: "6 hours"
          }
        ],
        portfolioProject: {
          title: "Production GitOps Deployment of Next.js App on EKS with Terraform",
          description:
            "Provision an AWS VPC and Kubernetes cluster completely using Terraform HCL. Automate CI/CD with GitHub Actions to deploy a multi-replica Next.js app with automated SSL and ingress routing.",
          deliverable: "GitHub Repo with documented Terraform modules, Helm charts, and live URL.",
          impactStatement: "Proves you have full autonomy from code writing to cloud infrastructure management.",
          technologies: ["Kubernetes", "Docker", "Terraform", "AWS EKS", "GitHub Actions"]
        }
      }
    });
  }

  // AI / Junior ML Specialist -> Production MLOps / RAG Architect Unlock
  if (profile.title.toLowerCase().includes("ai") || profile.title.toLowerCase().includes("learning") || profile.technicalSkills.some(s => ["pytorch", "scikit-learn"].includes(s.toLowerCase()))) {
    unlocks.push({
      id: "unlock-rag-vllm",
      targetRole: "Staff AI Solutions Architect / GenAI Lead",
      currentRole: profile.title,
      currentEstimatedSalary: 110000,
      unlockedEstimatedSalary: 195000,
      salaryBoostPercent: 77,
      missingSkills: ["Enterprise RAG Architectures (Vector DBs)", "vLLM / High-Throughput Inference"],
      possessedSkills: ["Python", "PyTorch", "Scikit-learn", "NumPy", "Pandas", "Linear Algebra"],
      headline: "Bridge from basic ML modeling to Enterprise GenAI & Vector Retrieval to unlock $190k+.",
      unlockReasoning:
        "The fastest growing salary band in modern tech is for engineers who know how to plug LLMs into proprietary enterprise databases via Vector Search, semantic reranking, and low-latency inference servers.",
      bridgePlan: {
        estimatedTimeToLearn: "3 Weeks (6 hrs/wk)",
        weeklyHoursCommitment: 6,
        recommendedCourses: [
          {
            name: "Building Production-Ready RAG Systems",
            platform: "DeepLearning.AI (Andrew Ng)",
            url: "https://deeplearning.ai",
            isFree: true,
            duration: "5 hours"
          }
        ],
        portfolioProject: {
          title: "Multi-Modal Agentic Knowledge Engine with Hybrid Retrieval & LangGraph",
          description:
            "Build an interactive enterprise assistant that indexes 10,000 PDF documents into Pinecone, performs reciprocal rank fusion, and cites source pages with 99% accuracy.",
          deliverable: "Live deployed demo with Next.js frontend and FastAPI backend.",
          impactStatement: "Directly showcases the most in-demand AI skill set in 2026 enterprise tech.",
          technologies: ["Pinecone", "LangGraph", "FastAPI", "vLLM", "Next.js"]
        }
      }
    });
  }

  // Fallback high-ROI unlock if none matched specifically
  if (unlocks.length === 0) {
    unlocks.push({
      id: "unlock-system-design",
      targetRole: "Senior Systems Engineer / Technical Lead",
      currentRole: profile.title,
      currentEstimatedSalary: 115000,
      unlockedEstimatedSalary: 165000,
      salaryBoostPercent: 43,
      missingSkills: ["Distributed System Design", "Microservices & Message Queues (Kafka)"],
      possessedSkills: profile.technicalSkills.slice(0, 5),
      headline: "Master Distributed Architecture and Caching to jump from individual contributor to Tech Lead.",
      unlockReasoning:
        "The primary barrier separating mid-level engineers from senior roles paying $160k+ is the ability to articulate trade-offs in high-concurrency systems, asynchronous messaging, and failure modes.",
      bridgePlan: {
        estimatedTimeToLearn: "4 Weeks (5 hrs/wk)",
        weeklyHoursCommitment: 5,
        recommendedCourses: [
          {
            name: "Designing Data-Intensive Applications Study Guide",
            platform: "Martin Kleppmann / O'Reilly",
            url: "https://dataintensive.net",
            isFree: false,
            duration: "20 hours"
          }
        ],
        portfolioProject: {
          title: "Distributed Event-Driven Order Processing System with Kafka & Redis",
          description:
            "Design and build an idempotent payment processing pipeline capable of handling 10,000 requests/sec with graceful backpressure handling.",
          deliverable: "Architecture whitepaper + GitHub repository with benchmarking results.",
          impactStatement: "Demonstrates senior-level maturity that passes technical system design loops effortlessly.",
          technologies: ["Apache Kafka", "Redis", "Docker", "Go / Node.js"]
        }
      }
    });
  }

  return unlocks;
}
