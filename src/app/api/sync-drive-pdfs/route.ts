import { NextRequest, NextResponse } from "next/server";
import { GoogleDriveService, DriveFile } from "../../../../lib/googleDrive";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
    const GOOGLE_DRIVE_CREDENTIALS = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT;
    const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!CONVEX_URL || !GOOGLE_DRIVE_CREDENTIALS || !GOOGLE_DRIVE_FOLDER_ID) {
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    const client = new ConvexHttpClient(CONVEX_URL);
    const driveService = new GoogleDriveService(GOOGLE_DRIVE_CREDENTIALS);

    const files = await driveService.listFilesInFolder(GOOGLE_DRIVE_FOLDER_ID);

    const pdfsToSync = files.map((file: DriveFile) => {
      const fileName = file.name;
      const cleanTitle = fileName.replace(/\.pdf$/i, "");
      const metadata = extractMetadataFromFilename(fileName);

      return {
        driveFileId: file.id,
        driveFileName: file.name,
        title: metadata.title || cleanTitle,
        authors: metadata.authors || ["Unknown"],
        subject: metadata.subject,
        keywords: metadata.keywords,
        publisher: metadata.publisher,
        publicationYear: metadata.year,
        format: "PDF",
        availability: "available",
        pdfViewLink: file.webViewLink,
        pdfDownloadLink: file.webContentLink,
        pdfThumbnail: file.thumbnailLink,
        fileSize: parseInt(file.size || "0"),
        digitalAccessLink: file.webViewLink,
      };
    });

    const result = await client.mutation(api.books.syncNewPdfs, {
      pdfs: pdfsToSync,
    });

    return NextResponse.json({
      success: true,
      newCount: result.newCount,
      skippedCount: result.skippedCount,
      total: result.total,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sync PDFs" },
      { status: 500 }
    );
  }
}

function extractMetadataFromFilename(fileName: string): {
  title?: string;
  authors?: string[];
  subject?: string[];
  keywords?: string[];
  publisher?: string;
  year?: number;
} {
  const metadata: any = {};
  let cleanName = fileName.replace(/\.pdf$/i, "");

  const authorMatch = cleanName.match(/by\s+([^-_()\[\]]+)/i);
  if (authorMatch) {
    const authorString = authorMatch[1].trim();
    metadata.authors = authorString.split(/\s+and\s+|,\s+/).map((a) => a.trim());
    cleanName = cleanName.replace(authorMatch[0], "").trim();
  }

  const yearMatch = cleanName.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    metadata.year = parseInt(yearMatch[0]);
    cleanName = cleanName.replace(yearMatch[0], "").trim();
  }

  const publisherMatch = cleanName.match(/\(([^)]+)\)/);
  if (publisherMatch) {
    metadata.publisher = publisherMatch[1].trim();
    cleanName = cleanName.replace(publisherMatch[0], "").trim();
  }

  const subjects: string[] = [];
  const keywords: string[] = [];
  const lower = fileName.toLowerCase();

  const subjectMap: { [key: string]: string } = {
    engineering: "Engineering",
    science: "Science",
    mathematics: "Mathematics",
    math: "Mathematics",
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
    literature: "Literature",
    history: "History",
    business: "Business",
    management: "Management",
    education: "Education",
    technology: "Technology",
    computer: "Computer Science",
    programming: "Programming",
    arts: "Arts",
    law: "Law",
    medicine: "Medicine",
    health: "Health",
    economics: "Economics",
    psychology: "Psychology",
    philosophy: "Philosophy",
    sociology: "Sociology",
    accounting: "Accounting",
    marketing: "Marketing",
    finance: "Finance",
  };

  for (const [keyword, subject] of Object.entries(subjectMap)) {
    if (lower.includes(keyword)) {
      if (!subjects.includes(subject)) {
        subjects.push(subject);
      }
      keywords.push(keyword);
    }
  }

  if (subjects.length > 0) {
    metadata.subject = subjects;
  }

  if (keywords.length > 0) {
    metadata.keywords = keywords;
  }

  cleanName = cleanName.replace(/[-_()[\]]/g, " ").replace(/\s+/g, " ").trim();
  metadata.title = cleanName;

  return metadata;
}
