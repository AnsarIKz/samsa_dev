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
    lowStockAlert: number;
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
        {" "}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm border-gray-200">
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="animate-pulse">
                {" "}
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>{" "}
                <div className="h-20 bg-gray-200 rounded"></div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        ))}{" "}
      </div>
    );
  }

  const revenueData = dashboardData?.revenue?.data?.slice(0, 6).reverse() || [];
  const maxRevenue = Math.max(...(revenueData.map((d) => d.revenue) || [1]));

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
            {dashboardData?.analytics?.weeklySales?.length > 0
              ? dashboardData.analytics.weeklySales
                  .slice(0, 8)
                  .reverse()
                  .map((item, index) => {
                    const maxSales = Math.max(
                      ...dashboardData.analytics.weeklySales
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
                          title={`Неделя ${weekNum}: ₽${item.weeklySales?.toLocaleString()}`}
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
              ₽
              {dashboardData?.analytics?.weeklySales?.[0]?.weeklySales?.toLocaleString() ||
                "0"}
            </span>
            <p className="text-sm text-gray-600 mt-1">Последняя неделя</p>
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
                        ₽{product.totalSales?.toLocaleString()}
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
              <div className="text-center text-gray-500 py-4">
                Нет данных о товарах
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Выручка</CardTitle>
          <CardDescription>Данные по месяцам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-3 mb-4">
            {revenueData.length > 0
              ? revenueData.map((item, index) => {
                  const height =
                    maxRevenue > 0 ? (item.revenue / maxRevenue) * 200 : 20;
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
                        title={`${monthName}: ₽${item.revenue?.toLocaleString()}`}
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
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <span className="text-2xl font-bold text-green-600">
              ₽{dashboardData?.revenue?.total?.toLocaleString() || "0"}
            </span>
            <p className="text-sm text-gray-600 mt-1">Общая выручка</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Ключевые метрики</CardTitle>
          <CardDescription>Текущие данные</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {dashboardData?.orders?.total || 0}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Всего заказов
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                ₽{dashboardData?.revenue?.total?.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-green-600 font-medium">Продажи</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {dashboardData?.inventory?.totalProducts || 0}
              </div>
              <div className="text-sm text-purple-600 font-medium">Товаров</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">
                ₽
                {Math.round(
                  dashboardData?.profit?.amount || 0
                ).toLocaleString()}
              </div>
              <div className="text-sm text-orange-600 font-medium">Прибыль</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center">
            <span>🚨 Товары на исходе</span>
            {dashboardData?.analytics?.lowStockAlert > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                {dashboardData.analytics.lowStockAlert}
              </span>
            )}
          </CardTitle>
          <CardDescription>Требует пополнения</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData?.inventory?.lowStockItems
              ?.slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {item.productName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Остаток: {item.stockQuantity} | Лимит:{" "}
                      {item.restockThreshold}
                    </div>
                  </div>
                  <div className="text-red-600 font-bold">⚠️</div>
                </div>
              )) || (
              <div className="text-center text-green-600 py-4 bg-green-50 rounded-lg">
                ✅ Все товары в достатке
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expenses by Category */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Расходы по категориям</CardTitle>
          <CardDescription>Топ категорий расходов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.expenses?.byCategory
              ?.slice(0, 5)
              .map((category, index) => {
                const total = dashboardData.expenses.total;
                const percentage =
                  total > 0 ? (category.total / total) * 100 : 0;
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
                      <span className="text-sm font-medium text-gray-700">
                        {category.Category}
                      </span>
                      <span className="text-sm text-gray-500 font-semibold">
                        ₽{category.total?.toLocaleString()} (
                        {percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${
                          colors[index % colors.length]
                        } h-3 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              }) || (
              <div className="text-center text-gray-500 py-4">
                Нет данных о расходах
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Status */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Статус заказов</CardTitle>
          <CardDescription>Текущее состояние</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  Выполненные заказы
                </div>
                <div className="text-xs text-gray-500">
                  {dashboardData?.orders?.completed || 0} заказов
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  Ожидающие заказы
                </div>
                <div className="text-xs text-gray-500">
                  {dashboardData?.orders?.pending || 0} заказов
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  Мало товара на складе
                </div>
                <div className="text-xs text-gray-500">
                  {dashboardData?.inventory?.lowStock || 0} позиций
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
