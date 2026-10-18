import { NextRequest, NextResponse } from "next/server";
import { getLiveMatchedJobs } from "@/lib/liveJobsService";
import { SAMPLE_RESUMES } from "@/data/mockResumes";
import { ResumeProfile } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: ResumeProfile = body.profile || SAMPLE_RESUMES.alex_data_analyst;
    const location: string = body.location || "Bengaluru";

    const jobs = await getLiveMatchedJobs(profile, location);

    return NextResponse.json({
      success: true,
      count: jobs.length,
      location,
      jobs,
      sources: ["LinkedIn Live (Bengaluru & Karnataka)", "Jobicy Remote API", "Greenhouse Public ATS"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live job feeds", success: false },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "Bengaluru";
    const isCron = searchParams.get("cron") === "true";

    if (isCron) {
      console.log(`[Hourly Cron Automation] Active: Ingested live jobs for ${location} at ${new Date().toISOString()}`);
    }

    const jobs = await getLiveMatchedJobs(SAMPLE_RESUMES.alex_data_analyst, location);
    return NextResponse.json({
      success: true,
      count: jobs.length,
      location,
      jobs,
      cronExecuted: isCron,
      sources: ["LinkedIn Live (Bengaluru & Karnataka)", "Jobicy Remote API", "Greenhouse Public Boards"],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
