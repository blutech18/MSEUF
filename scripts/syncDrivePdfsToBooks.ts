import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { GoogleDriveService } from "../lib/googleDrive";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const GOOGLE_DRIVE_CREDENTIALS = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
}

if (!GOOGLE_DRIVE_CREDENTIALS) {
  throw new Error("GOOGLE_DRIVE_SERVICE_ACCOUNT is not set in .env.local");
}

if (!GOOGLE_DRIVE_FOLDER_ID) {
  throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set in .env.local");
}

async function syncDrivePdfsToBooks() {
  console.log("🚀 Starting Google Drive PDF sync to books table...\n");

  const client = new ConvexHttpClient(CONVEX_URL!);
  const driveService = new GoogleDriveService(GOOGLE_DRIVE_CREDENTIALS!);

  try {
    console.log(`📁 Fetching PDFs from Google Drive folder: ${GOOGLE_DRIVE_FOLDER_ID}`);
    const files = await driveService.listFilesInFolder(GOOGLE_DRIVE_FOLDER_ID!);
    
    console.log(`✅ Found ${files.length} PDF files\n`);

    if (files.length === 0) {
      console.log("⚠️  No PDF files found in the folder");
      return;
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;

    console.log("📚 Processing PDFs one by one...\n");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = `[${i + 1}/${files.length}]`;
      
      console.log(`${progress} Processing: ${file.name}`);

      try {
        const fileName = file.name;
        const cleanTitle = fileName.replace(/\.pdf$/i, "");
        
        const metadata = extractMetadataFromFilename(fileName);
        
        // Check if book already exists by searching all books
        const allBooks = await client.query(api.books.list, { limit: 1000 });
        const existingBook = allBooks.find((b: any) => b.driveFileId === file.id);

        const bookData = {
          title: metadata.title || cleanTitle,
          authors: metadata.authors || ["Unknown"],
          subject: metadata.subject,
          keywords: metadata.keywords,
          publisher: metadata.publisher,
          publicationYear: metadata.year,
          format: "PDF",
          availability: "available",
          driveFileId: file.id,
          driveFileName: file.name,
          pdfViewLink: file.webViewLink,
          pdfDownloadLink: file.webContentLink,
          pdfThumbnail: file.thumbnailLink,
          fileSize: parseInt(file.size || "0"),
          digitalAccessLink: file.webViewLink,
        };

        if (existingBook) {
          await client.mutation(api.books.update, {
            id: existingBook._id,
            ...bookData,
          });
          console.log(`   ✓ Updated existing book`);
          updated++;
        } else {
          await client.mutation(api.books.create, {
            ...bookData,
            totalCopies: 1,
            availableCopies: 1,
          });
          console.log(`   ✓ Created new book`);
          created++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        console.log(`   ✗ Error: ${error.message}`);
        skipped++;
      }
    }

    console.log("\n✨ Sync completed!");
    console.log(`   📊 Created: ${created}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   📚 Total: ${files.length}`);
    
    const totalSize = files.reduce((sum, f) => sum + parseInt(f.size || "0"), 0);
    console.log(`   💾 Total size: ${formatBytes(totalSize)}`);

  } catch (error) {
    console.error("\n❌ Error syncing PDFs:", error);
    throw error;
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
    metadata.authors = authorString.split(/\s+and\s+|,\s+/).map(a => a.trim());
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
    "engineering": "Engineering",
    "science": "Science",
    "mathematics": "Mathematics",
    "math": "Mathematics",
    "physics": "Physics",
    "chemistry": "Chemistry",
    "biology": "Biology",
    "literature": "Literature",
    "history": "History",
    "business": "Business",
    "management": "Management",
    "education": "Education",
    "technology": "Technology",
    "computer": "Computer Science",
    "programming": "Programming",
    "arts": "Arts",
    "law": "Law",
    "medicine": "Medicine",
    "health": "Health",
    "economics": "Economics",
    "psychology": "Psychology",
    "philosophy": "Philosophy",
    "sociology": "Sociology",
    "accounting": "Accounting",
    "marketing": "Marketing",
    "finance": "Finance",
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

syncDrivePdfsToBooks()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
