import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";
export async function GET() {
  try {
    const analytics = await DatabaseService.getSalesAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
