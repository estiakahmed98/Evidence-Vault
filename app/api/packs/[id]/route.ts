import { NextResponse } from "next/server";
import { getPack } from "@/lib/server/mock-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const pack = getPack(params.id);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found." }, { status: 404 });
  }

  return NextResponse.json({
    pack: {
      id: pack.id,
      status: pack.status,
      createdAt: pack.createdAt,
      readyAt: pack.readyAt,
      downloadUrl: pack.downloadUrl,
    },
  });
}
