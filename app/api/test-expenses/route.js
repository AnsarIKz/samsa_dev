import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    // Test the raw expenses data structure
    const allExpenses = await DatabaseService.getAllExpenses();
    const expensesSample = allExpenses.slice(0, 3); // First 3 records

    // Test high expenses specifically
    const highExpenses = await DatabaseService.getHighExpenses();

    return NextResponse.json({
      message: "Expenses test data",
      totalExpenses: allExpenses.length,
      sampleExpenses: expensesSample,
      highExpenses: highExpenses,
      columnsInFirstExpense: expensesSample[0]
        ? Object.keys(expensesSample[0])
        : [],
    });
  } catch (error) {
    console.error("Test expenses API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test expenses", details: error.message },
      { status: 500 }
    );
  }
}
