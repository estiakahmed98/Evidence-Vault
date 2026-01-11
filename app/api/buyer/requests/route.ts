import { NextResponse } from "next/server";
import { listRequests } from "@/lib/server/mock-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId");

  if (!buyerId) {
    return NextResponse.json(
      { error: "buyerId query param is required." },
      { status: 400 }
    );
  }

  const requests = listRequests({ buyerId });
  return NextResponse.json({ requests });
}
