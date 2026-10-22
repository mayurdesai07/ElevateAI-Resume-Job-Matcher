"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ClipboardList,
  AlertTriangle,
  XCircle,
  FileWarning,
  Check
} from "lucide-react";
import { SAMPLE_RESUMES } from "@/data/mockResumes";
import { ResumeProfile } from "@/types";

interface HeroDropzoneProps {
  onProfileLoaded: (profile: ResumeProfile) => void;
  activeProfile: ResumeProfile;
}

export function HeroDropzone({ onProfileLoaded, activeProfile }: HeroDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<{ message: string; reason?: string } | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    // Reset file input so re-uploading same file name re-triggers
    e.target.value = "";
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setValidationError(null);
    setValidationSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.isValid) {
        setValidationError({
          message: data.error || "The uploaded document could not be validated as a professional resume. Please upload a valid CV or resume.",
          reason: data.rejectionReason,
        });
        setIsProcessing(false);
        return;
      }

      // Valid Resume!
      const skillsCount = data.profile?.technicalSkills?.length || 0;
      setValidationSuccess(
        `Resume verified: ${skillsCount} technical skills detected across Experience & Education.`
      );
      onProfileLoaded(data.profile);

      setTimeout(() => {
        setValidationSuccess(null);
      }, 5000);
    } catch (err: any) {
      console.error("Resume upload error:", err);
      setValidationError({
        message: "An error occurred while uploading and parsing the document. Please try again or paste resume text.",
      });
    } finally {
      setIsProcessing(false);
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

  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setPasteError(null);

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pastedText, fileName: "Pasted Resume Text" }),
      });

      const data = await res.json();

      if (!res.ok || !data.isValid) {
        setPasteError(
          data.error || "Pasted content lacks resume structure or technical skills. Please paste a complete resume."
        );
        setIsProcessing(false);
        return;
      }

      onProfileLoaded(data.profile);
      const skillsCount = data.profile?.technicalSkills?.length || 0;
      setValidationSuccess(
        `Resume verified: ${skillsCount} technical skills detected from pasted text.`
      );
      setShowPasteModal(false);
      setPastedText("");
      setValidationError(null);

      setTimeout(() => {
        setValidationSuccess(null);
      }, 5000);
    } catch (err) {
      setPasteError("Error parsing pasted text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative pt-6 pb-8 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Career Intelligence Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 text-xs text-blue-700 dark:text-blue-300 mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-blue-600 dark:text-blue-400">AI Career Studio</span>
          <span className="text-slate-400">·</span>
          <span>Find roles paying +35% where you're only missing 1 skill</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
          Find Jobs Fitted to Your Resume. <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Unlock High-Paying Roles With Just 1 Skill.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload your resume to discover instant direct job matches, pinpoint the exact single skill holding you back from a 35%+ salary boost, and get guided by <strong className="text-slate-900 dark:text-white font-semibold">Zara</strong>, your AI career coach.
        </p>

        {/* Upload / Quick Test Container */}
        <div className="mt-8 max-w-2xl mx-auto">
          {/* Validation Rejection Error Alert Banner */}
          {validationError && (
            <div className="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800 text-left shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/60 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileWarning className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-red-900 dark:text-red-200">
                      Invalid Document — Not a Resume
                    </h4>
                    <button
                      onClick={() => setValidationError(null)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                    {validationError.message}
                  </p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Upload Another File
                    </button>
                    <button
                      onClick={() => {
                        setValidationError(null);
                        onProfileLoaded(SAMPLE_RESUMES.alex_data_analyst);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-red-200 dark:border-slate-700 text-red-800 dark:text-slate-200 text-xs font-semibold transition-all"
                    >
                      Try Sample Resume Instead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Success Notification Banner */}
          {validationSuccess && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-left shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="flex-1 text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
                {validationSuccess}
              </div>
              <button
                onClick={() => setValidationSuccess(null)}
                className="text-emerald-600 dark:text-emerald-400 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Dropzone Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer relative rounded-2xl border-2 border-dashed p-6 sm:p-7 transition-all ${
              isDragging
                ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 scale-[1.01]"
                : "border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800 shadow-card"
            } group`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 border border-blue-100 dark:border-slate-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:border-blue-300 dark:group-hover:border-blue-400 shadow-sm">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {isProcessing ? (
                  "Verifying document authenticity & extracting skills..."
                ) : (
                  <>
                    <span className="text-blue-600 dark:text-blue-400 underline underline-offset-2">Click to upload resume</span> or drag &amp; drop
                  </>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports PDF, DOCX, or TXT (Strict resume validation &amp; ATS parsed)
              </p>
            </div>
          </div>

          {/* Quick Actions & 1-Click Samples */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="w-full sm:w-auto flex justify-center sm:justify-start">
              <button
                onClick={() => {
                  setPasteError(null);
                  setShowPasteModal(true);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
              >
                <ClipboardList className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Paste Resume Text</span>
              </button>
            </div>

            {/* Instant Sample Selectors */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap w-full sm:w-auto">
              <span className="text-slate-500 dark:text-slate-400 hidden sm:inline font-medium">Try Sample:</span>
              <button
                onClick={() => {
                  setValidationError(null);
                  onProfileLoaded(SAMPLE_RESUMES.alex_data_analyst);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold border text-[11px] sm:text-xs ${
                  activeProfile.name === "Alex Rivera"
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700"
                }`}
              >
                📊 Data Analyst
              </button>

              <button
                onClick={() => {
                  setValidationError(null);
                  onProfileLoaded(SAMPLE_RESUMES.sarah_fullstack_dev);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold border text-[11px] sm:text-xs ${
                  activeProfile.name === "Sarah Chen"
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700"
                }`}
              >
                💻 Full-Stack Dev
              </button>

              <button
                onClick={() => {
                  setValidationError(null);
                  onProfileLoaded(SAMPLE_RESUMES.marcus_junior_ai);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold border text-[11px] sm:text-xs ${
                  activeProfile.name === "Marcus Vance"
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700"
                }`}
              >
                🤖 AI / ML
              </button>

              <button
                onClick={() => {
                  setValidationError(null);
                  onProfileLoaded(SAMPLE_RESUMES.elena_product_ops);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all font-semibold border text-[11px] sm:text-xs ${
                  activeProfile.name === "Elena Rostova"
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700"
                }`}
              >
                🎯 Product Mgr
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Paste Resume Text Modal with Inline Validation Feedback */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Paste Your Resume Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Copy and paste your resume text below. Our engine validates structural authenticity and extracts verified skills without fabricating jobs.
            </p>

            {pasteError && (
              <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{pasteError}</span>
              </div>
            )}

            <textarea
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                if (pasteError) setPasteError(null);
              }}
              placeholder="Paste your resume sections (Experience, Education, Skills, Projects)..."
              rows={8}
              className="mt-4 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />

            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setShowPasteModal(false);
                  setPasteError(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pastedText.trim() || isProcessing}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shadow-button flex items-center gap-1.5"
              >
                {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isProcessing ? "Verifying..." : "Validate & Match Jobs"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
