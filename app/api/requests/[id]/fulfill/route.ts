import { NextResponse } from "next/server";
import { fulfillRequest } from "@/lib/server/mock-store";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { evidenceId, versionIds } = body as {
    evidenceId?: string;
    versionIds?: string[];
  };

  if (!evidenceId || !Array.isArray(versionIds) || versionIds.length === 0) {
    return NextResponse.json(
      { error: "evidenceId and versionIds are required." },
      { status: 400 }
    );
  }

  const updated = fulfillRequest(params.id, evidenceId, versionIds);
  if (!updated) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  return NextResponse.json({ request: updated });
}
