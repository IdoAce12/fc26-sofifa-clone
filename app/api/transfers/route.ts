import { NextRequest, NextResponse } from "next/server";
import { generateTransferRecommendations } from "@/lib/scoutingEngine";

export async function GET(request: NextRequest) {
  try {
    const club = request.nextUrl.searchParams.get("club")?.trim();

    if (!club) {
      return NextResponse.json(
        { error: "Missing required query parameter: club" },
        { status: 400 },
      );
    }

    const result = await generateTransferRecommendations(club);

    if (!result) {
      return NextResponse.json(
        { error: `No squad found for club "${club}"` },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/transfers]", error);
    return NextResponse.json(
      { error: "Failed to generate transfer recommendations" },
      { status: 500 },
    );
  }
}
