## Lebanese Learning (Prototype)

I want to create an Angular website based on LingoHut data (webscrape it) for learning Lebanese Arabic. I want to also include live news channel (from their websites or youtube). I want to also use audios (https://www.b3at.co/, conversations etc) and integrate its social aspects to the fediverse. You can inspire yourself from Duolingo but make it way more simple and user friendly, don't game-ify it past an exp level or something like this. Users may have a proficiency level.  




https://leb-lingo-hub.lovable.app/  

https://aistudio.google.com/app/prompts/new_chat  

https://www.perplexity.ai/search/i-want-to-create-an-angular-we-lK57gNg5SkmltP.RlCHYEA?0=d:
v1) https://www.perplexity.ai/apps/94ae7b80-d839-4a49-a5b4-ff919421d810
v2) https://www.perplexity.ai/apps/b5cde106-6883-4ec4-8fc2-50007bfaa9b7
v3) https://www.perplexity.ai/apps/1f4f1810-5637-4d47-a3bc-ddd0dd8b5c77




Goal: A clean, modular, minimal-friction web platform to learn Lebanese Arabic (Levantine) through structured lessons, live news exposure, authentic audio conversations, and light social/fediverse sharing (ActivityPub). Inspired by the clarity and pacing of Duolingo—but intentionally avoiding excessive gamification. Only a simple experience / proficiency level progression (e.g., EXP → Level) is planned.

> IMPORTANT: This repository currently contains placeholder/sample data and a mock scraping script. No production scraping of third‑party sites is performed yet. Always review a target site's Terms of Service and robots.txt before scraping or redistributing content.

---

## High-Level Features (Initial Prototype)

1. Lessons: Basic JSON-backed lessons (id, title, level, items).
2. Audio: List of conversation/audio clips (placeholder metadata for now).
3. Live News: Embeds of publicly available YouTube live channels + placeholder headlines.
4. Social (Planned): ActivityPub style timeline + posting (currently mock endpoints only).
5. Modular Angular Frontend: Standalone components, signals, lazy-loaded feature areas.
6. Node/Express Backend: Serves JSON lesson/audio/news data; placeholder social + scraping integration point.

---

## Monorepo Structure

```
root
├── package.json            # Workspaces orchestrator
├── frontend/               # Angular application (standalone components)
├── backend/                # Express API server
├── scripts/                # Scraping / data maintenance scripts (placeholder)
├── data/                   # Versioned content JSON (lessons, audio, news channels)
└── README.md
```

### Frontend (Angular 17)
- Uses standalone API (no traditional NgModules).
- Routing splits into: lessons, news, audio, social.
- Services: `lesson.service.ts`, `audio.service.ts`, `news.service.ts`.
- Reusable UI: `audio-player.component.ts`, `safe.pipe.ts`.

### Backend (Express)
Endpoints (current):
```
GET /api/lessons           # Summaries
GET /api/lessons/:id       # Full lesson
GET /api/audio             # Audio clip list
GET /api/news/channels     # Live channel embeds
GET /api/news/headlines    # Placeholder headlines
GET /api/social/timeline   # Mock timeline
POST /api/social/post      # Echo post placeholder
```

### Scripts
`scripts/scrape-lessons.ts` – Demonstration of a scraping pipeline shape (axios + cheerio). Not production ready.

---

## Getting Started

### Prerequisites
- Node.js 18+ (recommended LTS)
- npm 9+

### Install
```
npm install
```
This installs root dev tools + each workspace (frontend, backend, scripts).

### Run (Dev)
In two terminals OR use the combined script:

```
# Combined (concurrently) – serves frontend (default :4200) & backend (:4300)
npm run dev
```

Open: http://localhost:4200

### Build
```
npm run build
```

### Scrape (Placeholder)
```
cd scripts
npm install   # only first time if not already
npx ts-node scrape-lessons.ts
```
This merges demo-scraped lesson(s) into `data/lessons.json`.

---

## Data Model (Current Minimal)

LessonSummary:
```
{ id: string; title: string; level: number; description: string }
```
LessonItem:
```
{ arabic: string; english: string; audioUrl?: string }
```
Lesson extends LessonSummary with:
```
{ items: LessonItem[] }
```
AudioClip:
```
{ id: string; title: string; duration: number; url: string }
```

---

## Planned Roadmap

Short Term:
1. Add real headline ingestion (RSS → sanitize → cache).
2. Introduce user auth (lightweight JWT or Passkey) + store progress.
3. Add spaced repetition schedule & progress tracking (EXP → Level).
4. Improve audio player (waveform preview, playback rate, A/B loop).
5. Expand lessons (structure for categories / tags / prerequisites).

Backend dev note:

The backend `dev` script uses `ts-node` in ESM mode so TypeScript can run directly:

```
cd backend
npm install
npm run dev
```

If you see Node complaining about unknown `.ts` file extensions, ensure `ts-node` is installed in the backend workspace and that `backend/package.json` `type` is `module` (already set).
Medium Term:
1. Implement legitimate scraping adapters with per-source compliance + caching.
2. Editable community-contributed sentences (moderation queue).
3. ActivityPub integration: outbound Actor + WebFinger + inbox/outbox endpoints.
4. i18n for UI (English → Arabic / French).
5. Add minimal accessibility enhancements (ARIA, keyboard nav, contrast audit).

Long Term:
1. Offline/PWA support (service worker caching lessons & audio).
2. Pronunciation exercises (Web Speech API + scoring backend / ML model).
3. Adaptive difficulty (performance-based item resurfacing).
4. Federation of progress badges via ActivityPub (opt-in).

---

## ActivityPub (Future Design Sketch)

Planned components:
- Actor representation per user (`/u/:username`).
- Outbox: progress events (completed_lesson, new_level).
- Inbound: Accept / Follow / Undo (initially limited to read-only timeline ingestion).
- Security: HTTP Signatures + LD-Signatures (phase 2).

---

## Legal & Ethical Notes
- Verify permission before scraping or embedding 3rd party learning content (e.g., LingoHut). If disallowed, pivot to user-generated or CC-licensed material.
- Respect robots.txt and Terms of Service.
- Attribute original sources where licensing requires.
- Provide opt-out & deletion for user-generated social content.

---

## Contributing
1. Fork & branch (`feat/xyz`).
2. Add tests or at least manual reproduction notes for changes.
3. Keep components focused; prefer signals & standalone for new UI.
4. Open PR with checklist of affected areas.

---

## Tech Notes
- Angular signals used for small state slices (no NgRx initially).
- All services return typed Observables (extend with caching later).
- JSON in `data/` acts as a primitive content store (replace with DB later).

---

## External Inspiration & References
Initial exploration & ideation resources:
- https://leb-lingo-hub.lovable.app/
- https://aistudio.google.com/app/prompts/new_chat
- Perplexity explorations (design & feature ideation):
	- v1: https://www.perplexity.ai/apps/94ae7b80-d839-4a49-a5b4-ff919421d810
	- v2: https://www.perplexity.ai/apps/b5cde106-6883-4ec4-8fc2-50007bfaa9b7
	- v3: https://www.perplexity.ai/apps/1f4f1810-5637-4d47-a3bc-ddd0dd8b5c77

---

## Status
Prototype scaffold created. Many features are placeholders. See roadmap.

Feel free to open issues for suggestions or clarifications.

