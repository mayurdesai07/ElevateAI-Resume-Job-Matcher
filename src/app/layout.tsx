import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElevateAI — Intelligent Resume Job Matcher & Skill-Gap Unlock",
  description:
    "Find jobs fitted to your resume, discover the exact single skill holding you back from a 35%+ salary boost, explore step-by-step career blueprints, and get guided by an autonomous AI Career Coach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
