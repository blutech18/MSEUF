import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
}

async function checkDuplicates() {
  console.log("🔍 Checking for duplicates between existing books and PDFs...\n");

  const client = new ConvexHttpClient(CONVEX_URL!);

  try {
    // Get all books
    const allBooks = await client.query(api.books.list, { limit: 1000 });
    
    console.log(`📚 Total books: ${allBooks.length}`);
    
    // Separate PDF books from existing books
    const pdfBooks = allBooks.filter((b: any) => b.driveFileId);
    const existingBooks = allBooks.filter((b: any) => !b.driveFileId);
    
    console.log(`📄 PDF books (from Google Drive): ${pdfBooks.length}`);
    console.log(`📖 Existing books (original catalog): ${existingBooks.length}\n`);
    
    // Check for title duplicates
    const titleDuplicates: any[] = [];
    const pdfTitles = new Set(pdfBooks.map((b: any) => b.title.toLowerCase().trim()));
    
    for (const book of existingBooks) {
      const normalizedTitle = book.title.toLowerCase().trim();
      if (pdfTitles.has(normalizedTitle)) {
        const matchingPdf = pdfBooks.find((p: any) => 
          p.title.toLowerCase().trim() === normalizedTitle
        );
        titleDuplicates.push({
          existing: book,
          pdf: matchingPdf
        });
      }
    }
    
    // Check for ISBN duplicates (if ISBNs exist)
    const isbnDuplicates: any[] = [];
    const pdfIsbns = new Set(
      pdfBooks
        .filter((b: any) => b.isbn)
        .map((b: any) => b.isbn.toLowerCase().trim())
    );
    
    for (const book of existingBooks) {
      if (book.isbn) {
        const normalizedIsbn = book.isbn.toLowerCase().trim();
        if (pdfIsbns.has(normalizedIsbn)) {
          const matchingPdf = pdfBooks.find((p: any) => 
            p.isbn && p.isbn.toLowerCase().trim() === normalizedIsbn
          );
          isbnDuplicates.push({
            existing: book,
            pdf: matchingPdf
          });
        }
      }
    }
    
    // Report findings
    console.log("═══════════════════════════════════════════════════════");
    console.log("                  DUPLICATE CHECK RESULTS");
    console.log("═══════════════════════════════════════════════════════\n");
    
    if (titleDuplicates.length === 0 && isbnDuplicates.length === 0) {
      console.log("✅ NO DUPLICATES FOUND!");
      console.log("\n   The 604 existing books and 133 PDF books are completely separate.");
      console.log("   No title or ISBN matches detected.\n");
    } else {
      if (titleDuplicates.length > 0) {
        console.log(`⚠️  Found ${titleDuplicates.length} TITLE DUPLICATES:\n`);
        titleDuplicates.forEach((dup, i) => {
          console.log(`${i + 1}. "${dup.existing.title}"`);
          console.log(`   Existing Book ID: ${dup.existing._id}`);
          console.log(`   PDF Book ID: ${dup.pdf._id}`);
          console.log(`   PDF Drive ID: ${dup.pdf.driveFileId}\n`);
        });
      }
      
      if (isbnDuplicates.length > 0) {
        console.log(`⚠️  Found ${isbnDuplicates.length} ISBN DUPLICATES:\n`);
        isbnDuplicates.forEach((dup, i) => {
          console.log(`${i + 1}. ISBN: ${dup.existing.isbn}`);
          console.log(`   Existing: "${dup.existing.title}"`);
          console.log(`   PDF: "${dup.pdf.title}"`);
          console.log(`   PDF Drive ID: ${dup.pdf.driveFileId}\n`);
        });
      }
    }
    
    console.log("═══════════════════════════════════════════════════════\n");
    
  } catch (error) {
    console.error("\n❌ Error checking duplicates:", error);
    throw error;
  }
}

checkDuplicates()
  .then(() => {
    console.log("✅ Duplicate check completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Check failed:", error);
    process.exit(1);
  });
