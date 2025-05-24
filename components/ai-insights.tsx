"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AIInsightsData {
  insights: string;
  productRecommendations: string;
  expenseAlert: string;
  tokensUsed: number;
  timestamp: string;
  analytics: {
    criticalAlerts: {
      lowStock: number;
      highExpenses: number;
      lowTurnover: number;
    };
    financialSummary: {
      revenue: number;
      expenses: number;
      profit: number;
      margin: number;
    };
  };
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/business-insights");
      const data = await response.json();

      if (data.success) {
        setInsights(data.data);
      } else {
        // Handle fallback case when API key is not configured
        setInsights({
          insights: data.fallback?.insights || "❌ Ошибка получения инсайтов",
          productRecommendations:
            data.fallback?.productRecommendations ||
            "❌ Ошибка получения рекомендаций",
          expenseAlert:
            data.fallback?.expenseAlert || "❌ Ошибка анализа расходов",
          tokensUsed: 0,
          timestamp: new Date().toISOString(),
          analytics: {
            criticalAlerts: { lowStock: 0, highExpenses: 0, lowTurnover: 0 },
            financialSummary: { revenue: 0, expenses: 0, profit: 0, margin: 0 },
          },
        });
        setError("Требуется настройка OpenAI API ключа");
      }
    } catch (err) {
      setError("Не удалось загрузить инсайты");
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const formatInsights = (text: string) => {
    if (!text) return [];

    // Split by sections and format
    const sections = text.split(/\d+\.\s\*\*([^*]+)\*\*/);
    const formatted: { title: string; content: string }[] = [];

    for (let i = 1; i < sections.length; i += 2) {
      const title = sections[i];
      const content = sections[i + 1]?.trim() || "";
      if (title && content) {
        formatted.push({ title, content });
      }
    }

    // If no sections found, return the whole text
    if (formatted.length === 0 && text) {
      return [{ title: "Анализ", content: text }];
    }

    return formatted;
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-blue-700">
            🤖 AI Бизнес-Аналитик
          </CardTitle>
          <CardDescription>Генерация инсайтов...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
            <div className="h-4 bg-blue-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main AI Insights */}
      <Card className="shadow-sm border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center text-blue-700">
                🤖 AI Бизнес-Аналитик
                {insights?.analytics && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {insights.analytics.criticalAlerts.lowStock +
                      insights.analytics.criticalAlerts.highExpenses +
                      insights.analytics.criticalAlerts.lowTurnover}{" "}
                    алертов
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-blue-600">
                Персональные рекомендации на основе ваших данных
              </CardDescription>
            </div>
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "..." : "🔄"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">⚠️ {error}</p>
              <p className="text-xs text-yellow-600 mt-1">
                Добавьте OPENAI_API_KEY в .env файл для полного функционала
              </p>
            </div>
          )}

          {insights?.insights && (
            <div className="space-y-4">
              {formatInsights(insights.insights).map((section, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {section.title}
                  </h4>
                  <div className="text-gray-700 text-sm whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {insights?.timestamp && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-blue-500">
                Обновлено:{" "}
                {new Date(insights.timestamp).toLocaleString("ru-RU")}
                {insights.tokensUsed > 0 &&
                  ` • Токенов использовано: ${insights.tokensUsed}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Recommendations */}
      {insights?.productRecommendations && (
        <Card className="shadow-sm border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-green-700">
              🛒 Рекомендации по товарам
            </CardTitle>
            <CardDescription className="text-green-600">
              Что покупать, что продавать, что продвигать
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 text-sm whitespace-pre-line">
              {insights.productRecommendations}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Alert */}
      {insights?.expenseAlert && (
        <Card className="shadow-sm border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-orange-700">
              💰 Анализ расходов
            </CardTitle>
            <CardDescription className="text-orange-600">
              Где экономить и оптимизировать траты
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-700 text-sm whitespace-pre-line">
              {insights.expenseAlert}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary */}
      {insights?.analytics?.financialSummary && (
        <Card className="shadow-sm border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-purple-700">
              📊 Финансовая сводка
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                <div className="text-lg font-bold text-green-600">
                  ₽
                  {insights.analytics.financialSummary.revenue?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Выручка</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                <div className="text-lg font-bold text-red-600">
                  ₽
                  {insights.analytics.financialSummary.expenses?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Расходы</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                <div
                  className={`text-lg font-bold ${
                    insights.analytics.financialSummary.profit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₽
                  {insights.analytics.financialSummary.profit?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Прибыль</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
                <div
                  className={`text-lg font-bold ${
                    insights.analytics.financialSummary.margin >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {insights.analytics.financialSummary.margin?.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">Маржа</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
