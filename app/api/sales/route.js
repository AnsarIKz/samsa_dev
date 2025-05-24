import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    await DatabaseService.connect();
    const sales = await DatabaseService.getAllSales();
    await DatabaseService.close();

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Sales API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}
