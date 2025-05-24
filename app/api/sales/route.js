import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";
export async function GET() {
  try {
    const sales = await DatabaseService.getAllSales();
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Sales API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}
