import { NextResponse } from "next/server";
import { getBuyerEvidence } from "@/lib/server/mock-store";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId) {
    return NextResponse.json(
      { error: "buyerId query param is required." },
      { status: 400 }
    );
  }

  const result = getBuyerEvidence(buyerId, params.id);
  if (!result) {
    return NextResponse.json({ error: "Evidence not found." }, { status: 404 });
  }

  if (result.versions.length === 0) {
    return NextResponse.json(
      { error: "No shared versions available for this buyer." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    evidence: result.evidence,
    versions: result.versions,
  });
}
