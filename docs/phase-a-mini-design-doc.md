# Phase A Mini Design Doc (Evidence Vault)

## Stack Choice

- FE: Next.js 16 (App Router) + React 19 + TypeScript for fast iteration and server + client UI in one codebase.
- BE: Next.js route handlers for a thin slice and mocked workflows without extra services.
- DB: In-memory maps for the demo; production would use Postgres for relational evidence/request data.
- Storage: Local fake file objects now; production would use S3-compatible object storage with signed URLs.

## Data Model (Entities + Relationships)

- Buyer (1) -> (many) Requests
- Factory (1) -> (many) Evidence
- Evidence (1) -> (many) EvidenceVersion
- Request (1) -> (0..1) Fulfillment -> EvidenceVersion[]
- Pack (1) -> (many) PackItems -> EvidenceVersion[]
- BuyerAccess (buyerId, evidenceId, versionId) derived from Fulfillment + Pack

## Selective Disclosure (Phase A Rules)

- Buyer can only view evidence versions that were explicitly shared via a fulfillment or included in a pack.
- Factory sees all evidence; buyer view is filtered by BuyerAccess.
- Revoking access removes BuyerAccess for the given version IDs.

## Export Pack Approach (Async Job)

- `POST /packs` creates a pack with status `pending`.
- Background worker generates a ZIP, uploads to storage, then marks `ready` with a download URL.
- Progress tracked via `GET /packs/:id`.

## Testing Plan (Minimum)

- Unit tests for access control rules (BuyerAccess filter).
- Route handler tests for request create/fulfill and pack create/status.
- UI smoke test for request list and fulfill modal.

## 8-Week Delivery Plan (4 Milestones)

1. Weeks 1-2: Core data model, Evidence Vault UI, request creation + fulfill flow.
2. Weeks 3-4: Access control, buyer views, audit log events, basic permissions.
3. Weeks 5-6: Pack export worker, storage integration, performance pass.
4. Weeks 7-8: Hardening (tests, analytics), polish, and release readiness.
