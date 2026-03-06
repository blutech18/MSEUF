import { mutation } from "./_generated/server";

export const seedBooks = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("books").first();
    if (existing) return "Already seeded";

    const books = [
      {
        title: "Introduction to Computer Science",
        authors: ["John Smith", "Jane Doe"],
        isbn: "978-0-13-468599-1",
        publisher: "Pearson Education",
        publicationYear: 2022,
        edition: "3rd",
        callNumber: "QA76.6 .S65 2022",
        shelfLocation: "Floor 2, Shelf A-12",
        subject: ["Computer Science", "Programming"],
        keywords: ["algorithms", "data structures", "programming"],
        abstract: "A comprehensive introduction to the fundamental concepts of computer science, including algorithms, data structures, and software engineering principles.",
        language: "English",
        format: "Hardcover",
        availability: "available",
      },
      {
        title: "Philippine History: A Comprehensive Overview",
        authors: ["Maria Santos"],
        isbn: "978-971-23-5678-9",
        publisher: "Rex Bookstore",
        publicationYear: 2021,
        edition: "5th",
        callNumber: "DS686 .S26 2021",
        shelfLocation: "Floor 1, Filipiniana Section",
        subject: ["Philippine History", "Southeast Asian Studies"],
        keywords: ["Philippines", "history", "culture", "colonialism"],
        abstract: "An in-depth exploration of Philippine history from pre-colonial times to the modern era.",
        language: "English",
        format: "Paperback",
        availability: "available",
      },
      {
        title: "Fundamentals of Nursing",
        authors: ["Patricia Potter", "Anne Perry"],
        isbn: "978-0-323-67786-7",
        publisher: "Elsevier",
        publicationYear: 2023,
        edition: "11th",
        callNumber: "RT41 .P68 2023",
        shelfLocation: "Floor 3, Health Sciences",
        subject: ["Nursing", "Healthcare"],
        keywords: ["nursing", "patient care", "clinical practice", "health assessment"],
        abstract: "The definitive guide to nursing fundamentals covering patient care, clinical judgment, and evidence-based practice.",
        language: "English",
        format: "Hardcover",
        availability: "available",
      },
      {
        title: "Engineering Mathematics",
        authors: ["K.A. Stroud", "Dexter Booth"],
        isbn: "978-1-352-01004-6",
        publisher: "Red Globe Press",
        publicationYear: 2020,
        edition: "8th",
        callNumber: "QA401 .S77 2020",
        shelfLocation: "Floor 2, Shelf B-05",
        subject: ["Mathematics", "Engineering"],
        keywords: ["calculus", "linear algebra", "differential equations"],
        abstract: "A foundational mathematics textbook designed specifically for engineering students.",
        language: "English",
        format: "Paperback",
        availability: "unavailable",
      },
      {
        title: "Business Law in the Philippines",
        authors: ["Hector De Leon"],
        isbn: "978-971-23-4321-0",
        publisher: "Rex Bookstore",
        publicationYear: 2022,
        callNumber: "KPM1270 .D45 2022",
        shelfLocation: "Floor 1, Shelf C-08",
        subject: ["Law", "Business", "Philippine Law"],
        keywords: ["business law", "contracts", "obligations", "commercial law"],
        abstract: "Comprehensive guide to Philippine business law covering contracts, partnerships, corporations, and commercial transactions.",
        language: "English",
        format: "Paperback",
        availability: "available",
      },
      {
        title: "General Psychology",
        authors: ["Robert Feldman"],
        isbn: "978-1-260-15467-8",
        publisher: "McGraw-Hill",
        publicationYear: 2023,
        edition: "15th",
        callNumber: "BF121 .F45 2023",
        shelfLocation: "Floor 2, Shelf D-03",
        subject: ["Psychology"],
        keywords: ["psychology", "behavior", "cognition", "mental health"],
        abstract: "An engaging introduction to psychology that connects the discipline to students' everyday lives.",
        language: "English",
        format: "Hardcover",
        availability: "reserved",
      },
      {
        title: "Noli Me Tangere",
        authors: ["José Rizal"],
        isbn: "978-971-08-1234-5",
        publisher: "National Bookstore",
        publicationYear: 2019,
        callNumber: "PQ8897 .R5 N6",
        shelfLocation: "Floor 1, Filipiniana Section",
        subject: ["Philippine Literature", "Fiction"],
        keywords: ["Rizal", "Philippine literature", "novel", "colonial Philippines"],
        abstract: "José Rizal's iconic novel exposing the inequities of Spanish colonial rule in the Philippines.",
        language: "Filipino",
        format: "Paperback",
        availability: "available",
      },
      {
        title: "Organic Chemistry",
        authors: ["Paula Bruice"],
        isbn: "978-0-13-404228-2",
        publisher: "Pearson",
        publicationYear: 2021,
        edition: "8th",
        callNumber: "QD251.3 .B78 2021",
        shelfLocation: "Floor 3, Shelf A-09",
        subject: ["Chemistry", "Organic Chemistry"],
        keywords: ["organic chemistry", "reactions", "mechanisms", "synthesis"],
        abstract: "A student-friendly approach to organic chemistry with emphasis on visualization and understanding reaction mechanisms.",
        language: "English",
        format: "Hardcover",
        availability: "maintenance",
      },
      {
        title: "Principles of Economics",
        authors: ["N. Gregory Mankiw"],
        isbn: "978-0-357-03831-4",
        publisher: "Cengage Learning",
        publicationYear: 2023,
        edition: "10th",
        callNumber: "HB171.5 .M36 2023",
        shelfLocation: "Floor 2, Shelf E-01",
        subject: ["Economics"],
        keywords: ["economics", "microeconomics", "macroeconomics", "market"],
        abstract: "The leading economics textbook covering both micro and macroeconomic principles with real-world applications.",
        language: "English",
        format: "Hardcover",
        digitalAccessLink: "https://www.cengage.com/economics",
        availability: "available",
      },
      {
        title: "Educational Technology for Teaching and Learning",
        authors: ["Timothy Newby", "Donald Stepich"],
        isbn: "978-0-13-802098-1",
        publisher: "Pearson",
        publicationYear: 2020,
        edition: "5th",
        callNumber: "LB1028.3 .N49 2020",
        shelfLocation: "Floor 2, Shelf F-07",
        subject: ["Education", "Educational Technology"],
        keywords: ["educational technology", "teaching", "learning", "digital literacy"],
        abstract: "A practical guide to integrating technology in teaching with frameworks for effective digital learning environments.",
        language: "English",
        format: "Paperback",
        availability: "available",
      },
    ];

    const now = Date.now();
    for (const book of books) {
      await ctx.db.insert("books", {
        ...book,
        lastUpdated: now,
        createdAt: now,
      });
    }

    return `Seeded ${books.length} books`;
  },
});

export const seedFAQs = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("faqs").first();
    if (existing) return "Already seeded";

    const faqs = [
      {
        question: "What are the library operating hours?",
        answer: "The library is open Monday to Friday from 7:00 AM to 7:00 PM, and Saturday from 8:00 AM to 5:00 PM. We are closed on Sundays and holidays.",
        category: "General",
        order: 1,
        isActive: true,
      },
      {
        question: "How do I search for a book in the catalog?",
        answer: "You can use our AI chatbot to search by title, author, ISBN, subject, or keywords. You can also access Follett Destiny OPAC for detailed catalog browsing.",
        category: "Catalog",
        order: 2,
        isActive: true,
      },
      {
        question: "How do I access e-books and online databases?",
        answer: "Our e-resources including ProQuest, EBSCO, IG Library, and Philippine E-Journal are accessible through the Collections section. Some require campus network access or library credentials.",
        category: "Digital Resources",
        order: 3,
        isActive: true,
      },
      {
        question: "Where is the Filipiniana section located?",
        answer: "The Reference and Filipiniana Section is located on the 1st floor of the University Library. It houses Philippine-authored materials and references.",
        category: "Services",
        order: 4,
        isActive: true,
      },
      {
        question: "How can I book a function room at the EMRC?",
        answer: "You can reserve EMRC function rooms through the Library Online Appointment form. Please submit your request at least 3 working days in advance.",
        category: "Services",
        order: 5,
        isActive: true,
      },
      {
        question: "What services does the Creation Center offer?",
        answer: "The Creation Center provides printing, 3D printing, and digital fabrication services. It also offers collaborative workspaces for creative projects.",
        category: "Services",
        order: 6,
        isActive: true,
      },
      {
        question: "How do I register for a library account?",
        answer: "You can register online through the Library Account Registration form in our Online Forms section. Please have your student/employee ID ready.",
        category: "General",
        order: 7,
        isActive: true,
      },
      {
        question: "Can I renew my borrowed books online?",
        answer: "Yes, you can renew borrowed books through the Online Book Renewal form. Renewals are subject to availability and outstanding reservation requests.",
        category: "General",
        order: 8,
        isActive: true,
      },
    ];

    for (const faq of faqs) {
      await ctx.db.insert("faqs", faq);
    }

    return `Seeded ${faqs.length} FAQs`;
  },
});

async function hashPassword(password: string): Promise<string> {
  const buf = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const seedStaff = mutation({
  args: {},
  handler: async (ctx) => {
    const accounts = [
      { email: "admin@mseuf.edu.ph", name: "Library Administrator", password: "admin123", role: "admin" },
      { email: "librarian@mseuf.edu.ph", name: "Maria Santos", password: "librarian123", role: "librarian" },
    ];

    for (const acc of accounts) {
      const passwordHash = await hashPassword(acc.password);
      const existing = await ctx.db
        .query("staff")
        .withIndex("by_email", (q) => q.eq("email", acc.email))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { passwordHash });
      } else {
        await ctx.db.insert("staff", {
          email: acc.email,
          name: acc.name,
          passwordHash,
          role: acc.role,
          isActive: true,
          lastLogin: Date.now(),
        });
      }
    }

    return "Seeded 2 staff members with hashed passwords";
  },
});
