import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    await DatabaseService.connect();
    const dashboardStats = await DatabaseService.getDashboardStats();
    await DatabaseService.close();

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
