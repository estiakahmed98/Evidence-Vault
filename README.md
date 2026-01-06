# Evidence Vault

<img width="1920" height="1129" alt="Vault Page" src="https://github.com/user-attachments/assets/edcea601-a53d-47d8-8dd9-8a4e5702439e" />
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
