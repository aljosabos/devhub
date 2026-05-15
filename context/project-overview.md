# 🗃️ Devhub — Project Overview

> **Store Smarter. Build Faster.**
> A centralized, AI-enhanced knowledge hub for developers — snippets, prompts, commands, docs, and more in one searchable place.

---

## 📌 The Problem

Developers keep essential knowledge scattered everywhere:

| Where it lives       | What gets lost            |
| -------------------- | ------------------------- |
| VS Code / Notion     | Code snippets             |
| Chat history         | AI prompts & workflows    |
| Project folders      | Context files             |
| Browser bookmarks    | Useful links              |
| Random folders       | Documentation             |
| `.txt` / `.sh` files | Terminal commands         |
| GitHub Gists         | Project templates         |
| Bash history         | One-off terminal commands |

This creates **context switching**, **lost knowledge**, and **inconsistent workflows**.

➡️ Devhub provides one searchable, AI-enhanced hub for all dev knowledge and resources.\*\*

---

## 🧑‍💻 Target Users

| Persona                       | Core Needs                                    |
| ----------------------------- | --------------------------------------------- |
| 👩‍💻 Everyday Developer         | Quick access to snippets, commands, and links |
| 🤖 AI-First Developer         | Store prompts, workflows, and context files   |
| 🎓 Content Creator / Educator | Save course notes and reusable code           |
| 🏗️ Full-Stack Builder         | Patterns, boilerplates, and API references    |

---

## ✨ Core Features

### A) Items & Item Types

Each piece of content is an **Item** with a specific type. System types are available to all users; Pro users can create custom types.

| Icon  | Type        | Description                                   |
| ----- | ----------- | --------------------------------------------- |
| `</>` | **Snippet** | Reusable code blocks with syntax highlighting |
| `🤖`  | **Prompt**  | AI prompts and workflow templates             |
| `📝`  | **Note**    | Markdown notes and documentation              |
| `$_`  | **Command** | Terminal commands and shell scripts           |
| `📎`  | **File**    | Uploaded files (templates, configs, etc.)     |
| `🖼️`  | **Image**   | Screenshots, diagrams, reference images       |
| `🔗`  | **URL**     | Links with descriptions and metadata          |
| `✨`  | **Custom**  | _(Pro only)_ User-defined types               |

### B) Collections

Group related items of any type into named collections.

**Examples:** `React Patterns`, `Context Files for Claude`, `Python Utils`, `Startup Boilerplate`

### C) Search

Full-text search across:

- Item content
- Titles
- Tags
- Types

### D) Authentication

- Email + Password
- GitHub OAuth (via NextAuth v5)

### E) General Features

- ⭐ Favorites & pinned items
- 🕐 Recently used tracking
- 📥 Import from files
- ✏️ Markdown editor for text-based items
- 📁 File uploads (images, docs, templates)
- 📤 Export as JSON or ZIP
- 🌑 Dark mode (default)

### F) AI Features _(Pro)_

Powered by **OpenAI `gpt-4o-mini`**:

| Feature             | Description                                 |
| ------------------- | ------------------------------------------- |
| 🏷️ Auto-tagging     | Automatically suggest relevant tags on save |
| 📄 AI Summaries     | Generate a short description for any item   |
| 🔍 Explain Code     | Plain-language explanation of a snippet     |
| ✨ Prompt Optimizer | Improve and refine AI prompts               |

> **Note on model:** The notes reference `gpt-5-nano` which doesn't exist as of this writing. `gpt-4o-mini` is the closest equivalent — fast, cheap, and well-suited for tagging/summarization workloads. Update this when OpenAI releases newer models.

---

## 🗄️ Data Model

> This schema is a starting point and will evolve. See [Prisma docs](https://www.prisma.io/docs/orm/prisma-schema) for reference.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Neon connection string
}

model User {
  id                   String       @id @default(cuid())
  email                String       @unique
  password             String?      // null for OAuth-only users
  isPro                Boolean      @default(false)
  stripeCustomerId     String?
  stripeSubscriptionId String?

  items                Item[]
  itemTypes            ItemType[]   // custom types (Pro only)
  collections          Collection[]
  tags                 Tag[]

  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt
}

model Item {
  id          String   @id @default(cuid())
  title       String
  contentType String   // "text" | "file"
  content     String?  // used for text-based types (Snippet, Prompt, Note, Command)
  fileUrl     String?  // Cloudflare R2 URL
  fileName    String?
  fileSize    Int?     // bytes
  url         String?  // for URL type items
  description String?
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  language    String?  // e.g. "typescript", "python" — for syntax highlighting

  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  typeId      String
  type        ItemType     @relation(fields: [typeId], references: [id])

  collectionId String?
  collection   Collection? @relation(fields: [collectionId], references: [id])

  tags        ItemTag[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([typeId])
  @@index([collectionId])
}

model ItemType {
  id       String  @id @default(cuid())
  name     String
  icon     String? // icon name or emoji
  color    String? // hex color for UI badge
  isSystem Boolean @default(false) // true = built-in type (Snippet, Note, etc.)

  userId   String?
  user     User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items    Item[]

  @@unique([name, userId]) // prevent duplicate custom type names per user
}

model Collection {
  id          String  @id @default(cuid())
  name        String
  description String?
  isFavorite  Boolean @default(false)

  userId      String
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  items       Item[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

model Tag {
  id     String @id @default(cuid())
  name   String

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items  ItemTag[]

  @@unique([name, userId]) // tags are scoped per user
}

model ItemTag {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

### Schema Notes

- `onDelete: Cascade` added to all user-owned relations — deleting a user cleans up all their data.
- `@@index` added to common foreign keys for query performance.
- `@@unique([name, userId])` on `Tag` and `ItemType` prevents duplicates scoped per user.
- `Item.language` supports syntax highlighting libraries like [Shiki](https://shiki.style/) or [Prism](https://prismjs.com/).
- Consider adding a `lastAccessedAt DateTime?` field to `Item` for the "recently used" feature.

---

## 🧱 Tech Stack

| Category            | Choice                                                                            | Notes                              |
| ------------------- | --------------------------------------------------------------------------------- | ---------------------------------- |
| Framework           | [Next.js 15](https://nextjs.org/) (React 19)                                      | App Router                         |
| Language            | [TypeScript](https://www.typescriptlang.org/)                                     | Strict mode recommended            |
| Database            | [Neon PostgreSQL](https://neon.tech/) + [Prisma ORM](https://www.prisma.io/)      | Serverless Postgres                |
| Caching             | [Redis](https://redis.io/) / [Upstash](https://upstash.com/)                      | Optional — rate limiting, sessions |
| File Storage        | [Cloudflare R2](https://developers.cloudflare.com/r2/)                            | S3-compatible, no egress fees      |
| CSS / UI            | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Dark mode first                    |
| Auth                | [NextAuth v5 (Auth.js)](https://authjs.dev/)                                      | Email + GitHub provider            |
| AI                  | [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`)                        | Tagging, summaries, explain code   |
| Payments            | [Stripe](https://stripe.com/)                                                     | Subscriptions + webhooks           |
| Deployment          | [Vercel](https://vercel.com/)                                                     | Edge-optimized for Next.js         |
| Monitoring          | [Sentry](https://sentry.io/)                                                      | Error tracking (add in Pro phase)  |
| Syntax Highlighting | [Shiki](https://shiki.style/)                                                     | VS Code–quality highlighting       |

---

## 💰 Monetization

|                         | Free        | Pro                        |
| ----------------------- | ----------- | -------------------------- |
| **Price**               | $0          | $8/mo or $72/yr (~25% off) |
| **Items**               | 50          | Unlimited                  |
| **Collections**         | 3           | Unlimited                  |
| **File Uploads**        | Images only | All file types             |
| **Custom Item Types**   | ❌          | ✅                         |
| **AI Features**         | ❌          | ✅                         |
| **Export (JSON / ZIP)** | ❌          | ✅                         |
| **Search**              | ✅          | ✅                         |

**Payments:** Stripe Checkout + webhooks to sync `isPro`, `stripeCustomerId`, and `stripeSubscriptionId` on the `User` model.

> Consider a 7-day free trial for Pro to reduce friction. Also consider a **Lifetime** tier ($150–200 one-time) if targeting indie hackers and developers.

---

## 🎨 UI / UX

**Design inspiration:** [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)

### Screenshots

Refer to the screenshots below as a base for the dashboard UI. It does not have to be exact. Use it as a reference:

- @context/screenshots/dashboard-ui-main.png
- @context/screenshots/dashboard-ui-drawer.png

- 🌑 Dark mode default
- Minimal, keyboard-friendly, developer-focused
- Syntax highlighting for all code types
- Collapsible sidebar with navigation, collections, and filters
- Main content area: grid or list view (user preference)
- Full-screen item editor with Markdown support

### Responsive Layout

- Mobile: sidebar becomes a bottom drawer or slide-over
- Touch-optimized buttons and icon sizes

### Recommended Component Libraries

- [shadcn/ui](https://ui.shadcn.com/) — accessible, unstyled base
- [Radix UI](https://www.radix-ui.com/) — underlying primitives
- [cmdk](https://cmdk.paco.me/) — command palette / quick search
- [Shiki](https://shiki.style/) — syntax highlighting

---

## 🔌 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              (Next.js App Router + React 19)            │
└───────────────────────────┬─────────────────────────────┘
                            │ fetch / Server Actions
┌───────────────────────────▼─────────────────────────────┐
│                     Next.js API Layer                   │
│              (Route Handlers / Server Actions)          │
└────┬──────────────┬──────────────┬──────────────┬───────┘
     │              │              │              │
┌────▼────┐  ┌──────▼──────┐  ┌───▼───┐  ┌──────▼──────┐
│  Neon   │  │ Cloudflare  │  │OpenAI │  │   Redis     │
│Postgres │  │     R2      │  │  API  │  │  (Upstash)  │
│(Prisma) │  │(File Store) │  │       │  │  (Cache)    │
└─────────┘  └─────────────┘  └───────┘  └─────────────┘
```

---

## 🔐 Auth Flow

```
User
 │
 ▼
/login or /register
 │
 ▼
NextAuth v5
 │
 ├──► Email + Password ──► bcrypt hash ──► Neon DB
 │
 └──► GitHub OAuth ──────► OAuth callback ─► Neon DB
                                │
                                ▼
                           JWT Session
                                │
                                ▼
                      Protected App Routes
```

- Sessions stored as JWTs (stateless) or in the DB via Prisma adapter
- Middleware protects all `/app/*` routes
- See [Auth.js Prisma adapter docs](https://authjs.dev/getting-started/adapters/prisma)

---

## 🧠 AI Feature Flow

```
User saves / requests AI action on an Item
 │
 ▼
Next.js API Route (/api/ai/*)
 │
 ├── Validate: isPro check (return 403 if Free tier)
 │
 ▼
OpenAI API (gpt-4o-mini)
 │
 ├── Auto-tag    → returns string[]  → saved to ItemTag
 ├── Summarize   → returns string    → saved to Item.description
 ├── Explain     → returns string    → streamed to UI
 └── Optimize    → returns string    → streamed to editor
 │
 ▼
Optimistic UI update → Toast confirmation
```

> Use **streaming responses** (`ReadableStream`) for Explain and Optimize features — they produce longer output and streaming improves perceived performance significantly.

---

## 🗺️ Roadmap

### Phase 1 — MVP

- [ ] Project setup (Next.js, Prisma, Neon, NextAuth)
- [ ] Authentication (Email + GitHub)
- [ ] Item CRUD (all system types)
- [ ] Collections (create, assign items)
- [ ] Tagging system
- [ ] Full-text search
- [ ] Favorites & pinning
- [ ] Free tier limits (50 items, 3 collections)
- [ ] Dark mode UI

### Phase 2 — Pro

- [ ] Stripe integration (subscriptions + webhooks)
- [ ] Pro gating middleware
- [ ] AI features (auto-tag, summarize, explain, optimize)
- [ ] Custom item types
- [ ] File uploads to Cloudflare R2
- [ ] Export (JSON / ZIP)
- [ ] Recently used tracking
- [ ] Import from files

### Phase 3 — Growth

- [ ] Shared / public collections
- [ ] Team & Organization plans
- [ ] VS Code extension
- [ ] Browser extension (save-to-DevStash)
- [ ] Public REST API
- [ ] CLI tool (`devhub push snippet.ts`)
- [ ] Sentry error monitoring

---

## 🎓 Development Workflow (Course Structure)

- **One Git branch per lesson** — students can follow along and diff between lessons
- Use **Cursor**, **Claude Code**, or **ChatGPT** for AI-assisted development
- **GitHub Actions** for CI (lint, typecheck, build) — optional but recommended
- **Sentry** for runtime error tracking — add in Phase 2+

**Branch naming convention:**

```bash
git switch -c lesson-01-project-setup
git switch -c lesson-02-database-schema
git switch -c lesson-03-auth
git switch -c lesson-04-item-crud
# etc.
```

---

## 📎 Key Resources

| Resource                    | Link                                                      |
| --------------------------- | --------------------------------------------------------- |
| Next.js Docs                | https://nextjs.org/docs                                   |
| Prisma Docs                 | https://www.prisma.io/docs                                |
| Neon (Serverless Postgres)  | https://neon.tech/docs                                    |
| Auth.js (NextAuth v5)       | https://authjs.dev                                        |
| Cloudflare R2               | https://developers.cloudflare.com/r2                      |
| shadcn/ui                   | https://ui.shadcn.com                                     |
| Tailwind CSS v4             | https://tailwindcss.com/docs                              |
| OpenAI API                  | https://platform.openai.com/docs                          |
| Stripe Docs                 | https://stripe.com/docs                                   |
| Shiki (Syntax Highlighting) | https://shiki.style                                       |
| Upstash Redis               | https://upstash.com/docs/redis                            |
| Vercel Deployment           | https://vercel.com/docs                                   |
| Sentry for Next.js          | https://docs.sentry.io/platforms/javascript/guides/nextjs |

---

## 📌 Current Status

**🟡 Planning — ready for environment setup and UI scaffolding.**

Next steps:

1. Initialize Next.js project with TypeScript
2. Configure Prisma + Neon connection
3. Seed system `ItemType` records
4. Set up NextAuth with Email + GitHub providers
5. Scaffold sidebar layout + dark mode theme

---

_Devhub — Store Smarter. Build Faster._ 🗃️
