"use client";

import React, { useState } from "react";
import { CareerBlueprint, ResumeProfile } from "@/types";
import { MASTER_CAREER_BLUEPRINTS } from "@/data/careerBlueprints";
import {
  Compass,
  Search,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  Brain,
  Terminal,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Check
} from "lucide-react";

interface CareerExplorerTabProps {
  profile: ResumeProfile;
  selectedBlueprintId: string;
  onSelectBlueprintId: (id: string) => void;
  onAskAiAboutRole: (roleTitle: string) => void;
}

export function CareerExplorerTab({
  profile,
  selectedBlueprintId,
  onSelectBlueprintId,
  onAskAiAboutRole,
}: CareerExplorerTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [overlayResume, setOverlayResume] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "tech" | "roadmap">("overview");
  const [checkedMilestones, setCheckedMilestones] = useState<Record<string, boolean>>({});

  // All blueprints
  const allBlueprints = Object.values(MASTER_CAREER_BLUEPRINTS);

  // Dynamic blueprint generator if user types a custom role
  const matchedBlueprint = allBlueprints.find(
    (b) => b.id === selectedBlueprintId || b.title.toLowerCase() === selectedBlueprintId.toLowerCase()
  );

  const currentBlueprint: CareerBlueprint = matchedBlueprint || {
    id: "custom-role",
    title: searchQuery || "Technology Specialist",
    category: "Software Engineering",
    overview: `Specialized career track for ${searchQuery || "Technology Specialist"}, focusing on scalable architecture, agile methodologies, and high-impact modern execution.`,
    averageSalaryUsd: "$110,000 - $165,000/yr",
    growthRate: "+24% (High demand industry)",
    openRolesCount: "45,000+ active openings",
    seniorityLevels: [
      { level: "Junior Tier", yearsExp: "0 - 2 yrs", avgPay: "$70,000 - $90,000" },
      { level: "Mid-Level Professional", yearsExp: "2 - 5 yrs", avgPay: "$105,000 - $140,000" },
      { level: "Senior / Lead", yearsExp: "5 - 8 yrs", avgPay: "$145,000 - $190,000" },
    ],
    coreQualities: [
      { name: "Strategic Problem Solving", description: "Analyzing system trade-offs and delivering robust solutions under deadlines.", iconName: "Brain" },
      { name: "Continuous Skill Evolution", description: "Adapting rapidly to cutting-edge tools, libraries, and best practices.", iconName: "Sparkles" },
      { name: "Clear Technical Communication", description: "Articulating complex architectural ideas to diverse stakeholders.", iconName: "Briefcase" },
    ],
    techStack: [
      { name: "Foundational Languages & CLI", category: "Core Basics", level: "Beginner", importance: "Essential", description: "Core syntax, version control with Git, and terminal navigation." },
      { name: "Frameworks & Modern Tooling", category: "Frameworks", level: "Intermediate", importance: "Essential", description: "High-level frameworks, state management, and API design." },
      { name: "Cloud Architecture & Optimization", category: "Scale", level: "Advanced", importance: "Highly Valued", description: "Performance tuning, caching, and CI/CD automation." },
    ],
    roadmap: [
      {
        phaseNumber: 1,
        phaseName: "Core Foundations & Setup",
        durationWeeks: "Weeks 1 - 4",
        objective: "Establish fundamental tooling fluency and version control basics.",
        keyMilestones: ["Master core CLI commands and Git", "Build initial working prototype"],
        recommendedProjects: ["Foundational Project Prototype on GitHub"]
      },
      {
        phaseNumber: 2,
        phaseName: "Architecture & Integration",
        durationWeeks: "Weeks 5 - 8",
        objective: "Integrate APIs, databases, and third-party services.",
        keyMilestones: ["Connect backend databases", "Implement automated unit tests"],
        recommendedProjects: ["End-to-end full working application"]
      },
      {
        phaseNumber: 3,
        phaseName: "Scale, Performance & Portfolio",
        durationWeeks: "Weeks 9 - 12",
        objective: "Polish production deployments and prepare for technical interviews.",
        keyMilestones: ["Deploy to production on cloud hosting", "Mock technical interviews"],
        recommendedProjects: ["Publicly hosted live case study"]
      }
    ]
  };

  // Helper to determine if user possesses a skill
  const userHasSkill = (skillName: string): boolean => {
    const s = skillName.toLowerCase();
    const userSkills = [
      ...profile.technicalSkills.map((t) => t.toLowerCase()),
      ...profile.toolsAndSoftware.map((t) => t.toLowerCase()),
    ];
    return userSkills.some((u) => s.includes(u) || u.includes(s));
  };

  const toggleMilestone = (key: string) => {
    setCheckedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Search */}
      <div className="bg-obsidian-900/90 border border-slate-800 p-6 rounded-2xl shadow-glass backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2 border border-cyan-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Career Path & Role Blueprint Explorer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              The "Become Anything" Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore step-by-step career blue-prints, essential tools, and compare against your active resume.
            </p>
          </div>

          {/* Search or Custom Career Generator */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search or type any role (e.g. Data Analyst)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Quick Popular Pills */}
        <div className="mt-4 flex items-center gap-2 flex-wrap text-xs pt-4 border-t border-slate-800/80">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            Popular Tracks:
          </span>
          {allBlueprints.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                onSelectBlueprintId(b.id);
                setSearchQuery("");
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                currentBlueprint.id === b.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 border-slate-700/60"
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Role Blueprint Header Card */}
      <div className="bg-obsidian-900/95 border border-slate-800 rounded-2xl p-6 shadow-glass">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-2xl font-black text-white">{currentBlueprint.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {currentBlueprint.category}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {currentBlueprint.overview}
            </p>
          </div>

          {/* Resume Overlay Toggle Switch */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-obsidian-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              Overlay Resume Match
            </span>
            <button
              onClick={() => setOverlayResume(!overlayResume)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                overlayResume ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  overlayResume ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quick Stats: Salary, Growth, Open Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Average US Compensation</div>
              <div className="text-sm font-bold text-white">{currentBlueprint.averageSalaryUsd}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Market Growth Rate</div>
              <div className="text-sm font-bold text-white">{currentBlueprint.growthRate}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Active Job Market</div>
              <div className="text-sm font-bold text-white">{currentBlueprint.openRolesCount}</div>
            </div>
          </div>
        </div>

        {/* Seniority Ladder */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="text-xs font-semibold text-slate-300 mb-2">Compensation by Seniority Ladder:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {currentBlueprint.seniorityLevels.map((lvl, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-obsidian-900 border border-slate-800">
                <div className="font-semibold text-slate-200">{lvl.level}</div>
                <div className="text-[11px] text-slate-400">{lvl.yearsExp}</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">{lvl.avgPay}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-tabs: Bento Sections */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Core Qualities & Mindset
          </button>
          <button
            onClick={() => setActiveTab("tech")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "tech"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Programs & Tech Stack
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "roadmap"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Step-by-Step Learning Roadmap
          </button>
        </div>

        {/* Tab 1: Core Qualities */}
        {activeTab === "overview" && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentBlueprint.coreQualities.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1.5">
                  <Brain className="w-4 h-4" />
                  <span>{q.name}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{q.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Tech Stack (Categorized: Beginner -> Intermediate -> Advanced) */}
        {activeTab === "tech" && (
          <div className="mt-5 space-y-6">
            {(["Beginner", "Intermediate", "Advanced"] as const).map((level) => {
              const skillsAtLevel = currentBlueprint.techStack.filter((s) => s.level === level);
              if (skillsAtLevel.length === 0) return null;

              return (
                <div key={level} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                        level === "Beginner"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : level === "Intermediate"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      {level} Stack
                    </span>
                    <span className="text-xs text-slate-500">
                      {level === "Beginner"
                        ? "Must-have foundational tooling"
                        : level === "Intermediate"
                        ? "Core day-to-day production proficiency"
                        : "High-leverage senior specialization"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skillsAtLevel.map((skill, idx) => {
                      const hasSkill = overlayResume && userHasSkill(skill.name);

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                            hasSkill
                              ? "bg-emerald-950/20 border-emerald-500/40"
                              : "bg-slate-950/60 border-slate-800"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-slate-200">{skill.name}</span>
                              {overlayResume && (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    hasSkill
                                      ? "bg-emerald-500/20 text-emerald-300"
                                      : "bg-amber-500/10 text-amber-400"
                                  }`}
                                >
                                  {hasSkill ? "✓ On Resume" : "To Learn"}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mb-1.5">{skill.category}</div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Step-by-Step Learning Roadmap */}
        {activeTab === "roadmap" && (
          <div className="mt-5 space-y-6">
            <div className="text-xs text-slate-400">
              Follow this interactive 4-phase timeline. Check off milestones as you master them to track progress.
            </div>

            <div className="space-y-4">
              {currentBlueprint.roadmap.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold flex items-center justify-center text-xs">
                        {phase.phaseNumber}
                      </div>
                      <h4 className="text-sm font-bold text-white">{phase.phaseName}</h4>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {phase.durationWeeks}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 font-medium">{phase.objective}</p>

                  {/* Milestones list with checkboxes */}
                  <div className="mt-3.5 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Phase Milestones:
                    </div>
                    {phase.keyMilestones.map((milestone, idx) => {
                      const key = `${phase.phaseNumber}-${idx}`;
                      const isChecked = !!checkedMilestones[key];

                      return (
                        <div
                          key={idx}
                          onClick={() => toggleMilestone(key)}
                          className={`cursor-pointer p-2 rounded-lg flex items-start gap-2.5 text-xs transition-colors ${
                            isChecked
                              ? "bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 line-through"
                              : "bg-obsidian-900/60 border border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                          <span>{milestone}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommended Projects */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-300">Phase Proof Projects:</span>
                      {phase.recommendedProjects.map((proj, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]"
                        >
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom AI Prompt Action */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Have questions about transitioning into <strong className="text-white">{currentBlueprint.title}</strong>?
          </div>
          <button
            onClick={() =>
              onAskAiAboutRole(
                `I want to become a ${currentBlueprint.title}. Based on my current resume as ${profile.title}, create a realistic weekly study schedule and tell me which of my current skills will transfer best.`
              )
            }
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 transition-all shadow-glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Custom {currentBlueprint.title} Study Plan with Aria</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
