import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory sliding window rate limiter for edge requests
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE_API = 45; // Maximum API calls per IP per minute

// Blocked malicious bot signatures & vulnerability scanners
const MALICIOUS_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "acunetix",
  "nmap",
  "masscan",
  "wpscan",
  "gobuster",
  "dirbuster",
  "nessus",
  "metasploit",
  "burpcollaborator",
  "havij",
  "zgrab",
  "morfeus",
];

// Suspicious URL & query attack patterns (SQLi, Directory Traversal, XSS)
const INJECTION_PATTERNS = [
  /(\bunion\b[\s\S]+\bselect\b)/i,
  /(<script[\s\S]*?>)/i,
  /(javascript\s*:)/i,
  /((\.\.[\/\\])+)/,
  /(etc[\/\\]passwd)/i,
  /(\b(sleep|benchmark)\s*\(\s*\d+\s*\))/i,
  /(['"]\s*or\s*['"]?1['"]?\s*=\s*['"]?1)/i,
];

export function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
  const path = req.nextUrl.pathname;
  const search = req.nextUrl.search;

  // 1. Block Malicious Vulnerability Scanners & Exploit Tools
  const isMaliciousBot = MALICIOUS_USER_AGENTS.some((bot) => userAgent.includes(bot));
  if (isMaliciousBot) {
    console.warn(`[WAF SHIELD] Blocked exploit bot from ${ip}: ${userAgent}`);
    return new NextResponse(
      JSON.stringify({
        error: "Access Denied by ElevateAI Edge Security Firewall",
        reason: "Malicious scanner signature identified",
        status: 403,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json", "X-Firewall-Status": "BLOCKED" },
      }
    );
  }

  // 2. Deep Payload Inspection for SQL Injection & XSS in URL/Query
  const rawUrl = path + search;
  let decodedUrl = rawUrl;
  try {
    decodedUrl = decodeURIComponent(rawUrl);
  } catch {
    // Malformed URI encoding is an exploit technique
    console.warn(`[WAF SHIELD] Blocked malformed URI from ${ip}: ${rawUrl}`);
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden: Malformed URL encoding intercepted by Edge Firewall",
        status: 403,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json", "X-Firewall-Status": "INTERCEPTED" },
      }
    );
  }

  const isInjectionAttack =
    INJECTION_PATTERNS.some((pattern) => pattern.test(rawUrl)) ||
    INJECTION_PATTERNS.some((pattern) => pattern.test(decodedUrl));

  if (isInjectionAttack) {
    console.warn(`[WAF SHIELD] Blocked injection attempt from ${ip}: ${decodedUrl}`);
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden: Malicious payload intercepted by Edge Firewall",
        status: 403,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json", "X-Firewall-Status": "INTERCEPTED" },
      }
    );
  }

  // 3. API Rate Limiting & DoS Mitigation (/api/*)
  if (path.startsWith("/api/")) {
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (clientRecord && now < clientRecord.resetTime) {
      clientRecord.count += 1;
      if (clientRecord.count > MAX_REQUESTS_PER_MINUTE_API) {
        console.warn(`[WAF SHIELD] Rate limit exceeded for IP: ${ip} on ${path}`);
        return new NextResponse(
          JSON.stringify({
            error: "Too Many Requests: Rate limit exceeded to prevent DoS attacks.",
            retryAfterSeconds: Math.ceil((clientRecord.resetTime - now) / 1000),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
              "X-Firewall-RateLimit": "EXCEEDED",
            },
          }
        );
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }
  }

  // 4. Inject High-Security Armor Headers into all responses
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Elevate-Firewall", "Active-Enforcing");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, favicon, and next internal files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
