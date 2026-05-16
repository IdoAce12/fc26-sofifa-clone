import { NextResponse } from "next/server";
import { queryFilterOptions } from "@/lib/players";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const options = await queryFilterOptions();
    return NextResponse.json(options);
  } catch (error) {
    console.error("[api/filters]", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
