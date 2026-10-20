import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elevate-your-career.vercel.app"),
  title: "ElevateAI — NxtWave (CCBP 4.0) Intelligent Resume Job Matcher",
  description:
    "Find jobs fitted to your resume, discover the exact single skill holding you back from a 35%+ salary boost, explore step-by-step career blueprints, and get guided by an autonomous AI Career Coach.",
  openGraph: {
    title: "ElevateAI — Intelligent Resume Job Matcher",
    description: "Automated job matching, 1-skill unlocks, and AI career coaching.",
    url: "https://elevate-your-career.vercel.app",
    siteName: "ElevateAI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('elevate_theme');
                  if (storedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-surface-secondary text-ccbp-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
