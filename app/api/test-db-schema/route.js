import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    // Check table schema
    const tableSchema = await DatabaseService.executeWithConnection(() =>
      DatabaseService.query("PRAGMA table_info(expenses)")
    );

    // Get a sample of raw data to see actual column names
    const sampleData = await DatabaseService.executeWithConnection(() =>
      DatabaseService.query("SELECT * FROM expenses LIMIT 1")
    );

    return NextResponse.json({
      message: "Database schema info",
      expensesSchema: tableSchema,
      sampleExpense: sampleData[0] || null,
      sampleKeys: sampleData[0] ? Object.keys(sampleData[0]) : [],
    });
  } catch (error) {
    console.error("Schema API error:", error);
    return NextResponse.json(
      { error: "Failed to check schema", details: error.message },
      { status: 500 }
    );
  }
}
