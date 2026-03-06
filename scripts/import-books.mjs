import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "fs";

const CONVEX_URL = "https://knowing-spaniel-153.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

const raw = JSON.parse(fs.readFileSync("Library Books/parsed_books.json", "utf-8"));

// Map parsed data to Convex schema
const books = raw.map((b) => {
  const authors = b.author
    ? [b.author.trim()]
    : ["Unknown"];

  // Extract just the publisher name (remove city prefix)
  let publisher = b.publisher || "";
  if (publisher.includes(":")) {
    publisher = publisher.split(":").slice(1).join(":").trim();
  }

  // Generate keywords from title + college
  const titleWords = b.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const keywords = [...new Set(titleWords)];

  return {
    title: b.title.trim(),
    authors,
    publisher: publisher || undefined,
    publicationYear: b.year || undefined,
    subject: [b.college],
    keywords,
    language: "English",
    format: "Paperback",
    availability: "available",
  };
});

// Deduplicate by title (case-insensitive)
const seen = new Set();
const uniqueBooks = books.filter((b) => {
  const key = b.title.toLowerCase().trim();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`Total parsed: ${raw.length}`);
console.log(`After dedup: ${uniqueBooks.length}`);

// Import in batches of 50 (Convex mutation size limit)
const BATCH_SIZE = 50;
let imported = 0;

for (let i = 0; i < uniqueBooks.length; i += BATCH_SIZE) {
  const batch = uniqueBooks.slice(i, i + BATCH_SIZE);
  try {
    const result = await client.mutation(api.books.bulkImport, { books: batch });
    imported += batch.length;
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result} (total: ${imported})`);
  } catch (err) {
    console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, err.message);
    // Try one by one for failed batch
    for (const book of batch) {
      try {
        await client.mutation(api.books.bulkImport, { books: [book] });
        imported++;
      } catch (e) {
        console.error(`  Failed: "${book.title}" - ${e.message}`);
      }
    }
  }
}

console.log(`\nDone! Imported ${imported} books into Convex.`);
