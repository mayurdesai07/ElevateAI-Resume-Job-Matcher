# ElevateAI — Intelligent Resume Job Matcher & Pipeline

🚀 **Live Production Site:** [https://elevate-your-career.vercel.app](https://elevate-your-career.vercel.app)

---

## 🌟 Features

- **Automated Resume Parsing:** Instantly extracts skills, experience levels, and domain strengths from uploaded resumes.
- **Permanent Account Memory:** Sign in with email or continue as Guest. Your uploaded resume is remembered permanently across visits.
- **Live Real-Time Job Discovery:** Automatically fetches jobs from live feeds (LinkedIn Live, Jobicy, Greenhouse) customized to candidate locations (e.g., Bengaluru, Mangalore, Mysore, San Francisco, Remote).
- **1-Skill Unlocks:** Identifies the single skill that unlocks a 35%+ higher compensation tier.
- **Application & Pipeline Tracker:** Direct 1-click enrollment, application status tracking (Applied, Interviewing, Offer), and recruiter response notes.
- **Composio & Greenhouse ATS Sync:** Connect your company ATS or custom Greenhouse job board tokens.
- **Aria AI Career Coach:** Slide-out coach for tailored interview prep, salary negotiation, and cover letters.
- **Edge Security Firewall & Owner Command Center:**
  - Automated Edge WAF blocking bots, exploit scanners, and SQLi/XSS attacks.
  - Owner Lockdown Mode and manual guest passkey generator.
  - Zero-edit immutable serverless container architecture.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Lucide Icons
- **Edge Firewall:** Next.js Edge Middleware (`src/middleware.ts`)
- **Deployment:** Vercel Global Edge Network ([https://elevate-your-career.vercel.app](https://elevate-your-career.vercel.app))
