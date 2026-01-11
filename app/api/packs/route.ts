import { NextResponse } from "next/server";
import { createPack } from "@/lib/server/mock-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { buyerId, items } = body as {
    buyerId?: string;
    items?: { evidenceId?: string; versionIds?: string[] }[];
  };

  if (!buyerId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "buyerId and items are required." },
      { status: 400 }
    );
  }

  const normalizedItems = items.map((item) => ({
    evidenceId: item.evidenceId ?? "",
    versionIds: Array.isArray(item.versionIds) ? item.versionIds : [],
  }));

  const hasInvalid = normalizedItems.some(
    (item) => !item.evidenceId || item.versionIds.length === 0
  );
  if (hasInvalid) {
    return NextResponse.json(
      { error: "Each item requires evidenceId and versionIds." },
      { status: 400 }
    );
  }

  const pack = createPack({ buyerId, items: normalizedItems });
  return NextResponse.json({ pack }, { status: 201 });
}
