import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const client = new ConvexHttpClient("https://knowing-spaniel-153.convex.cloud");

const STOP = new Set(["what","which","where","when","who","how","that","this","books","book","available","find","search","looking","show","list","give","tell","know","want","need","please","help","like","any","are","the","for","can","you","library","catalog","have","has","there","their","they","them","some","your","more","most","does","doing","about"]);

function extract(q) {
  const words = q.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/)
    .filter(w => w.length > 2 && !STOP.has(w));
  return words.join(" ") || q;
}

async function test(q) {
  const sq = extract(q);
  const r = await client.query(api.books.search, { query: sq, limit: 10 });
  console.log(`[${q}] -> "${sq}" -> ${r.length} results`);
  r.slice(0, 3).forEach(b => console.log(`   ${b.title} (${b.availability})`));
  console.log("");
}

await test("do you have nursing books?");
await test("psychology");
await test("ano ang mga libro para sa education?");
await test("calculus textbook");
await test("business and accountancy books");
await test("what books are available for engineering?");
await test("computer science books");
