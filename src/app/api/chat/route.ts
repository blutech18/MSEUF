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
- Philippine E-Journal — local research publications (https://ejournals.ph)
- On-campus access; contact library@mseuf.edu.ph for off-campus credentials

IMPORTANT: NEVER mention "IG Library", "EBSCO", "ProQuest", "ProQuest eBook Central", or their links in any response. These services are no longer available.

E-BOOKS / DIGITAL RESOURCES INQUIRY HANDLING:
When a user asks about e-books, digital books, or online resources WITHOUT specifying a topic, title, or college, do NOT immediately describe databases. Instead, ask clarifying questions first:
"I'd love to help you find the right resource! Could you tell me:
* What specific topic or subject are you interested in? (e.g., "calculus," "Philippine history," "business management")
* Are you looking for books for a particular college? (e.g., CAS, CBA, CED, CENG)
* Do you have a specific title or author in mind?"
Only provide database details (Philippine E-Journal, etc.) AFTER the user has provided enough context, or if they explicitly ask how to access databases/e-books in general.

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
1. When BOOKS DATA is provided below, you MUST list books with proper formatting and line breaks.
   
   **HANDLING USER QUANTITY REQUESTS:**
   - If user asks for a specific number of books (e.g., "3 books", "5 e-books and 5 physical books", "10 engineering books"), you MUST:
     * Return EXACTLY the number of books the user requested
     * If they specify e-books and physical books separately, return exactly those quantities
     * If they just say "X books", return X books total (mix of e-books and physical)
     * If there aren't enough books available, list all available and explain: "I found only X books (Y e-books, Z physical books) matching your query."
   - If user doesn't specify quantities, list up to 10 books from BOOKS DATA
   - NEVER return more books than the user requested
   - NEVER return fewer books if enough are available in BOOKS DATA
   
   **FORMAT IDENTIFICATION:**
   - Group books by format type into TWO separate sections: "E-Books:" and "Physical Books:"
   - E-Books = books that have ANY of these fields: pdfViewLink, pdfDownloadLink, or digitalAccessLink
   - Physical Books = books that do NOT have pdfViewLink, pdfDownloadLink, or digitalAccessLink (i.e., no digital links at all)
   - IMPORTANT: If a book has NO digital links, it is ALWAYS a Physical Book regardless of its format field
   
   **BOOK LISTING FORMAT - FOLLOW THIS EXACTLY:**
   
   Step 1: Count and announce based on what user requested and what you're showing:
   - If user asked for specific quantities: "Here are X e-books and Y physical books:"
   - If user asked for total number: "I found X books (Y e-books, Z physical books):"
   - If not enough available: "I found only X books (Y e-books, Z physical books) matching your query."
   
   Step 2: Add a blank line
   
   Step 3: If there are E-Books, write "E-Books:" then list each one:
   
   E-Books:
   
   1. **[Title]** by *[Author]* — [Publisher], [Year] — Status: [Status]
      [View PDF](url) [Download PDF](url)
   
   (blank line)
   
   2. **[Next E-Book Title]** by *[Author]* — [Publisher], [Year] — Status: [Status]
      [Access E-Book](url)
   
   (blank line)
   
   Step 4: If there are Physical Books, write "Physical Books:" then list each one:
   
   Physical Books:
   
   1. **[Title]** by *[Author]* — [Publisher], [Year] — Status: [Status]
      Call: [callNumber], Loc: [shelfLocation]
   
   (blank line)
   
   2. **[Next Physical Book Title]** by *[Author]* — [Publisher], [Year] — Status: [Status]
      Call: [callNumber], Loc: [shelfLocation]
   
   **CRITICAL FORMATTING RULES - THESE ARE MANDATORY:**
   - Write ONLY ONE book per numbered item
   - After each book's information, add a BLANK LINE before the next book
   - NEVER write two or more book titles in the same numbered item
   - NEVER concatenate book information together
   - NEVER use the pipe character (|) as a separator anywhere. Use commas or spaces.
   - Each book entry must have: number, title, author, publisher, year, status on ONE line
   - Links go on the NEXT line, indented by spaces
   - Then a BLANK LINE before the next book number
   - NEVER display full URLs as plain text - always use markdown links: [Button Text](url)
   - VERY IMPORTANT: You MUST copy the exact, FULL underlying URL string into the markdown link exactly as it is given in the data. Do NOT abbreviate or truncate the link. The link will break if you do not provide the exact full string.
   - If pdfViewLink exists: [View PDF](exact_full_url)
   - If pdfDownloadLink exists: [Download PDF](exact_full_url)
   - If digitalAccessLink exists: [Access E-Book](exact_full_url)
   - Separate multiple links with a single space. DO NOT use "|".
   
   **EXAMPLES OF CORRECT RESPONSES:**
   
   Example 1 - User asks for "5 e-books and 5 physical books":
   Here are 5 e-books and 5 physical books:
   
   E-Books:
   
   1. **Calculus: Early Transcendentals** by *James Stewart* — Cengage, 2020 — Status: Available
      [View PDF](link) [Download PDF](link)
   
   2. **Introduction to Physics** by *John Doe* — McGraw-Hill, 2021 — Status: Available
      [View PDF](link)
   
   Physical Books:
   
   1. **Introduction to Algorithms** by *Thomas Cormen* — MIT Press, 2009 — Status: Available
      Call: QA76.6, Loc: Circulation Section
   
   Example 2 - User asks for "3 books about calculus":
   I found 3 books about calculus:
   
   E-Books:
   
   1. **Calculus I** by *Author* — Publisher, 2020 — Status: Available
      [View PDF](link)
   
   Physical Books:
   
   1. **Calculus II** by *Author* — Publisher, 2019 — Status: Available
      Call: QA303, Loc: Circulation Section
   
   2. **Advanced Calculus** by *Author* — Publisher, 2018 — Status: Available
      Call: QA303, Loc: Reference Section

2. ALWAYS respect the user's requested quantity - return exactly that many books if available in BOOKS DATA.
3. NEVER fabricate book titles, authors, publishers, call numbers, or statuses. ONLY cite data actually provided below.
4. If BOOKS DATA shows 0 results, say: "I didn't find books matching that query in our catalog. You can try different keywords, or visit the library for assistance."
5. If a user asks about a college (e.g. "engineering books"), list books from that college's data up to the requested quantity.
6. If a user asks about a topic (e.g. "calculus"), list books whose titles match that topic up to the requested quantity.
7. For greetings (hi, hello, kumusta), respond warmly and offer to help — do NOT search for books.
8. For service questions (hours, forms, databases), answer from the LIBRARY FACTS above — do NOT search for books.
9. Respond in Filipino if the user writes in Filipino/Tagalog. Otherwise use English.
10. Keep responses well-structured using numbered lists with proper line breaks for clarity.
11. If user doesn't specify a quantity and more than 10 books match, list the first 10 and say "and X more — ask me to show more or narrow your search."
12. Always end with a helpful follow-up: "Would you like to know more about any of these books?" or similar.
13. Use minimal emojis - only use format labels (E-Books: / Physical Books:) without emoji icons for a professional appearance.

STYLE AND FORMATTING — MANDATORY:
- Use asterisks for emphasis: *italic* for titles, **bold** for important terms and headings.
- Use numbered lists (1. 2. 3.) or dashes (-) for listing items.
- Use **bold** to highlight book titles, section names, and key information.
- Use *italic* for subtitles, author names, and supplementary details.
- Keep your tone professional, courteous, and informative — like a formal university librarian.
- Do not use emojis except sparingly for book listings where a simple icon aids readability.
- Structure responses clearly with line breaks between sections.`;

// ─── RESPONSE SANITIZER ──────────────────────────────────────────────────────

function sanitizeResponse(text: string): string {
  return text
    .replace(/_{2,}(.*?)_{2,}/g, "$1")
    .replace(/~{2}(.*?)~{2}/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    // DO NOT strip markdown links — they are rendered as clickable buttons in the UI
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
    .trim();
}

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
    "database", "ebsco", "ejournal", "iglib",
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

// ─── QUANTITY PARSING ─────────────────────────────────────────────────────────

function parseRequestedQuantity(message: string): { ebooks: number; physical: number; total: number } | null {
  const lower = message.toLowerCase();

  // Pattern: "5 ebooks and 5 physical books"
  const splitMatch = lower.match(/(\d+)\s*(?:e-?books?|ebook|digital\s*books?)\s*(?:and|&|,)\s*(\d+)\s*(?:physical\s*books?|printed?\s*books?|hard\s*cop(?:y|ies))/i);
  if (splitMatch) {
    return { ebooks: parseInt(splitMatch[1]), physical: parseInt(splitMatch[2]), total: parseInt(splitMatch[1]) + parseInt(splitMatch[2]) };
  }

  // Reverse pattern: "5 physical and 5 ebooks"
  const reverseMatch = lower.match(/(\d+)\s*(?:physical\s*books?|printed?\s*books?|hard\s*cop(?:y|ies))\s*(?:and|&|,)\s*(\d+)\s*(?:e-?books?|ebook|digital\s*books?)/i);
  if (reverseMatch) {
    return { ebooks: parseInt(reverseMatch[2]), physical: parseInt(reverseMatch[1]), total: parseInt(reverseMatch[1]) + parseInt(reverseMatch[2]) };
  }

  // Just ebooks: "5 ebooks"
  const ebookOnly = lower.match(/(\d+)\s*(?:e-?books?|ebook|digital\s*books?)/i);
  if (ebookOnly) {
    return { ebooks: parseInt(ebookOnly[1]), physical: 0, total: parseInt(ebookOnly[1]) };
  }

  // Just physical: "5 physical books"
  const physicalOnly = lower.match(/(\d+)\s*(?:physical\s*books?|printed?\s*books?|hard\s*cop(?:y|ies))/i);
  if (physicalOnly) {
    return { ebooks: 0, physical: parseInt(physicalOnly[1]), total: parseInt(physicalOnly[1]) };
  }

  // General: "10 books" or "give me 5"
  const generalMatch = lower.match(/(\d+)\s*(?:books?|titles?|results?)/i);
  if (generalMatch) {
    return { ebooks: 0, physical: 0, total: parseInt(generalMatch[1]) };
  }

  return null;
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
  bookCount: number,
  requestedQty: { ebooks: number; physical: number; total: number } | null
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
    // Separate into e-books and physical books
    const ebooks = books.filter(b => b.pdfViewLink || b.pdfDownloadLink || b.digitalAccessLink);
    const physicalBooks = books.filter(b => !b.pdfViewLink && !b.pdfDownloadLink && !b.digitalAccessLink);

    let qtyNote = "";
    if (requestedQty) {
      if (requestedQty.ebooks > 0 && requestedQty.physical > 0) {
        qtyNote = `\nUSER REQUESTED: ${requestedQty.ebooks} e-books and ${requestedQty.physical} physical books.`;
        qtyNote += `\nAVAILABLE: ${ebooks.length} e-books and ${physicalBooks.length} physical books.`;
        qtyNote += `\nIMPORTANT: Return EXACTLY ${requestedQty.ebooks} e-books and ${requestedQty.physical} physical books if enough are available. If not enough, return all available and explain how many you found.`;
      } else if (requestedQty.total > 0) {
        qtyNote = `\nUSER REQUESTED: ${requestedQty.total} books total.`;
        qtyNote += `\nAVAILABLE: ${ebooks.length} e-books and ${physicalBooks.length} physical books (${books.length} total).`;
        qtyNote += `\nIMPORTANT: Return EXACTLY ${requestedQty.total} books if enough are available. If not enough, return all available and explain how many you found.`;
      }
    }

    parts.push(`\n\nBOOKS DATA — ${bookCount} total results from the MSEUF catalog (${ebooks.length} e-books, ${physicalBooks.length} physical books, showing ${Math.min(books.length, 20)}):${qtyNote}`);
    books.slice(0, 20).forEach((b, i) => {
      const authors = (b.authors as string[])?.join(", ") || "Unknown";
      const subject = ((b.subject as string[]) || []).join(", ");
      const publisher = b.publisher || "N/A";
      const year = b.publicationYear || "N/A";
      const callNum = b.callNumber ? `Call #: ${b.callNumber}` : "";
      const location = b.shelfLocation || "";
      const status = b.availability || "unknown";
      
      // Determine format type
      const hasDigitalAccess = b.pdfViewLink || b.pdfDownloadLink || b.digitalAccessLink;
      const formatType = hasDigitalAccess ? "E-Book" : "Physical";
      
      const pdfViewLink = b.pdfViewLink ? `| pdfViewLink: ${b.pdfViewLink}` : "";
      const pdfDownloadLink = b.pdfDownloadLink ? `| pdfDownloadLink: ${b.pdfDownloadLink}` : "";
      const ebookLink = b.digitalAccessLink ? `| digitalAccessLink: ${b.digitalAccessLink}` : "";
      
      parts.push(
        `${i + 1}. [FORMAT: ${formatType}] "${b.title}" by ${authors} | ${subject} | ${publisher}, ${year} | ${callNum} ${location} | Status: ${status} ${pdfViewLink} ${pdfDownloadLink} ${ebookLink}`.trim()
      );
    });
    if (bookCount > 20) {
      parts.push(`(${bookCount - 20} more books available — user can ask to see more)`);
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

interface StudentInfo {
  studentId?: string;
  studentName?: string;
  department?: string;
  program?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, student } = await request.json();
    const historyArr: Message[] = (history as Message[]) || [];
    const studentInfo: StudentInfo = student || {};

    // 1. Detect intent
    const intent = detectIntent(message);

    // 2. Extract search terms
    const searchQuery = extractSearchTerms(message, historyArr);

    // 3. Fetch live data from Convex
    let books: Array<Record<string, unknown>> = [];
    let faqs: Array<Record<string, unknown>> = [];
    let totalBookCount = 0;

    // Parse requested quantity from user message
    const requestedQty = parseRequestedQuantity(message);
    // Determine how many books to fetch
    const fetchLimit = requestedQty ? Math.max(requestedQty.total * 2, 20) : 20;

    if (intent === "book_search" || intent === "general") {
      try {
        [books, faqs] = await Promise.all([
          convexClient.query(api.books.search, { query: searchQuery, limit: Math.min(fetchLimit, 40) }) as Promise<Array<Record<string, unknown>>>,
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
    const liveContext = buildLiveContext(books, faqs, message, intent, totalBookCount, requestedQty);

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

    const rawText =
      result.response.text()?.trim() ||
      "I'm sorry, I couldn't generate a response. Please try again or contact library@mseuf.edu.ph.";

    const responseText = sanitizeResponse(rawText);

    // 7. Return response with book metadata for UI cards
    // Send all the books shown in context so the cards match the AI text
    const maxCards = requestedQty ? requestedQty.total : 10;
    const metadata =
      books.length > 0 ? { books: books.slice(0, Math.min(maxCards, 20)) } : undefined;

    // 8. Log query with student info
    try {
      await convexClient.mutation(api.queryLogs.log, {
        query: message,
        sessionId: "web-session",
        resultsCount: totalBookCount,
        responseTime: 0,
        source: "chatbot",
        studentId: studentInfo.studentId,
        studentName: studentInfo.studentName,
        department: studentInfo.department,
        program: studentInfo.program,
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

