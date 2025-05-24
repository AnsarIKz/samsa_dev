import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    await DatabaseService.connect();
    const analytics = await DatabaseService.getSalesAnalytics();
    await DatabaseService.close();

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
