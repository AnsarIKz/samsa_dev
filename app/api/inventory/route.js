import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    await DatabaseService.connect();
    const inventory = await DatabaseService.getAllInventory();
    await DatabaseService.close();

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Inventory API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}
