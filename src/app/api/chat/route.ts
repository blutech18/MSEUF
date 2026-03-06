import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are ROSe (Reference Online Services), the official AI library assistant of MSEUF University Libraries at Manuel S. Enverga University Foundation, Lucena City, Quezon Province, Philippines.

YOUR IDENTITY:
- You are ROSe, a knowledgeable, friendly, and professional virtual librarian.
- You ONLY answer questions related to the MSEUF University Libraries, its services, collections, books, digital resources, and academic support.
- For questions outside your scope, politely redirect: "That's outside my area, but I'm here to help with anything about the MSEUF University Libraries!"

LIBRARY FACTS:
- Hours: Monday–Friday 7:00 AM – 7:00 PM, Saturday 8:00 AM – 5:00 PM, Closed on Sundays and holidays
- Location: MSEUF Campus, Lucena City, Quezon Province
- Established: 2001 — largest academic library in the Southern Tagalog Region
- Contact: library@mseuf.edu.ph | (042) 373-7371
- OPAC System: Follett Destiny (https://envergalibrary.com/follett)

LIBRARY SECTIONS:
1. Circulation and Reserve Section (Ground Floor) — book lending, returns, reserves, Dewey Decimal Classification
2. Reference and Filipiniana Section (1st Floor) — reference materials (in-library use only), Filipiniana collection, theses and dissertations
3. Institute of Graduate Studies and Research Library (IGSRL) — graduate-level materials, research papers, academic journals
4. Periodicals Section (2nd Floor) — newspapers, journals, magazines
5. Library User Information System Section (LUISS) — computer stations, internet access, digital catalog
6. Educational Media Resource Center (EMRC) — function rooms:
   - Room 1: 30 persons
   - Room 2: 50 persons
   - Room 3: 30 persons
   - Little Theater: 100+ persons
7. Creation Center — printing, 3D printing, binding, creative workspace

DIGITAL RESOURCES & ACADEMIC DATABASES:
- ProQuest — academic journals, dissertations (https://www.proquest.com)
- EBSCO — multidisciplinary research (http://search.ebscohost.com)
- IG Library — e-books (http://portal.igpublish.com)
- Philippine E-Journal — local research publications (https://ejournals.ph)
- On-campus access; contact library@mseuf.edu.ph for off-campus credentials

MSEUF COLLEGES (for book subject mapping):
- CAS = College of Arts and Sciences
- CBA = College of Business and Accountancy
- CED = College of Education
- CENG = College of Engineering
- GE = General Education
The library has newly purchased books (2024-2025) for all these colleges.

ONLINE FORMS:
- Library Appointment: /forms/appointment
- Library Account Registration: /forms/registration
- Online Book Renewal: /forms/book-renewal
- Customer Satisfaction Survey: /forms/satisfaction-survey

RESPONSE RULES — FOLLOW STRICTLY:
1. When BOOKS DATA is provided below, you MUST list them specifically. Use this format for each book:
   📖 **[Title]** by [Author] — [Publisher], [Year] — Status: [Available/Unavailable]
2. Count your results: "I found X books related to [topic]:" then list them.
3. NEVER fabricate book titles, authors, publishers, call numbers, or statuses. ONLY cite data actually provided below.
4. If BOOKS DATA shows 0 results, say: "I didn't find books matching that query in our catalog. You can try different keywords, or visit the library for assistance."
5. If a user asks about a college (e.g. "engineering books"), list ALL books from that college's data.
6. If a user asks about a specific topic (e.g. "calculus"), list books whose titles match that topic.
7. For greetings (hi, hello, kumusta), respond warmly and offer to help — do NOT search for books.
8. For service questions (hours, forms, databases), answer from the LIBRARY FACTS above — do NOT search for books.
9. Respond in Filipino if the user writes in Filipino/Tagalog. Otherwise use English.
10. Keep responses well-structured using bullet points or numbered lists for clarity.
11. If more than 10 books match, list the first 10 and say "and X more — ask me to show more or narrow your search."
12. Always end with a helpful follow-up: "Would you like to know more about any of these books?" or similar.`;

// ─── COLLEGE & TOPIC SYNONYMS ────────────────────────────────────────────────

const COLLEGE_SYNONYMS: Record<string, string[]> = {
  "College of Engineering": [
    "engineering", "ceng", "mechanical", "electrical", "civil", "industrial",
    "electronics", "computer engineering", "ece", "me", "ce", "ie",
    "thermodynamics", "circuits", "surveying", "structural",
  ],
  "College of Arts and Sciences": [
    "arts and sciences", "cas", "psychology", "sociology", "philosophy",
    "linguistics", "communication", "journalism", "literature", "political",
    "language", "english", "mass communication", "broadcast", "film",
  ],
  "College of Business and Accountancy": [
    "business", "accountancy", "cba", "accounting", "management", "marketing",
    "finance", "economics", "entrepreneurship", "commerce", "bsa", "bsba",
  ],
  "College of Education": [
    "education", "ced", "teaching", "pedagogy", "curriculum", "educational",
    "teacher", "classroom", "instruction", "learning", "beed", "bsed",
  ],
  "General Education": [
    "general education", "ge", "rizal", "philippine history", "math",
    "mathematics", "science", "ethics", "understanding the self", "purposive",
  ],
};

// Filipino-to-English topic mapping
const FILIPINO_TERMS: Record<string, string> = {
  "libro": "book", "mga libro": "books", "aklat": "book",
  "inhinyero": "engineering", "inhinyeriya": "engineering",
  "edukasyon": "education", "pagtuturo": "teaching",
  "negosyo": "business", "agham": "science",
  "kasaysayan": "history", "matematika": "mathematics",
  "sikolohiya": "psychology", "pilosopiya": "philosophy",
  "nars": "nursing", "batas": "law",
  "makina": "mechanical", "elektrikal": "electrical",
  "sining": "arts", "wika": "language",
  "kompyuter": "computer", "programa": "programming",
};

// ─── STOP WORDS ──────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  // English
  "what", "which", "where", "when", "who", "how", "that", "this",
  "there", "their", "they", "them", "then", "than", "these", "those",
  "have", "has", "had", "been", "being", "were", "will", "would",
  "could", "should", "shall", "with", "from", "into", "about",
  "some", "such", "very", "just", "also", "does", "doing",
  "your", "more", "most", "other", "only", "each", "every",
  "books", "book", "available", "find", "search", "looking",
  "show", "list", "give", "tell", "know", "want", "need",
  "please", "help", "like", "any", "are", "the", "for",
  "can", "you", "library", "catalog", "related",
  // Filipino
  "ang", "mga", "para", "sa", "ng", "naman", "po", "opo",
  "ano", "saan", "paano", "may", "meron", "ba", "na",
  "ko", "mo", "niya", "nila", "ito", "iyan", "iyon",
]);

// ─── INTENT DETECTION ────────────────────────────────────────────────────────

type Intent = "book_search" | "service_info" | "greeting" | "general";

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  // Greetings
  if (/^(hi|hello|hey|kumusta|magandang|mabuhay|good morning|good afternoon|good evening)\b/.test(lower)) {
    return "greeting";
  }

  // Service/info questions
  const serviceKeywords = [
    "hours", "oras", "open", "bukas", "close", "sara",
    "form", "appointment", "register", "registration", "renew", "renewal",
    "database", "ebsco", "proquest", "ejournal", "iglib",
    "emrc", "function room", "creation center", "luiss",
    "contact", "email", "phone", "number",
    "follett", "destiny", "opac",
    "filipiniana", "reference section", "periodical",
    "how to", "paano",
  ];
  if (serviceKeywords.some((kw) => lower.includes(kw))) {
    return "service_info";
  }

  // Default: book search
  return "book_search";
}

// ─── SEARCH TERM EXTRACTION ─────────────────────────────────────────────────

function extractSearchTerms(message: string, history: Message[] = []): string {
  let text = message;

  // Translate Filipino terms to English
  for (const [fil, eng] of Object.entries(FILIPINO_TERMS)) {
    text = text.replace(new RegExp(`\\b${fil}\\b`, "gi"), eng);
  }

  // Check if message references "more" / "iba pa" / "others" — pull topic from history
  if (/\b(more|iba pa|others|other|next|dagdag|show more)\b/i.test(message)) {
    const lastUserMsg = [...history].reverse().find(
      (m) => m.role === "user" && m.content !== message
    );
    if (lastUserMsg) {
      text = lastUserMsg.content + " " + text;
    }
  }

  // Strip punctuation and stop words
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  // Check for college synonyms — if a word maps to a college, add the college name
  const detectedCollege = detectCollege(words);

  if (detectedCollege) {
    // Use just the core terms for Convex full-text search
    return words.join(" ") || message;
  }

  return words.join(" ") || message;
}

function detectCollege(words: string[]): string | null {
  const combined = words.join(" ");
  for (const [college, synonyms] of Object.entries(COLLEGE_SYNONYMS)) {
    if (synonyms.some((s) => combined.includes(s))) {
      return college;
    }
  }
  return null;
}

// ─── CONTEXT BUILDING ────────────────────────────────────────────────────────

function buildLiveContext(
  books: Array<Record<string, unknown>>,
  faqs: Array<Record<string, unknown>>,
  message: string,
  intent: Intent,
  bookCount: number
): string {
  const parts: string[] = [];

  if (intent === "greeting") {
    parts.push("\n\n[CONTEXT: User is greeting you. Respond warmly. No book data needed.]");
    return parts.join("\n");
  }

  if (intent === "service_info") {
    parts.push("\n\n[CONTEXT: User is asking about library services/info. Answer from your knowledge above.]");
  }

  // Always include book data if available
  if (books.length > 0) {
    parts.push(`\n\nBOOKS DATA — ${bookCount} total results from the MSEUF catalog (showing ${Math.min(books.length, 15)}):`);
    books.slice(0, 15).forEach((b, i) => {
      const authors = (b.authors as string[])?.join(", ") || "Unknown";
      const subject = ((b.subject as string[]) || []).join(", ");
      const publisher = b.publisher || "N/A";
      const year = b.publicationYear || "N/A";
      const callNum = b.callNumber ? `Call #: ${b.callNumber}` : "";
      const location = b.shelfLocation || "";
      const status = b.availability || "unknown";
      parts.push(
        `${i + 1}. "${b.title}" by ${authors} | ${subject} | ${publisher}, ${year} | ${callNum} ${location} | Status: ${status}`.trim()
      );
    });
    if (bookCount > 15) {
      parts.push(`(${bookCount - 15} more books available — user can ask to see more)`);
    }
  } else if (intent === "book_search") {
    parts.push("\n\nBOOKS DATA — 0 results found in the catalog for this query.");
  }

  // FAQs
  if (faqs.length > 0) {
    const lowerMsg = message.toLowerCase();
    const matchedFaqs = faqs.filter((f) => {
      const q = (f.question as string).toLowerCase();
      const qWords = q.replace(/[^a-z\s]/g, "").split(" ").filter((w) => w.length > 3);
      return qWords.filter((w) => lowerMsg.includes(w)).length >= 2;
    });
    if (matchedFaqs.length > 0) {
      parts.push("\nRELEVANT FAQs:");
      matchedFaqs.slice(0, 3).forEach((f) => {
        parts.push(`Q: ${f.question}\nA: ${f.answer}`);
      });
    }
  }

  return parts.join("\n");
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const historyArr: Message[] = (history as Message[]) || [];

    // 1. Detect intent
    const intent = detectIntent(message);

    // 2. Extract search terms
    const searchQuery = extractSearchTerms(message, historyArr);

    // 3. Fetch live data from Convex
    let books: Array<Record<string, unknown>> = [];
    let faqs: Array<Record<string, unknown>> = [];
    let totalBookCount = 0;

    if (intent === "book_search" || intent === "general") {
      try {
        [books, faqs] = await Promise.all([
          convexClient.query(api.books.search, { query: searchQuery, limit: 20 }) as Promise<Array<Record<string, unknown>>>,
          convexClient.query(api.faqs.list, { activeOnly: true }) as Promise<Array<Record<string, unknown>>>,
        ]);
        totalBookCount = books.length;
      } catch {
        // Non-critical
      }
    } else if (intent === "service_info") {
      try {
        faqs = await convexClient.query(api.faqs.list, { activeOnly: true }) as Array<Record<string, unknown>>;
      } catch {
        // Non-critical
      }
    }

    // 4. Build context for Gemini
    const liveContext = buildLiveContext(books, faqs, message, intent, totalBookCount);

    // 5. Build Gemini chat history
    const recentHistory = historyArr.slice(-10);
    const geminiHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    let foundFirstUser = false;
    for (const m of recentHistory) {
      const role = m.role === "assistant" ? "model" : "user";
      if (!foundFirstUser && role !== "user") continue;
      foundFirstUser = true;
      geminiHistory.push({ role, parts: [{ text: m.content }] });
    }

    // 6. Call Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT + liveContext,
      generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
    });

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);

    const responseText =
      result.response.text()?.trim() ||
      "I'm sorry, I couldn't generate a response. Please try again or contact library@mseuf.edu.ph.";

    // 7. Return response with book metadata for UI cards
    const metadata =
      books.length > 0 ? { books: books.slice(0, 5) } : undefined;

    // 8. Log query
    try {
      await convexClient.mutation(api.queryLogs.log, {
        query: message,
        sessionId: "web-session",
        resultsCount: totalBookCount,
        responseTime: 0,
        source: "chatbot",
      });
    } catch {
      // Ignore
    }

    return NextResponse.json({ response: responseText, metadata });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ROSe API Error]", msg);
    const isNoKey = msg.includes("API key") || msg.includes("GEMINI_API_KEY");
    return NextResponse.json(
      {
        response: isNoKey
          ? "The AI assistant is not configured yet. Please set the GEMINI_API_KEY environment variable."
          : "I'm sorry, I encountered an error. Please try again or contact library@mseuf.edu.ph for assistance.",
      },
      { status: 500 }
    );
  }
}

