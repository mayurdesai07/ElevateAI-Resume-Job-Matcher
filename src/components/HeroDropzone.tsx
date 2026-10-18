"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, ChevronRight, Sparkles, RefreshCw, ClipboardList, Layers } from "lucide-react";
import { SAMPLE_RESUMES } from "@/data/mockResumes";
import { ResumeProfile } from "@/types";
import { parseResumeText } from "@/lib/parser";

interface HeroDropzoneProps {
  onProfileLoaded: (profile: ResumeProfile) => void;
  activeProfile: ResumeProfile;
}

export function HeroDropzone({ onProfileLoaded, activeProfile }: HeroDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      // Heuristic text parsing
      setTimeout(() => {
        // Fallback or dynamically generate from text
        const parsed = parseResumeText(content || file.name);
        onProfileLoaded(parsed);
        setIsProcessing(false);
      }, 500);
    };

    reader.onerror = () => {
      setIsProcessing(false);
    };

    // If text file
    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      // For binary files like PDF / DOCX, extract text representation or load rich sample
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const parsed = parseResumeText(pastedText);
      onProfileLoaded(parsed);
      setIsProcessing(false);
      setShowPasteModal(false);
      setPastedText("");
    }, 400);
  };

  return (
    <div className="relative pt-6 pb-8 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-cyan-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top announcement pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs text-slate-300 mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-400">One-Skill Unlock 2.0</span>
          <span className="text-slate-500">·</span>
          <span>Find roles paying +35% where you're only missing 1 skill</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Find Jobs Fitted to Your Resume. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Unlock High-Paying Roles With Just 1 Skill.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload your resume to discover instant direct job matches, pinpoint the exact single skill holding you back from a 35%+ salary boost, and get guided by <strong className="text-slate-200">Aria</strong>, your AI career coach.
        </p>

        {/* Upload / Quick Test Container */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer relative rounded-2xl border-2 border-dashed p-7 transition-all ${
              isDragging
                ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                : "border-slate-700/80 hover:border-emerald-500/50 bg-obsidian-900/60 hover:bg-obsidian-900/90"
            } glass-panel shadow-glass group`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:border-emerald-500/40">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-emerald-400" />
                )}
              </div>

              <div className="text-sm font-semibold text-slate-200">
                {isProcessing ? (
                  "Analyzing resume & matching live job markets..."
                ) : (
                  <>
                    <span className="text-emerald-400 underline underline-offset-2">Click to upload resume</span> or drag & drop
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, or TXT (ATS parsed securely)
              </p>
            </div>
          </div>

          {/* Quick Actions & 1-Click Samples */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paste Resume Text</span>
              </button>
            </div>

            {/* Instant Sample Selectors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 hidden sm:inline">Try Sample:</span>
              <button
                onClick={() => onProfileLoaded(SAMPLE_RESUMES.alex_data_analyst)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium border ${
                  activeProfile.name === "Alex Rivera"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                📊 Data Analyst
              </button>

              <button
                onClick={() => onProfileLoaded(SAMPLE_RESUMES.sarah_fullstack_dev)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium border ${
                  activeProfile.name === "Sarah Chen"
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                💻 Full-Stack Dev
              </button>

              <button
                onClick={() => onProfileLoaded(SAMPLE_RESUMES.marcus_junior_ai)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium border ${
                  activeProfile.name === "Marcus Vance"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                🤖 AI / ML
              </button>

              <button
                onClick={() => onProfileLoaded(SAMPLE_RESUMES.elena_product_ops)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium border ${
                  activeProfile.name === "Elena Rostova"
                    ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800"
                }`}
              >
                🎯 Product Mgr
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paste Resume Text Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-obsidian-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Paste Your Resume Content
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Copy and paste the plain text of your resume or LinkedIn profile below. Our parser will instantly extract skills, tools, and experience level.
            </p>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste resume summary, skills, and work experience here..."
              rows={8}
              className="mt-4 w-full rounded-xl bg-obsidian-950 border border-slate-700/80 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />

            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim() || isProcessing}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 disabled:opacity-50 transition-all shadow-glow"
              >
                {isProcessing ? "Parsing..." : "Parse & Match Jobs"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
