import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";
export async function GET() {
  try {
    const lowStockItems = await DatabaseService.getLowStockItems();
    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error("Low stock API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch low stock data" },
      { status: 500 }
    );
  }
}
