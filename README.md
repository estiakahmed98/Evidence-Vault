# Evidence Vault

<img width="1920" height="1129" alt="Vault Page" src="https://github.com/user-attachments/assets/edcea601-a53d-47d8-8dd9-8a4e5702439e" />
<img width="1920" height="1433" alt="evidence-vault" src="https://github.com/user-attachments/assets/15172e4b-d35d-4e05-b0ca-402d4d01435c" />
<img width="1920" height="1267" alt="Vault ID Page" src="https://github.com/user-attachments/assets/660a9edb-d898-4775-8b8c-2ad81106d510" />
<img width="1920" height="1300" alt="Request Buyer" src="https://github.com/user-attachments/assets/b5dbbf4a-7dbf-42ca-bd51-984d9426ef30" />

## Overview

Evidence Vault is a Next.js 16 (app router) prototype that showcases how a compliance team could manage factory documentation, respond to buyer requests, and track versioned evidence inside a single interface. The experience blends hero metrics, vault snapshots, and detail views with responsive Tailwind + Radix components so it feels polished on any screen.

## Tech Stack

- **Frameworks**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, `tw-animate-css`, gradients defined in `app/globals.css`
- **UI primitives**: Radix UI + custom wrappers in `components/ui/*`, `lucide-react` icons
- **Data & validation**: `lib/mock-data.ts`, React Hook Form, Zod, TanStack Table
- **Utilities**: `clsx` + `tailwind-merge` helper in `lib/utils.ts`, custom `ThemeProvider`
- **Tooling**: ESLint, Vercel Analytics, Node 18+ ecosystem

## Key Screens

- `app/page.tsx`: Landing page with hero stats cards, action tiles for Vault and Buyer Requests, and trust badges.
- `app/vault/[id]/page.tsx`: Evidence detail and version history view with responsive grid, status chips, and upload modal.
- `app/requests/page.tsx`: Buyer request dashboard with hero KPIs, request table, vault snapshot, and modals for fulfilling or creating requests.
- `components/data-table.tsx`, `components/modal.tsx`, `components/status-chip.tsx`: Build blocks reused across the routes to keep tables, dialogs, and chips consistent.

## Project Structure

- `app/`: App-router pages, layouts, and globals. `layout.tsx` injects Geist fonts + Vercel Analytics; `globals.css` defines themes/colors.
- `components/`: Design system layer (button, card, badge, toast, etc.) plus reusable logic like theme provider, modal, and status chips.
- `hooks/`: Viewport helpers (`use-mobile`) and toast helpers powering UI reactions.
- `lib/`: Sample content for vault items, buyer requests, and the `cn` class-merging utility.
- `public/`: Static assets referenced in `layout.tsx` metadata (`icon.svg`, themed favicons).

## Getting Started

### Prerequisites

- Node.js 18 or later (Next 16 targets modern runtimes)
- npm 8+ or compatible package manager

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Data & Workflows

- `lib/mock-data.ts` seeds buyers, vault entries, and version history. Update it to simulate real API responses during development.
- Forms leverage React Hook Form + Zod (`app/vault/[id]/page.tsx`) to validate uploads and keep UI error messages consistent.
- `DataTable` uses TanStack Table for sorting/filtering/pagination; adjust `versionColumns` or `columns` in the pages to change table behavior.

## Phase A Thin Slice (BB)

This repo includes a minimal, mocked request workflow + pack export stub using Next.js route handlers.

### Mini Design Doc + Risks

- `docs/phase-a-mini-design-doc.md`
- `docs/top-3-risks.md`
- `docs/change-request.md`

### API Endpoints (mocked)

Request workflow:

- `POST /api/requests` create buyer request
- `GET /api/requests?factoryId=...` list factory requests
- `POST /api/requests/:id/fulfill` fulfill with evidence + version IDs
- `GET /api/buyer/requests?buyerId=...` buyer checks status
- `GET /api/buyer/evidence/:id?buyerId=...` buyer accesses shared evidence versions

Pack export stub:

- `POST /api/packs` create pack and mark pending
- `GET /api/packs/:id` returns pending/ready + fake download URL

Example curl:

```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{"buyerId":"buyer-1","factoryId":"factory-1","docType":"Certificate","dueDate":"2025-02-15"}'

curl -X POST http://localhost:3000/api/requests/<id>/fulfill \
  -H "Content-Type: application/json" \
  -d '{"evidenceId":"1","versionIds":["v1","v2"]}'

curl "http://localhost:3000/api/buyer/evidence/1?buyerId=buyer-1"

curl -X POST http://localhost:3000/api/packs \
  -H "Content-Type: application/json" \
  -d '{"buyerId":"buyer-1","items":[{"evidenceId":"1","versionIds":["v2","v3"]}]}'
```

## Styling & Theme

- `app/globals.css` imports Tailwind + custom themes (light/dark palettes, `@theme` variables) and applies `Geist` fonts from `next/font`.
- Utility `components/theme-provider.tsx` wraps `next-themes` when you need system or user driven theme toggles.
- Shared UI relies on `components/ui/*` wrappers (buttons, cards, selects, etc.) that tie Radix primitives to the theme tokens.

## Deployment

Deploy like any Next.js app - build with `npm run build` and serve via `npm run start` or push to Vercel for zero-config hosting.

## Next Steps

1. Hook real backend data by replacing `lib/mock-data.ts` with fetch calls inside the app pages.
2. Extend `components/ui` or add new design tokens to match the brand language.
3. Wire up analytics/telemetry beyond Vercel Analytics if needed.
