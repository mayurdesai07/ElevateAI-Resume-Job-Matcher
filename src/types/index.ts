export interface ResumeProfile {
  name: string;
  title: string;
  email?: string;
  summary: string;
  technicalSkills: string[];
  softSkills: string[];
  toolsAndSoftware: string[];
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
  yearsOfExperience: number;
  education?: string;
  keyStrengths: string[];
  targetRoles: string[];
  rawText?: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  salaryRange: string;
  minSalary: number;
  maxSalary: number;
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  whyYouFit: string;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Staff";
  description: string;
  benefits: string[];
  postedDaysAgo: number;
  applicantsCount: number;
}

export interface OneSkillUnlock {
  id: string;
  targetRole: string;
  currentRole: string;
  currentEstimatedSalary: number;
  unlockedEstimatedSalary: number;
  salaryBoostPercent: number;
  missingSkills: string[];
  possessedSkills: string[];
  headline: string;
  unlockReasoning: string;
  bridgePlan: {
    estimatedTimeToLearn: string;
    weeklyHoursCommitment: number;
    recommendedCourses: {
      name: string;
      platform: string;
      url: string;
      isFree: boolean;
      duration: string;
    }[];
    portfolioProject: {
      title: string;
      description: string;
      deliverable: string;
      impactStatement: string;
      technologies: string[];
    };
  };
}

export interface CareerBlueprintQuality {
  name: string;
  description: string;
  iconName: string;
}

export interface TechStackItem {
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  importance: "Essential" | "Highly Valued" | "Bonus" | string;
  description: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  durationWeeks: string;
  objective: string;
  keyMilestones: string[];
  recommendedProjects: string[];
}

export interface CareerBlueprint {
  id: string;
  title: string;
  category: "Data & AI" | "Software Engineering" | "Product & Design" | "Cyber & Cloud" | "Business";
  overview: string;
  averageSalaryUsd: string;
  growthRate: string;
  openRolesCount: string;
  seniorityLevels: {
    level: string;
    yearsExp: string;
    avgPay: string;
  }[];
  coreQualities: CareerBlueprintQuality[];
  techStack: TechStackItem[];
  roadmap: RoadmapPhase[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedPrompts?: string[];
}
