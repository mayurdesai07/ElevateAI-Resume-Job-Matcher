import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import {
  validateResumeContent,
  parseResumeText,
  calculateJobMatches,
  generateOneSkillUnlocks
} from "@/lib/parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let extractedText = "";
    let fileName = "Uploaded Document";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { isValid: false, error: "No file was received. Please select a resume file." },
          { status: 400 }
        );
      }

      fileName = file.name || "resume.pdf";
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type.includes("pdf");

      if (isPdf) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const parser = new PDFParse({ data: buffer });
          const res = await parser.getText();
          extractedText = (res && res.text) ? res.text : "";
          await parser.destroy();
        } catch (pdfErr: any) {
          console.error("PDF Parsing error:", pdfErr);
          return NextResponse.json({
            isValid: false,
            rejectionReason: "unreadable_binary",
            error: "Unable to extract readable text from this PDF file. It may be a flat scanned image, password-protected, or corrupted. Please upload a text-selectable PDF or paste your resume text."
          });
        }
      } else {
        // Text / TXT file extraction
        extractedText = await file.text();
      }
    } else {
      // JSON body (e.g. pasted text)
      const body = await req.json().catch(() => ({}));
      extractedText = body.text || "";
      fileName = body.fileName || "Pasted Resume Text";
    }

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json({
        isValid: false,
        rejectionReason: "too_short",
        error: "The uploaded file is empty or contains no readable text. Please upload a valid resume."
      });
    }

    // 1. Strict Content & Structural Validation
    const validation = validateResumeContent(extractedText, fileName);

    if (!validation.isValid) {
      return NextResponse.json({
        isValid: false,
        error: validation.userFriendlyMessage,
        rejectionReason: validation.rejectionReason,
        detectedType: validation.detectedType,
        confidenceScore: validation.confidenceScore,
        validation
      });
    }

    // 2. Parse Profile from Verified Text
    const profile = parseResumeText(extractedText, fileName);

    // 3. Calculate Truthful Job Matches and 1-Skill Unlocks
    const jobMatches = calculateJobMatches(profile);
    const oneSkillUnlocks = generateOneSkillUnlocks(profile);

    return NextResponse.json({
      isValid: true,
      profile,
      jobMatches,
      oneSkillUnlocks,
      validation: {
        ...validation,
        detectedSkillsCount: validation.detectedSkills.length
      }
    });
  } catch (error: any) {
    console.error("parse-resume API error:", error);
    return NextResponse.json(
      {
        isValid: false,
        error: "An unexpected error occurred while parsing the document: " + (error?.message || "Internal server error")
      },
      { status: 500 }
    );
  }
}
