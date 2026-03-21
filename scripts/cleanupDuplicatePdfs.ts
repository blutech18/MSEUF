import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set in .env.local");
}

async function cleanupDuplicatePdfs() {
  console.log("🧹 Cleaning up duplicate PDF books...\n");

  const client = new ConvexHttpClient(CONVEX_URL!);

  try {
    // Get all books
    const allBooks = await client.query(api.books.list, { limit: 1000 });
    
    console.log(`📚 Found ${allBooks.length} total books`);
    
    // Find books with driveFileId (these are PDFs from Google Drive)
    const pdfBooks = allBooks.filter((b: any) => b.driveFileId);
    
    console.log(`📄 Found ${pdfBooks.length} PDF books from Google Drive`);
    
    if (pdfBooks.length === 0) {
      console.log("✅ No PDF books to clean up");
      return;
    }
    
    // Delete all PDF books
    console.log(`\n🗑️  Deleting ${pdfBooks.length} PDF books...`);
    
    for (let i = 0; i < pdfBooks.length; i++) {
      const book = pdfBooks[i];
      await client.mutation(api.books.remove, { id: book._id });
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Deleted ${i + 1}/${pdfBooks.length}...`);
      }
    }
    
    console.log(`\n✅ Deleted ${pdfBooks.length} PDF books`);
    console.log(`📊 Remaining books: ${allBooks.length - pdfBooks.length}`);
    
  } catch (error) {
    console.error("\n❌ Error cleaning up:", error);
    throw error;
  }
}

cleanupDuplicatePdfs()
  .then(() => {
    console.log("\n✅ Cleanup completed successfully");
    console.log("💡 Now run: npm run sync:pdfs");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Cleanup failed:", error);
    process.exit(1);
  });
