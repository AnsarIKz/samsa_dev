import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    const profitExpenseData = await DatabaseService.getProfitExpenseAnalysis();
    return NextResponse.json(profitExpenseData);
  } catch (error) {
    console.error("Profit expense API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profit expense data" },
      { status: 500 }
    );
  }
}
