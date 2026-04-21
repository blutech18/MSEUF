# MSEUF University Libraries — AI-Powered Library Support System

An AI-powered academic library portal for **Manuel S. Enverga University Foundation (MSEUF)**, Lucena City. It combines a public-facing Next.js website, a Convex backend, a Google Drive-synced digital catalog, and an embedded AI librarian chatbot named **ROSe** (Reference Online Services) powered by Google Gemini.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [High-Level Architecture](#high-level-architecture)
- [Project Structure](#project-structure)
- [Data Model (Convex)](#data-model-convex)
- [Core Flows](#core-flows)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Scripts](#scripts)
- [Deployment](#deployment)

---

## Overview

The system serves three main audiences:

- **Students / Public** — browse the library site, search the catalog, view e-books (PDFs synced from Google Drive), fill out library forms (appointment, registration, book renewal, satisfaction survey), and chat with **ROSe**, an AI librarian.
- **Staff / Librarians** — sign in to a protected `/dashboard` to manage books, reservations, students, staff, FAQs, programs, forms, and view analytics.
- **ROSe (AI Chat)** — a Gemini-powered assistant embedded as a floating widget on every page. It identifies the student, performs live book searches against Convex, and replies with grounded, MSEUF-scoped answers plus clickable book cards.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, React 19, Server + Client Components) — `next`
- **TypeScript 5**
- **Tailwind CSS 4** (`@tailwindcss/postcss`) — global styles in `@/src/app/globals.css`
- **Lucide React** icons, **clsx** + **tailwind-merge** via `@/src/lib/utils.ts`
- **Zustand** for client state (`@/src/stores/*`) with `persist` middleware for auth

### Backend / Data
- **Convex** (`convex` ^1.32) — schema, queries, mutations, and real-time sync in `@/convex/`
- **Convex full-text search indexes** on books (`search_title`, `search_authors`, `search_keywords`, `search_subject`, `search_abstract`)

### AI
- **Google Generative AI SDK** (`@google/generative-ai`) — `gemini-2.5-flash`
- **OpenAI SDK** (`openai`) — available as optional alternative
- System-prompted, intent-detecting assistant wired to live Convex data (see `@/src/app/api/chat/route.ts`)

### External Integrations
- **Google Drive API** (`googleapis`) via a service account — ingests PDFs from a shared folder and registers them as e-books (see `@/lib/googleDrive.ts` and `@/src/app/api/sync-drive-pdfs/route.ts`)
- **Follett Destiny OPAC** — external catalog link referenced in the UI

### Tooling
- **ESLint 9** (`eslint-config-next`)
- **tsx** for running TypeScript scripts
- **dotenv** for env loading in scripts
- **mammoth** (dev) for DOCX parsing in import scripts

---

## High-Level Architecture

```
+-----------------------------+         +----------------------------+
|       Browser (User)        |         |   Google Drive (PDFs)      |
|  - Next.js pages + RSC      |         |   shared folder            |
|  - ChatWidget (ROSe)        |         +-------------+--------------+
|  - Zustand stores           |                       |
+--------------+--------------+                       | Service Account
               |                                      v
               |                        +-----------------------------+
               |  /api/chat             |  Next.js API Routes         |
               +----------------------> |  - /api/chat (Gemini)       |
               |                        |  - /api/sync-drive-pdfs     |
               |                        +-------------+---------------+
               |                                      |
               |  Convex queries/mutations            |  mutations
               v                                      v
        +--------------------------------------------------------+
        |                    Convex Backend                      |
        |  Tables: books, students, staff, reservations, faqs,   |
        |  queryLogs, chatSessions, analytics, appointments,     |
        |  registrations, bookRenewals, surveys, programs, etc.  |
        |  Search indexes on books for full-text lookup.         |
        +--------------------------------------------------------+
```

Key points:
- The browser talks to Convex directly via the Convex client (real-time) for most reads/writes.
- Two server-only concerns go through Next.js API routes:
  - **Chat** — needs the Gemini key + server-side context assembly.
  - **Drive sync** — needs the Google service-account credentials.

---

## Project Structure

```
d:\Clients\MSEUF\
├─ convex\                       # Convex backend (schema + functions)
│  ├─ schema.ts                  # All tables + indexes
│  ├─ books.ts                   # list, search, getById, create, update, syncNewPdfs, ...
│  ├─ students.ts                # student CRUD + lookup
│  ├─ staff.ts                   # staff auth (authenticate mutation) + CRUD
│  ├─ reservations.ts            # reservation lifecycle
│  ├─ faqs.ts                    # FAQ CRUD
│  ├─ programs.ts                # departments + programs
│  ├─ forms.ts                   # appointments, registrations, renewals, surveys
│  ├─ queryLogs.ts               # chatbot analytics logs
│  ├─ seed.ts                    # dev seeding helpers
│  └─ _generated\                # auto-generated API types
│
├─ lib\
│  └─ googleDrive.ts             # GoogleDriveService wrapper (service-account auth)
│
├─ scripts\                      # tsx / node utility scripts
│  ├─ syncDrivePdfsToBooks.ts    # CLI: pull PDFs from Drive -> Convex
│  ├─ cleanupDuplicatePdfs.ts
│  ├─ checkDuplicates.ts
│  ├─ import-books.mjs
│  ├─ debug-search.mjs
│  └─ test-queries.mjs
│
├─ src\
│  ├─ app\                       # Next.js App Router
│  │  ├─ layout.tsx              # Root layout: ConvexProvider + Header/Footer + ChatWidget
│  │  ├─ page.tsx                # Home
│  │  ├─ about\                  # vision-mission, personnel, quality-objectives, activities, library-avp
│  │  ├─ services\               # circulation-reserve, reference-filipiniana, igsrl, periodicals, luiss, emrc
│  │  ├─ collections\            # acquisitions, e-books, philippine-ejournal, (ebsco, proquest, ig-library, fiction-reviews)
│  │  ├─ forms\                  # appointment, registration, book-renewal, satisfaction-survey
│  │  ├─ tutorials\ libcom\ newsletter\ creation-center\ follett-destiny\
│  │  ├─ dashboard\              # Protected staff area
│  │  │  ├─ layout.tsx           # Auth gate + sidebar
│  │  │  ├─ login\               # Staff login
│  │  │  └─ analytics | books | faqs | forms | programs | reservations | staff | students
│  │  └─ api\
│  │     ├─ chat\route.ts        # ROSe chat endpoint (Gemini + Convex)
│  │     └─ sync-drive-pdfs\route.ts  # HTTP trigger for Drive -> Convex sync
│  │
│  ├─ components\
│  │  ├─ chat\ChatWidget.tsx     # Floating AI chat UI (student identification + book cards)
│  │  ├─ layout\                 # Header, Footer, HeroSlider
│  │  ├─ providers\              # ConvexClientProvider
│  │  └─ ui\                     # Button, Input, Badge, PageHeader, Toast
│  │
│  ├─ stores\                    # Zustand stores
│  │  ├─ authStore.ts            # Staff auth (persisted to localStorage)
│  │  ├─ chatStore.ts            # Chat session + student identity
│  │  ├─ bookStore.ts  searchStore.ts  dashboardStore.ts  analyticsStore.ts
│  │
│  ├─ hooks\ | types\ | lib\     # shared helpers (convex client, constants, utils)
│
├─ public\                       # static assets
├─ .env.example                  # required env vars
├─ next.config.ts  tsconfig.json  postcss.config.mjs  eslint.config.mjs
└─ package.json
```

---

## Data Model (Convex)

Defined in `@/convex/schema.ts`. Main tables:

- **`books`** — title, authors, isbn, publisher, year, edition, callNumber, shelfLocation, subject[], keywords[], abstract, language, format, `digitalAccessLink`, `coverImageUrl`, `availability` (`available` | `unavailable` | `reserved` | `maintenance`), copy counts, and Google Drive fields (`driveFileId`, `driveFileName`, `pdfViewLink`, `pdfDownloadLink`, `pdfThumbnail`, `fileSize`). Indexed by availability, call number, year, driveFileId and has **five full-text search indexes**.
- **`students`** — studentNumber, name, program, department, year, isActive.
- **`staff`** — email, name, hashed password (+ optional salt), role, avatar, login attempts / lockout fields.
- **`reservations`** — `bookId`, student info, status (pending/confirmed/borrowed/returned/cancelled/expired), `expiresAt` (auto-cancel after 24h if unclaimed).
- **`queryLogs`** — every chatbot query: text, session, timestamp, resultsCount, responseTime, student context.
- **`chatSessions`** — persisted chat message arrays per sessionId.
- **`faqs`** — categorized Q&A with ordering + active flag.
- **`availabilityLogs`** — audit trail for book availability changes (by staff).
- **`analytics`** — daily aggregates (searches, top terms, top books, peak hours).
- **`departments`**, **`programs`** — taxonomy for students/books.
- **Online forms:** `appointments`, `registrations`, `bookRenewals`, `surveys` (with optional file attachment in `registrations.enrollmentProof` → `_storage`).

---

## Core Flows

### 1. Chatbot (ROSe) — `@/src/app/api/chat/route.ts`

1. Client (`@/src/components/chat/ChatWidget.tsx`) collects message + optional student identity and POSTs to `/api/chat`.
2. Server detects **intent** (`greeting` | `book_search` | `service_info` | `general`) and extracts **search terms** plus any user-requested **quantities** (e.g. "5 e-books and 3 physical").
3. For catalog intents it calls `api.books.search` (multi-index fan-out + dedupe) and `api.faqs.list` on Convex in parallel.
4. Builds a **live context** appended to a strict `SYSTEM_PROMPT` (identity, hours, sections, policies, formatting rules, blocked databases).
5. Sends prompt + short rolling history to **Gemini 2.5 Flash**, sanitizes the reply, and returns it together with a `metadata.books` array so the widget can render book cards that match the text.
6. Logs the interaction to `queryLogs` with student context.

### 2. Google Drive → Convex PDF Sync

- Source: Google Drive folder (`GOOGLE_DRIVE_FOLDER_ID`) shared with the service account in `GOOGLE_DRIVE_SERVICE_ACCOUNT`.
- Trigger: HTTP route `POST /api/sync-drive-pdfs` or the CLI `npm run sync:pdfs` (`@/scripts/syncDrivePdfsToBooks.ts`).
- `GoogleDriveService.listFilesInFolder` enumerates PDFs; filenames are parsed heuristically for title, authors, year, publisher, and subjects/keywords via a keyword map.
- Records are upserted through `api.books.syncNewPdfs` which skips any existing `driveFileId`, so re-runs are idempotent.
- Cleanup/audit: `npm run cleanup:pdfs` and `npm run check:duplicates`.

### 3. Catalog Search (UI)

- Direct Convex queries from React (via `ConvexClientProvider`) drive listing pages under `@/src/app/collections/*` and the e-books page.
- Search uses `api.books.search`, which merges results from all five full-text search indexes (title, keywords, subject, authors, abstract) and deduplicates by `_id`.

### 4. Forms

- `/forms/appointment`, `/forms/registration`, `/forms/book-renewal`, `/forms/satisfaction-survey` submit directly to Convex mutations defined in `@/convex/forms.ts`.
- Registration optionally uploads an `enrollmentProof` file to Convex file storage (`_storage`).

### 5. Staff Dashboard

- `@/src/app/dashboard/login` authenticates via `api.staff.authenticate` (password hash check + lockout tracking on the server).
- `@/src/stores/authStore.ts` persists the session in `localStorage` under `mseuf-auth`.
- `@/src/app/dashboard/layout.tsx` acts as the auth gate and renders the sidebar.
- Sub-pages manage **books, reservations, students, staff, FAQs, programs, forms, analytics**.

### 6. Reservations

- Defined in `@/convex/reservations.ts`. Lifecycle: `pending → confirmed → borrowed → returned` with `cancelled` / `expired` terminal states. Reservations include an `expiresAt` (24h auto-cancel) and reference both the book and the student.

---

## Environment Variables

Copy `@/.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL (client + server). |
| `GOOGLE_DRIVE_SERVICE_ACCOUNT` | Entire service-account JSON as a single-line string (server only). |
| `GOOGLE_DRIVE_FOLDER_ID` | Drive folder containing library PDFs. |
| `GEMINI_API_KEY` | Required by `/api/chat` for the Gemini model. |
| `OPENAI_API_KEY` | Optional — only if swapping the AI provider. |
| `GOOGLE_AI_API_KEY` | Optional alias used by some scripts. |

A local service-account file (`mseuf-library-*.json`) is present for development convenience — do **not** commit real credentials.

---

## Local Development

Prerequisites: Node.js 20+, npm, a Convex account, a Google Cloud service account with Drive access, and a Gemini API key.

```bash
# 1. Install deps
npm install

# 2. Start Convex in one terminal (generates convex/_generated and watches schema)
npm run convex:dev

# 3. Start Next.js in another terminal
npm run dev
```

Visit http://localhost:3000. The chat widget loads on every page; staff login is at `/dashboard/login`.

---

## Scripts

Defined in `@/package.json`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server. |
| `npm run build` / `npm start` | Production build / start. |
| `npm run lint` | Run ESLint. |
| `npm run convex:dev` | Watch + push Convex functions/schema. |
| `npm run convex:deploy` | Deploy Convex to production. |
| `npm run sync:pdfs` | Pull PDFs from Google Drive into Convex `books`. |
| `npm run cleanup:pdfs` | Remove duplicate PDF book entries. |
| `npm run check:duplicates` | Report duplicates without modifying data. |

Ad-hoc helpers: `@/scripts/import-books.mjs`, `@/scripts/debug-search.mjs`, `@/scripts/test-queries.mjs`.

---

## Deployment

- **Frontend:** Deploy the Next.js app to Vercel (or any Node host). Configure all env vars above in the hosting provider.
- **Backend:** Run `npm run convex:deploy` to push Convex functions and schema to the production deployment referenced by `NEXT_PUBLIC_CONVEX_URL`.
- **Drive sync:** Trigger `/api/sync-drive-pdfs` on a schedule (cron / Vercel Cron / external scheduler) or run `npm run sync:pdfs` from a maintenance box. The mutation is idempotent.

---

## Notes & Conventions

- UI text and `SYSTEM_PROMPT` intentionally **exclude retired databases** (IG Library, EBSCO, ProQuest, ProQuest eBook Central). ROSe is instructed never to mention them.
- All book listings surface both **physical** and **e-book** formats; e-books are anything with a `pdfViewLink`, `pdfDownloadLink`, or `digitalAccessLink`.
- Auth is intentionally lightweight (Convex-verified credentials + client-persisted session). It is suitable for staff-only dashboard access behind the university network, not general-purpose consumer auth.
