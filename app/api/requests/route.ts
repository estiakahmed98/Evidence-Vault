import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/lib/server/mock-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId");
  const factoryId = searchParams.get("factoryId");
  const requests = listRequests({ buyerId, factoryId });
  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { buyerId, factoryId, docType, dueDate } = body as {
    buyerId?: string;
    factoryId?: string;
    docType?: string;
    dueDate?: string;
  };

  const allowedDocTypes = [
    "Certificate",
    "License",
    "Report",
    "Document",
  ] as const;

  if (!buyerId || !factoryId || !docType || !dueDate) {
    return NextResponse.json(
      { error: "buyerId, factoryId, docType, and dueDate are required." },
      { status: 400 }
    );
  }

  if (!allowedDocTypes.includes(docType as (typeof allowedDocTypes)[number])) {
    return NextResponse.json(
      { error: "docType must be Certificate, License, Report, or Document." },
      { status: 400 }
    );
  }

  const requestRecord = createRequest({
    buyerId,
    factoryId,
    docType: docType as (typeof allowedDocTypes)[number],
    dueDate,
  });

  return NextResponse.json({ request: requestRecord }, { status: 201 });
}
