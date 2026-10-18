"use client";

import { useState, useEffect, useCallback } from "react";
import { JobApplication, JobMatch, ApplicationStatus } from "@/types";

const STORAGE_KEY = "elevate_job_applications";

const INITIAL_DEMO_APPLICATIONS: JobApplication[] = [
  {
    id: "app-demo-1",
    jobId: "gh-figma-5426468004",
    jobTitle: "Senior Analytics Specialist",
    company: "Figma",
    location: "San Francisco, CA (Hybrid / Remote)",
    salaryRange: "$150k–$190k",
    url: "https://boards.greenhouse.io/figma",
    status: "interviewing",
    appliedAt: "2 days ago",
    updatedAt: "Yesterday at 4:30 PM",
    matchScore: 94,
    source: "Greenhouse (Figma)",
    notes: "Applied with tailored resume pitch. Recruiter Sarah sent scheduling link for 30-min technical screening call.",
    recruiterResponse: "Screening Interview Scheduled for Thursday, 2:00 PM EST.",
    nextStep: "Review SQL Window functions & Dashboard Case Studies with Aria AI.",
  },
  {
    id: "app-demo-2",
    jobId: "job-stripe-sr-analyst",
    jobTitle: "Senior Product Data Analyst",
    company: "Stripe",
    location: "Remote (US / Canada)",
    salaryRange: "$145k–$175k",
    url: "https://stripe.com/jobs",
    status: "applied",
    appliedAt: "Today at 10:15 AM",
    updatedAt: "Just now",
    matchScore: 96,
    source: "ElevateAI 1-Click Enroll",
    notes: "Direct application submitted. Highlighted Python pipeline optimization & ARR metric impact.",
    recruiterResponse: "Application Under Review by Talent Acquisition team.",
    nextStep: "Wait 48 hours, then send recruiter follow-up email.",
  },
];

export function useApplicationTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setApplications(JSON.parse(stored));
        } else {
          setApplications(INITIAL_DEMO_APPLICATIONS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPLICATIONS));
        }
      } catch (e) {
        setApplications(INITIAL_DEMO_APPLICATIONS);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Sync to localStorage
  const saveToStorage = useCallback((items: JobApplication[]) => {
    setApplications(items);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (_) {}
    }
  }, []);

  // 1-Click Enroll & Apply to a Job
  const enrollAndApply = useCallback(
    (job: JobMatch): JobApplication => {
      const existing = applications.find((a) => a.jobId === job.id);
      const nowStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      let updatedList: JobApplication[];
      let targetRecord: JobApplication;

      if (existing) {
        targetRecord = {
          ...existing,
          status: "applied",
          updatedAt: nowStr,
          notes: existing.notes || "Enrolled via 1-Click Application portal.",
        };
        updatedList = applications.map((a) => (a.jobId === job.id ? targetRecord : a));
      } else {
        targetRecord = {
          id: `app-${Date.now()}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          salaryRange: job.salaryRange,
          url: job.url || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company + " careers")}`,
          status: "applied",
          appliedAt: nowStr,
          updatedAt: "Just now",
          matchScore: job.matchScore,
          source: job.source || "ElevateAI Verified Market",
          notes: "Direct 1-Click enrollment recorded. Ready to track recruiter response.",
          recruiterResponse: "Application submitted; awaiting response from hiring team.",
          nextStep: "Review company case studies & prepare interview questions with Aria AI.",
        };
        updatedList = [targetRecord, ...applications];
      }

      saveToStorage(updatedList);

      // Open the job's official apply portal in a new tab if URL is available
      if (typeof window !== "undefined" && targetRecord.url) {
        window.open(targetRecord.url, "_blank", "noopener,noreferrer");
      }

      return targetRecord;
    },
    [applications, saveToStorage]
  );

  // Save / Bookmark a Job to apply later
  const saveJob = useCallback(
    (job: JobMatch) => {
      const existing = applications.find((a) => a.jobId === job.id);
      if (existing) return;

      const nowStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const newRecord: JobApplication = {
        id: `app-saved-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salaryRange: job.salaryRange,
        url: job.url || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company + " careers")}`,
        status: "saved",
        appliedAt: "Not yet applied",
        updatedAt: nowStr,
        matchScore: job.matchScore,
        source: job.source || "ElevateAI Verified Market",
        notes: "Saved to review and apply with tailored resume.",
        recruiterResponse: "Not yet applied.",
      };

      saveToStorage([newRecord, ...applications]);
    },
    [applications, saveToStorage]
  );

  // Update application details (status, notes, recruiter response)
  const updateApplication = useCallback(
    (
      id: string,
      updates: Partial<Pick<JobApplication, "status" | "notes" | "recruiterResponse" | "nextStep" | "interviewDate">>
    ) => {
      const nowStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      const updated = applications.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            ...updates,
            updatedAt: nowStr,
          };
        }
        return a;
      });

      saveToStorage(updated);
    },
    [applications, saveToStorage]
  );

  // Remove tracked job
  const removeApplication = useCallback(
    (id: string) => {
      const updated = applications.filter((a) => a.id !== id);
      saveToStorage(updated);
    },
    [applications, saveToStorage]
  );

  // Helpers
  const isEnrolled = useCallback(
    (jobId: string): boolean => {
      const app = applications.find((a) => a.jobId === jobId);
      return app?.status === "applied" || app?.status === "interviewing" || app?.status === "under_review" || app?.status === "offer_received";
    },
    [applications]
  );

  const isSaved = useCallback(
    (jobId: string): boolean => {
      const app = applications.find((a) => a.jobId === jobId);
      return app?.status === "saved";
    },
    [applications]
  );

  const getApplication = useCallback(
    (jobId: string): JobApplication | undefined => {
      return applications.find((a) => a.jobId === jobId);
    },
    [applications]
  );

  // Ingestion: Bulk add from Greenhouse / Composio sync
  const bulkIngestGreenhouseApplications = useCallback(
    (newApps: Partial<JobApplication>[]) => {
      const merged = [...applications];
      newApps.forEach((item) => {
        if (!item.jobTitle || !item.company) return;
        const exists = merged.find(
          (m) => m.jobTitle.toLowerCase() === item.jobTitle?.toLowerCase() && m.company.toLowerCase() === item.company?.toLowerCase()
        );
        if (!exists) {
          merged.unshift({
            id: `gh-sync-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            jobId: item.jobId || `gh-${Date.now()}`,
            jobTitle: item.jobTitle,
            company: item.company,
            location: item.location || "Remote",
            salaryRange: item.salaryRange || "$140k–$180k",
            url: item.url || "https://boards.greenhouse.io",
            status: item.status || "applied",
            appliedAt: "Synced from Greenhouse",
            updatedAt: "Just now",
            matchScore: item.matchScore || 92,
            source: item.source || "Greenhouse ATS via Composio",
            notes: item.notes || "Synced automatically from your connected Greenhouse account.",
            recruiterResponse: item.recruiterResponse || "Active in Greenhouse candidate pipeline.",
          });
        }
      });
      saveToStorage(merged);
    },
    [applications, saveToStorage]
  );

  return {
    applications,
    isLoaded,
    enrollAndApply,
    saveJob,
    updateApplication,
    removeApplication,
    isEnrolled,
    isSaved,
    getApplication,
    bulkIngestGreenhouseApplications,
  };
}
