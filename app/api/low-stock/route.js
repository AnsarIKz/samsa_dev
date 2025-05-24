import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    await DatabaseService.connect();
    const lowStockItems = await DatabaseService.getLowStockItems();
    await DatabaseService.close();

    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error("Low stock API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch low stock data" },
      { status: 500 }
    );
  }
}
