import { NextRequest, NextResponse } from "next/server";
import { getLiveMatchedJobs } from "@/lib/liveJobsService";
import { SAMPLE_RESUMES } from "@/data/mockResumes";
import { ResumeProfile } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: ResumeProfile = body.profile || SAMPLE_RESUMES.alex_data_analyst;

    const jobs = await getLiveMatchedJobs(profile);

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
      sources: ["Jobicy Remote API", "Greenhouse (Figma, Discord, Datadog, GitLab)", "Verified Tech Market"],
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

export async function GET() {
  try {
    const jobs = await getLiveMatchedJobs(SAMPLE_RESUMES.alex_data_analyst);
    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
      sources: ["Jobicy Remote API", "Greenhouse Public Boards", "Verified Tech Market"],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
