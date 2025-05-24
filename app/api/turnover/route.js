import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    const turnoverData = await DatabaseService.getTurnoverAnalysis();
    return NextResponse.json(turnoverData);
  } catch (error) {
    console.error("Turnover API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch turnover data" },
      { status: 500 }
    );
  }
}
