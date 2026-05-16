import { NextRequest, NextResponse } from "next/server";
import { parsePlayerFilters, queryPlayers } from "@/lib/players";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const filters = parsePlayerFilters(request.nextUrl.searchParams);
    const result = await queryPlayers(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/players]", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
