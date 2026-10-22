"use client";

import React from "react";
import { OneSkillUnlock, ResumeProfile } from "@/types";
import { Zap, TrendingUp, ArrowRight, BookOpen, Laptop, Clock, CheckCircle2, AlertTriangle, Sparkles, Award, ExternalLink } from "lucide-react";

interface OneSkillUnlockTabProps {
  unlocks: OneSkillUnlock[];
  profile: ResumeProfile;
  onAskAiAboutSkill: (skillOrRole: string) => void;
}

export function OneSkillUnlockTab({
  unlocks,
  profile,
  onAskAiAboutSkill,
}: OneSkillUnlockTabProps) {
  return (
    <div className="space-y-8">
      {/* High-ROI Headline Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-amber-50/50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border border-blue-200 dark:border-slate-800 p-6 shadow-card transition-colors duration-200">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60 text-xs font-bold mb-3 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>High-ROI Opportunities Detected</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            The "One-Skill Unlock" Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Roles where you already possess <strong className="text-blue-600 dark:text-blue-400 font-semibold">80%–90% of the required skills</strong> and are only missing <strong className="text-amber-600 dark:text-amber-400 font-semibold">1 or 2 critical tools</strong> to qualify for senior salary bands.
          </p>
        </div>
      </div>

      {/* Unlock Cards List */}
      <div className="space-y-6">
        {unlocks.map((unlock) => {
          const currentSalaryFormatted = `$${(unlock.currentEstimatedSalary / 1000).toFixed(0)}k`;
          const unlockedSalaryFormatted = `$${(unlock.unlockedEstimatedSalary / 1000).toFixed(0)}k`;
          const dollarIncrease = unlock.unlockedEstimatedSalary - unlock.currentEstimatedSalary;
          const currentPercentWidth = Math.round(
            (unlock.currentEstimatedSalary / unlock.unlockedEstimatedSalary) * 100
          );

          return (
            <div
              key={unlock.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-6 shadow-card elevate-card-hover transition-all"
            >
              {/* Card Header: Target Role & Salary Boost Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Target Role Unlock:
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {unlock.targetRole}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Based on your active foundation as <span className="text-slate-800 dark:text-slate-200 font-semibold">{unlock.currentRole}</span>
                  </p>
                </div>

                {/* Boost Pill */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 font-black text-sm flex items-center gap-1.5 shadow-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>+{unlock.salaryBoostPercent}% Salary Jump</span>
                    <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-normal">
                      (+${(dollarIncrease / 1000).toFixed(0)}k/yr)
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Salary Comparison Bar */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Current Market Potential: <strong className="text-slate-800 dark:text-slate-200">{currentSalaryFormatted}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Unlocked Potential: {unlockedSalaryFormatted}+</span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <div
                    style={{ width: `${currentPercentWidth}%` }}
                    className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                  />
                  <div
                    style={{ width: "100%" }}
                    className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-blue-500/30 to-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* The Missing Link Highlight */}
              <div className="mt-5 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Missing Link:</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {unlock.headline}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {unlock.unlockReasoning}
                </p>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Missing Critical Skills:</span>
                  {unlock.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60 font-bold text-xs shadow-sm"
                    >
                      ★ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Bridge Plan Bento */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Recommended Courses */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Recommended Fast-Track Courses</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {unlock.bridgePlan.estimatedTimeToLearn}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3">
                    {unlock.bridgePlan.recommendedCourses.map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between gap-2 shadow-sm"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-white">{c.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{c.platform}</span>
                            <span>•</span>
                            <span>{c.duration}</span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            c.isFree
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                              : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                          }`}
                        >
                          {c.isFree ? "FREE" : "CERTIFIED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Portfolio Project to Prove It */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Portfolio Proof Project</span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {unlock.bridgePlan.portfolioProject.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {unlock.bridgePlan.portfolioProject.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] space-y-1 shadow-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Deliverable: </span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{unlock.bridgePlan.portfolioProject.deliverable}</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Resume Impact: </span>
                      <span className="text-slate-700 dark:text-slate-300">{unlock.bridgePlan.portfolioProject.impactStatement}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Coach Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Closing this gap can qualify you for top 10% hiring tiers</span>
                </div>

                <button
                  onClick={() =>
                    onAskAiAboutSkill(
                      `I want to learn ${unlock.missingSkills.join(" and ")} to unlock ${unlock.targetRole}. Give me a 4-week step-by-step study schedule and project guide based on my current resume.`
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-button hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span>Ask Zara for a 30-Day Bridge Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
