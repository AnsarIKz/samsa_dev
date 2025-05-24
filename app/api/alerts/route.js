import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";

export async function GET() {
  try {
    const [lowStock, highExpenses, turnoverAnalysis] = await Promise.all([
      DatabaseService.getLowStockItems(),
      DatabaseService.getHighExpenses(),
      DatabaseService.getTurnoverAnalysis(),
    ]);

    const lowTurnoverProducts = turnoverAnalysis.filter(
      (item) => item.turnoverRatio < 0.1
    );

    const alerts = {
      lowStock: {
        items: lowStock,
        count: lowStock.length,
        severity:
          lowStock.length > 5 ? "high" : lowStock.length > 2 ? "medium" : "low",
      },
      highExpenses: {
        items: highExpenses,
        count: highExpenses.length,
        severity:
          highExpenses.length > 3
            ? "high"
            : highExpenses.length > 1
            ? "medium"
            : "low",
      },
      lowTurnover: {
        items: lowTurnoverProducts,
        count: lowTurnoverProducts.length,
        severity:
          lowTurnoverProducts.length > 10
            ? "high"
            : lowTurnoverProducts.length > 5
            ? "medium"
            : "low",
      },
    };

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Alerts API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts data" },
      { status: 500 }
    );
  }
}
