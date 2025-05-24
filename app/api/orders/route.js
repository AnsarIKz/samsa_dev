import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    await DatabaseService.connect();
    const orders = await DatabaseService.getAllOrders();
    await DatabaseService.close();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders data" },
      { status: 500 }
    );
  }
}
