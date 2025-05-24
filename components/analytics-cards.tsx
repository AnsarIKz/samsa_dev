"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardData {
  revenue: {
    total: number;
    data: Array<{
      month: string;
      revenue: number;
      transactions: number;
    }>;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
  inventory: {
    totalProducts: number;
    lowStock: number;
    totalValue: number;
    lowStockItems: Array<{
      productName: string;
      stockQuantity: number;
      restockThreshold: number;
    }>;
  };
  expenses: {
    total: number;
    byCategory: Array<{
      Category: string;
      total: number;
    }>;
  };
  profit: {
    amount: number;
    margin: number;
  };
  analytics: {
    topProducts: Array<{
      productName: string;
      totalQuantity: number;
      totalSales: number;
    }>;
    weeklySales: Array<{
      week: string;
      weeklySales: number;
    }>;
    weeklyProductSales: Array<{
      week: string;
      productName: string;
      totalQuantity: number;
    }>;
    turnoverAnalysis: Array<{
      productName: string;
      totalSold: number;
      stockQuantity: number;
      turnoverRatio: number;
    }>;
    profitExpenseAnalysis: Array<{
      month: string;
      totalSales: number;
      totalExpenses: number;
      profit: number;
    }>;
    monthlyExpensesByCategory: Array<{
      month: string;
      category: string;
      totalExpense: number;
    }>;
    lowStockAlert: number;
    highExpensesAlert: number;
  };
  alerts?: {
    lowStock: Array<{
      productName: string;
      stockQuantity: number;
      restockThreshold: number;
    }>;
    highExpenses: Array<{
      expenseId: string;
      date: string;
      category: string;
      description: string;
      amount: number;
    }>;
    lowTurnoverProducts: Array<{
      productName: string;
      totalSold: number;
      stockQuantity: number;
      turnoverRatio: number;
    }>;
  };
}

export function AnalyticsCards() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 pr-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pr-4">
      {/* Weekly Sales Chart */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Недельные продажи</CardTitle>
          <CardDescription>Данные за последние 12 недель</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2 mb-4">
            {dashboardData?.analytics?.weeklySales &&
            dashboardData.analytics.weeklySales.length > 0
              ? dashboardData.analytics.weeklySales
                  .slice(0, 8)
                  .reverse()
                  .map((item, index) => {
                    const maxSales = Math.max(
                      ...(dashboardData?.analytics?.weeklySales || [])
                        .slice(0, 8)
                        .map((d) => d.weeklySales)
                    );
                    const height =
                      maxSales > 0 ? (item.weeklySales / maxSales) * 200 : 20;
                    const weekNum = item.week.split("-")[1];

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md w-full transition-all hover:from-purple-700 hover:to-purple-500"
                          style={{ height: `${height}px` }}
                          title={`Неделя ${weekNum}: $${item.weeklySales?.toLocaleString()}`}
                        />
                        <span className="text-xs text-gray-500 mt-2 font-medium">
                          {weekNum}н
                        </span>
                      </div>
                    );
                  })
              : [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="bg-gray-200 rounded-t-md w-full h-10" />
                    <span className="text-xs text-gray-400 mt-2">--</span>
                  </div>
                ))}
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <span className="text-2xl font-bold text-purple-600">
              $
              {dashboardData?.analytics?.weeklySales?.[0]?.weeklySales?.toLocaleString() ||
                "0"}
            </span>
            <p className="text-sm text-gray-600 mt-1">Последняя неделя</p>
          </div>
        </CardContent>
      </Card>

      {/* Profit vs Expenses Chart */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Прибыль и расходы</CardTitle>
          <CardDescription>Помесячная динамика</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2 mb-4">
            {dashboardData?.analytics?.profitExpenseAnalysis &&
            dashboardData.analytics.profitExpenseAnalysis.length > 0
              ? dashboardData.analytics.profitExpenseAnalysis
                  .slice(0, 6)
                  .reverse()
                  .map((item, index) => {
                    const maxValue = Math.max(
                      ...(dashboardData?.analytics?.profitExpenseAnalysis || [])
                        .slice(0, 6)
                        .map((d) => Math.max(d.totalSales, d.totalExpenses))
                    );
                    const salesHeight =
                      maxValue > 0 ? (item.totalSales / maxValue) * 180 : 20;
                    const expensesHeight =
                      maxValue > 0 ? (item.totalExpenses / maxValue) * 180 : 20;
                    const monthName = new Date(
                      item.month + "-01"
                    ).toLocaleDateString("ru", { month: "short" });

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center space-y-1"
                      >
                        <div className="w-full flex space-x-1 items-end">
                          <div
                            className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-md flex-1"
                            style={{ height: `${salesHeight}px` }}
                            title={`Продажи: $${item.totalSales?.toLocaleString()}`}
                          />
                          <div
                            className="bg-gradient-to-t from-red-600 to-red-400 rounded-t-md flex-1"
                            style={{ height: `${expensesHeight}px` }}
                            title={`Расходы: $${item.totalExpenses?.toLocaleString()}`}
                          />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {monthName}
                        </span>
                        <div className="text-xs text-center">
                          <div
                            className={`font-semibold ${
                              item.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${item.profit?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })
              : [1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="bg-gray-200 rounded-t-md w-full h-10" />
                    <span className="text-xs text-gray-400 mt-2">--</span>
                  </div>
                ))}
          </div>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Продажи</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Расходы</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Топ товары</CardTitle>
          <CardDescription>Лидеры продаж по количеству</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData?.analytics?.topProducts?.map((product, index) => {
              const maxQuantity = Math.max(
                ...(dashboardData.analytics.topProducts.map(
                  (p) => p.totalQuantity
                ) || [1])
              );
              const percentage =
                maxQuantity > 0
                  ? (product.totalQuantity / maxQuantity) * 100
                  : 0;
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-purple-500",
                "bg-orange-500",
                "bg-red-500",
              ];

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      #{index + 1} {product.productName}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-gray-900 font-semibold">
                        {product.totalQuantity} шт
                      </div>
                      <div className="text-xs text-gray-500">
                        ${product.totalSales?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${
                        colors[index % colors.length]
                      } h-2 rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            }) || (
              <div className="text-center text-gray-500 py-8">
                Нет данных о товарах
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Выручка по месяцам</CardTitle>
          <CardDescription>Динамика доходов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between space-x-2 mb-4">
            {dashboardData?.revenue?.data &&
            dashboardData.revenue.data.length > 0
              ? dashboardData.revenue.data
                  .slice(0, 6)
                  .reverse()
                  .map((item, index) => {
                    const maxRevenue = Math.max(
                      ...(dashboardData?.revenue?.data || [])
                        .slice(0, 6)
                        .map((d) => d.revenue)
                    );
                    const height =
                      maxRevenue > 0 ? (item.revenue / maxRevenue) * 160 : 20;
                    const monthName = new Date(
                      item.month + "-01"
                    ).toLocaleDateString("ru", { month: "short" });

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md w-full transition-all hover:from-blue-700 hover:to-blue-500"
                          style={{ height: `${height}px` }}
                          title={`${monthName}: $${item.revenue?.toLocaleString()}`}
                        />
                        <span className="text-xs text-gray-500 mt-2 font-medium">
                          {monthName}
                        </span>
                      </div>
                    );
                  })
              : [1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="bg-gray-200 rounded-t-md w-full h-10" />
                    <span className="text-xs text-gray-400 mt-2">--</span>
                  </div>
                ))}
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <span className="text-2xl font-bold text-blue-600">
              ${dashboardData?.revenue?.total?.toLocaleString() || "0"}
            </span>
            <p className="text-sm text-gray-600 mt-1">Общая выручка</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
