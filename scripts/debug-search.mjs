import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const client = new ConvexHttpClient("https://knowing-spaniel-153.convex.cloud");

const STOP_WORDS = new Set([
  "what", "which", "where", "when", "who", "how", "that", "this",
  "there", "their", "they", "them", "then", "than", "these", "those",
  "have", "has", "had", "been", "being", "were", "will", "would",
  "could", "should", "shall", "with", "from", "into", "about",
  "some", "such", "very", "just", "also", "does", "doing",
  "your", "more", "most", "other", "only", "each", "every",
  "books", "book", "available", "find", "search", "looking",
  "show", "list", "give", "tell", "know", "want", "need",
  "please", "help", "like", "any", "are", "the", "for",
  "can", "you", "library", "catalog",
]);

function extractSearchTerms(msg) {
  const words = msg.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return words.join(" ") || msg;
}

const message = "what books are available for engineering?";
const searchQuery = extractSearchTerms(message);
console.log("Original:", message);
console.log("Search query:", searchQuery);

const books = await client.query(api.books.search, { query: searchQuery, limit: 20 });
console.log("\nConvex returned:", books.length, "books");
books.forEach((b, i) => console.log(`  ${i+1}. ${b.title} | ${b.subject} | ${b.availability}`));

const lower = message.toLowerCase();
const words = lower.split(/\s+/).filter((w) => w.length > 3);
console.log("\nFilter words:", words);

const matched = books.filter((b) => {
  const title = b.title.toLowerCase();
  const keywords = (b.keywords || []).map((k) => k.toLowerCase());
  const subjects = (b.subject || []).map((s) => s.toLowerCase());
  const authors = (b.authors || []).map((a) => a.toLowerCase());
  return words.some(
    (w) =>
      title.includes(w) ||
      keywords.some((k) => k.includes(w)) ||
      subjects.some((s) => s.includes(w)) ||
      authors.some((a) => a.includes(w))
  );
});

console.log("\nMatched after filter:", matched.length);
matched.forEach((b) =>
  console.log("  -", b.title, "| Status:", b.availability)
);

if (matched.length > 0) {
  console.log("\nContext sent to Gemini:");
  matched.slice(0, 5).forEach((b) => {
    const line =
      `- "${b.title}" by ${b.authors.join(", ")}` +
      ` | Status: ${b.availability}`;
    console.log(line);
  });
}
