# Change Request: Buyer Access Limited to Shared Versions

## What Changed

- Added an in-memory access registry that tracks which evidence versions are shared with a buyer.
- Fulfillment and pack creation now grant access for specific version IDs.
- Buyer evidence endpoint filters versions and returns 403 when nothing is shared.

## Where

- Access registry + filtering helpers: `lib/server/mock-store.ts`
- Fulfill flow grants access: `app/api/requests/[id]/fulfill/route.ts`
- Pack creation grants access: `app/api/packs/route.ts`
- Buyer evidence reads only shared versions: `app/api/buyer/evidence/[id]/route.ts`
