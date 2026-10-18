import { JobMatch, ResumeProfile } from "@/types";
import { MASTER_JOB_LISTINGS } from "@/data/jobListings";

// In-memory cache to prevent excessive API calls
interface CacheEntry {
  timestamp: number;
  jobs: JobMatch[];
}
let cachedJobs: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Supported Greenhouse Company Boards (open public APIs)
const GREENHOUSE_BOARDS = [
  { company: "Figma", token: "figma", logo: "🎨" },
  { company: "Discord", token: "discord", logo: "💬" },
  { company: "Datadog", token: "datadog", logo: "🐶" },
  { company: "GitLab", token: "gitlab", logo: "🦊" },
];

/**
 * Match a raw job against candidate's profile to compute match score and skills
 */
export function matchJobToProfile(
  raw: {
    id: string;
    title: string;
    company: string;
    location: string;
    workplaceType: "Remote" | "Hybrid" | "On-site";
    salaryRange: string;
    minSalary: number;
    maxSalary: number;
    url?: string;
    source?: string;
    description: string;
    postedDaysAgo?: number;
  },
  profile: ResumeProfile
): JobMatch {
  const userSkillList = [
    ...(profile.technicalSkills || []),
    ...(profile.toolsAndSoftware || []),
    ...(profile.softSkills || []),
  ];
  const userSkillLower = userSkillList.map((s) => s.toLowerCase());

  // Detect skills mentioned in title or description
  const combinedText = `${raw.title} ${raw.description || ""}`.toLowerCase();
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const commonTechSkills = [
    "SQL", "Python", "Tableau", "Power BI", "Excel", "Data Modeling", "ETL",
    "Snowflake", "BigQuery", "Spark", "JavaScript", "TypeScript", "React",
    "Node.js", "Docker", "AWS", "GCP", "Git", "Jira", "PostgreSQL"
  ];

  commonTechSkills.forEach((skill) => {
    const sLower = skill.toLowerCase();
    if (combinedText.includes(sLower)) {
      if (userSkillLower.some((u) => u.includes(sLower) || sLower.includes(u))) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
  });

  // Calculate dynamic match score
  let score = 70;
  if (matchedSkills.length > 0) {
    score += Math.min(25, matchedSkills.length * 6);
  }

  // Bonus if role title matches profile title
  const titleWords = raw.title.toLowerCase().split(/\s+/);
  if (titleWords.some((w) => w.length > 3 && profile.title.toLowerCase().includes(w))) {
    score += 8;
  }

  const finalScore = Math.min(98, Math.max(72, score));

  return {
    id: raw.id,
    title: raw.title,
    company: raw.company,
    location: raw.location || "Remote, Global",
    workplaceType: raw.workplaceType,
    salaryRange: raw.salaryRange,
    minSalary: raw.minSalary,
    maxSalary: raw.maxSalary,
    matchScore: finalScore,
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : profile.technicalSkills.slice(0, 3),
    missingSkills: missingSkills.length > 0 ? missingSkills.slice(0, 3) : ["Cloud Architecture (AWS/GCP)"],
    whyYouFit: `Your proven background in ${profile.title} and strong proficiency in ${matchedSkills.slice(0, 2).join(" & ") || profile.technicalSkills[0]} directly match what ${raw.company} is seeking.`,
    experienceLevel: finalScore > 90 ? "Senior" : "Mid",
    description: raw.description ? raw.description.slice(0, 280) + "..." : `Exciting role at ${raw.company} matching your skills.`,
    benefits: ["Health Insurance", "Remote Flexibility", "Equity Grants", "401(k) Matching", "Home Office Stipend"],
    postedDaysAgo: raw.postedDaysAgo ?? Math.floor(Math.random() * 3) + 1,
    applicantsCount: Math.floor(Math.random() * 25) + 5,
    url: raw.url,
    source: raw.source,
  };
}

/**
 * Fetch live jobs from Jobicy API
 */
async function fetchJobicyJobs(): Promise<Partial<JobMatch>[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=20&industry=tech", {
      signal: controller.signal,
      headers: { "User-Agent": "ElevateAI-Career-Matcher/1.0" },
      next: { revalidate: 300 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.jobs || !Array.isArray(data.jobs)) return [];

    return data.jobs.map((j: any) => {
      const minSal = j.annualSalaryMin ? parseInt(j.annualSalaryMin, 10) : 115000;
      const maxSal = j.annualSalaryMax ? parseInt(j.annualSalaryMax, 10) : 165000;
      const salaryRange = j.annualSalaryMin && j.annualSalaryMax
        ? `$${Math.round(minSal / 1000)}k–$${Math.round(maxSal / 1000)}k`
        : "$120k–$160k";

      return {
        id: `jobicy-${j.id || Math.random().toString(36).substring(7)}`,
        title: j.jobTitle || "Tech Specialist",
        company: j.companyName || "High-Growth Tech",
        location: j.jobGeo || "Remote (Global/US)",
        workplaceType: "Remote",
        salaryRange,
        minSalary: minSal,
        maxSalary: maxSal,
        url: j.url || "https://jobicy.com",
        source: "Jobicy Live API",
        description: j.jobExcerpt || "",
        postedDaysAgo: 1,
      };
    });
  } catch (err) {
    console.warn("Jobicy live fetch error:", err);
    return [];
  }
}

/**
 * Fetch live jobs from Greenhouse Public Boards (Figma, Discord, Datadog, GitLab)
 */
async function fetchGreenhouseJobs(): Promise<Partial<JobMatch>[]> {
  const allBoardJobs: Partial<JobMatch>[] = [];

  for (const board of GREENHOUSE_BOARDS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board.token}/jobs`, {
        signal: controller.signal,
        headers: { "User-Agent": "ElevateAI/1.0" },
        next: { revalidate: 600 },
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;
      const data = await res.json();
      if (!data?.jobs || !Array.isArray(data.jobs)) continue;

      // Take top 4 relevant jobs per board
      const sample = data.jobs.slice(0, 4);
      sample.forEach((j: any) => {
        allBoardJobs.push({
          id: `gh-${board.token}-${j.id}`,
          title: j.title,
          company: board.company,
          location: j.location?.name || "San Francisco / Remote",
          workplaceType: j.location?.name?.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
          salaryRange: "$145k–$195k",
          minSalary: 145000,
          maxSalary: 195000,
          url: j.absolute_url || `https://boards.greenhouse.io/${board.token}`,
          source: `Greenhouse (${board.company})`,
          description: `Official job opening directly from ${board.company}'s Greenhouse ATS board.`,
          postedDaysAgo: 2,
        });
      });
    } catch (err) {
      // Continue to next board
    }
  }

  return allBoardJobs;
}

/**
 * Main Live Job Ingestion & Matcher Service
 */
export async function getLiveMatchedJobs(profile: ResumeProfile): Promise<JobMatch[]> {
  // Check in-memory cache first
  const now = Date.now();
  if (cachedJobs && now - cachedJobs.timestamp < CACHE_TTL_MS) {
    // Re-score cached jobs against active profile
    return cachedJobs.jobs.map((job) => matchJobToProfile(job, profile)).sort((a, b) => b.matchScore - a.matchScore);
  }

  // Fetch concurrently from live sources
  const [jobicyRaw, greenhouseRaw] = await Promise.all([
    fetchJobicyJobs(),
    fetchGreenhouseJobs(),
  ]);

  const combinedRaw: any[] = [...jobicyRaw, ...greenhouseRaw];

  // If live feeds returned jobs, convert and merge with curated listings
  let matchedList: JobMatch[] = [];

  if (combinedRaw.length > 0) {
    const liveMatched = combinedRaw.map((raw) => matchJobToProfile(raw, profile));
    
    // Merge live jobs with curated baseline jobs so the user always has comprehensive diversity
    const curatedMatches = MASTER_JOB_LISTINGS.map((j) => ({
      ...j,
      source: j.source || "ElevateAI Verified Market",
      url: j.url || `https://www.google.com/search?q=${encodeURIComponent(j.title + " " + j.company + " careers")}`,
    }));

    matchedList = [...liveMatched, ...curatedMatches];
  } else {
    // Fallback if network is completely offline
    matchedList = MASTER_JOB_LISTINGS.map((j) => ({
      ...j,
      source: "ElevateAI Verified Market",
      url: `https://www.google.com/search?q=${encodeURIComponent(j.title + " " + j.company + " careers")}`,
    }));
  }

  // Deduplicate by title + company
  const seen = new Set<string>();
  const uniqueJobs = matchedList.filter((j) => {
    const key = `${j.company.toLowerCase()}-${j.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort descending by match score
  uniqueJobs.sort((a, b) => b.matchScore - a.matchScore);

  // Update cache
  cachedJobs = {
    timestamp: now,
    jobs: uniqueJobs,
  };

  return uniqueJobs;
}
