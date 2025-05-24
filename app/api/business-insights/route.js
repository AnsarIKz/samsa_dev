import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";
import OpenAIService from "@/lib/openai.js";

export async function GET() {
  try {
    // Get all analytics data
    const dashboardData = await DatabaseService.getDashboardStats();

    // Generate comprehensive business insights
    const insights = await OpenAIService.generateBusinessInsights(
      dashboardData
    );

    // Generate specific product recommendations
    const productRecommendations =
      await OpenAIService.generateProductRecommendations(
        dashboardData.analytics.topProducts,
        dashboardData.alerts.lowStock,
        dashboardData.analytics.turnoverAnalysis
      );

    // Generate expense optimization alerts
    const expenseAlert = await OpenAIService.generateExpenseAlert(
      dashboardData.alerts.highExpenses,
      dashboardData.analytics.monthlyExpensesByCategory
    );

    return NextResponse.json({
      success: true,
      data: {
        insights: insights.insights,
        productRecommendations: productRecommendations.recommendations,
        expenseAlert: expenseAlert.expenseAlert,
        tokensUsed:
          (insights.tokensUsed || 0) +
          (productRecommendations.tokensUsed || 0) +
          (expenseAlert.tokensUsed || 0),
        timestamp: new Date().toISOString(),
        analytics: {
          criticalAlerts: {
            lowStock: dashboardData.alerts.lowStock.length,
            highExpenses: dashboardData.alerts.highExpenses.length,
            lowTurnover: dashboardData.alerts.lowTurnoverProducts.length,
          },
          financialSummary: {
            revenue: dashboardData.revenue.total,
            expenses: dashboardData.expenses.total,
            profit: dashboardData.profit.amount,
            margin: dashboardData.profit.margin,
          },
        },
      },
    });
  } catch (error) {
    console.error("Business Insights API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate business insights",
        details: error.message,
        fallback: {
          insights:
            "❌ Не удалось подключиться к AI-аналитику. Проверьте настройки API ключа OpenAI.",
          productRecommendations:
            "🔧 Требуется настройка OpenAI API для рекомендаций по товарам.",
          expenseAlert: "⚙️ Настройте OpenAI API для анализа расходов.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    switch (type) {
      case "product-analysis":
        const productAnalysis =
          await OpenAIService.generateProductRecommendations(
            data.topProducts,
            data.lowStock,
            data.turnoverAnalysis
          );
        return NextResponse.json(productAnalysis);

      case "expense-analysis":
        const expenseAnalysis = await OpenAIService.generateExpenseAlert(
          data.highExpenses,
          data.monthlyExpenses
        );
        return NextResponse.json(expenseAnalysis);

      default:
        return NextResponse.json(
          { error: "Unknown analysis type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Business Insights POST error:", error);
    return NextResponse.json(
      { error: "Failed to process analysis request", details: error.message },
      { status: 500 }
    );
  }
}
