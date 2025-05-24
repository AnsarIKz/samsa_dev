import { NextResponse } from "next/server";
import DatabaseService from "@/lib/database.js";
import OpenAIService from "@/lib/openai.js";

class ChatService {
  constructor() {
    this.openaiService = OpenAIService;
  }

  async generateChatResponse(userMessage, dashboardData) {
    try {
      const contextPrompt = `Ты AI-ассистент для бизнес-аналитики. У тебя есть доступ к следующим данным бизнеса:

**ФИНАНСОВЫЕ ПОКАЗАТЕЛИ:**
- Общая выручка: ₽${dashboardData.revenue?.total?.toLocaleString() || 0}
- Общие расходы: ₽${dashboardData.expenses?.total?.toLocaleString() || 0}
- Прибыль: ₽${dashboardData.profit?.amount?.toLocaleString() || 0}
- Маржинальность: ${dashboardData.profit?.margin?.toFixed(1) || 0}%

**ТОВАРЫ И СКЛАД:**
- Товаров всего: ${dashboardData.inventory?.totalProducts || 0}
- Товары с низким остатком: ${dashboardData.alerts?.lowStock?.length || 0}
- Топ товары: ${
        dashboardData.analytics?.topProducts
          ?.slice(0, 3)
          .map((p) => `${p.productName} (${p.totalQuantity} шт)`)
          .join(", ") || "нет данных"
      }

**ЗАКАЗЫ:**
- Всего заказов: ${dashboardData.orders?.total || 0}
- В ожидании: ${dashboardData.orders?.pending || 0}
- Выполнено: ${dashboardData.orders?.completed || 0}

**АКТУАЛЬНЫЕ АЛЕРТЫ:**
- Товары на исходе: ${
        dashboardData.alerts?.lowStock
          ?.slice(0, 3)
          .map((item) => `${item.productName} (остаток: ${item.stockQuantity})`)
          .join(", ") || "все в норме"
      }
- Крупные расходы: ${
        dashboardData.alerts?.highExpenses?.length || 0
      } трат свыше ₽1000
- Медленные товары: ${
        dashboardData.alerts?.lowTurnoverProducts?.length || 0
      } с низкой оборачиваемостью

**ПОСЛЕДНИЕ НЕДЕЛЬНЫЕ ПРОДАЖИ:** ₽${
        dashboardData.analytics?.weeklySales?.[0]?.weeklySales?.toLocaleString() ||
        0
      }

Отвечай на русском языке, конкретно и по делу. Используй эмодзи. Если пользователь спрашивает о данных, которые у тебя есть - отвечай точно на основе этих данных. Если данных нет - так и скажи.

Пользователь спрашивает: "${userMessage}"

Дай краткий и полезный ответ:`;

      const completion =
        await this.openaiService.client.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "system",
              content:
                "Ты опытный бизнес-аналитик, который помогает владельцам бизнеса понимать их данные и принимать решения. Отвечай кратко, конкретно и по делу.",
            },
            {
              role: "user",
              content: contextPrompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

      return {
        response:
          completion.choices[0]?.message?.content ||
          "Извините, не смог обработать ваш запрос.",
        tokensUsed: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Chat Service Error:", error);

      // Fallback responses when OpenAI is not available
      const fallbackResponses = this.getFallbackResponse(
        userMessage,
        dashboardData
      );

      return {
        response: fallbackResponses,
        error: true,
        fallback: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  getFallbackResponse(userMessage, dashboardData) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("товар") || lowerMessage.includes("продукт")) {
      const topProduct = dashboardData.analytics?.topProducts?.[0];
      if (topProduct) {
        return `📊 Самый популярный товар: ${topProduct.productName} (${topProduct.totalQuantity} шт продано)`;
      }
      return "📦 Нет данных о товарах для анализа";
    }

    if (lowerMessage.includes("продаж") || lowerMessage.includes("выручк")) {
      return `💰 Общая выручка: ₽${
        dashboardData.revenue?.total?.toLocaleString() || 0
      }. Последние недельные продажи: ₽${
        dashboardData.analytics?.weeklySales?.[0]?.weeklySales?.toLocaleString() ||
        0
      }`;
    }

    if (lowerMessage.includes("склад") || lowerMessage.includes("остатк")) {
      const lowStockCount = dashboardData.alerts?.lowStock?.length || 0;
      if (lowStockCount > 0) {
        return `⚠️ Внимание! ${lowStockCount} товаров заканчиваются на складе. Требуется пополнение!`;
      }
      return "✅ Склад в порядке, критически низких остатков нет";
    }

    if (lowerMessage.includes("прибыл") || lowerMessage.includes("расход")) {
      const profit = dashboardData.profit?.amount || 0;
      const margin = dashboardData.profit?.margin || 0;
      return `📈 Прибыль: ₽${profit.toLocaleString()}, маржинальность: ${margin.toFixed(
        1
      )}%`;
    }

    if (lowerMessage.includes("заказ")) {
      const total = dashboardData.orders?.total || 0;
      const pending = dashboardData.orders?.pending || 0;
      return `📋 Всего заказов: ${total}, в обработке: ${pending}`;
    }

    // Default response
    return `🤖 Для полного функционала AI-чата настройте OpenAI API ключ. Пока могу показать базовую статистику:
    
💰 Выручка: ₽${dashboardData.revenue?.total?.toLocaleString() || 0}
📦 Товаров: ${dashboardData.inventory?.totalProducts || 0}
📋 Заказов: ${dashboardData.orders?.total || 0}
⚠️ Алертов: ${
      (dashboardData.alerts?.lowStock?.length || 0) +
      (dashboardData.alerts?.highExpenses?.length || 0)
    }`;
  }
}

const chatService = new ChatService();

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({
        success: false,
        error: "Message is required",
        response: "❌ Сообщение не может быть пустым",
        fallback: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Get current dashboard data for context
    const dashboardData = await DatabaseService.getDashboardStats();

    // Generate AI response
    const result = await chatService.generateChatResponse(
      message,
      dashboardData
    );

    return NextResponse.json({
      success: true,
      response: result.response,
      tokensUsed: result.tokensUsed || 0,
      fallback: result.fallback || false,
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error("AI Chat API error:", error);

    // Always return JSON with success: false, never let it fall through to HTML error page
    return NextResponse.json({
      success: false,
      error: "Failed to process chat message",
      response:
        "❌ Извините, произошла ошибка. Попробуйте позже или проверьте настройки OpenAI API.",
      fallback: true,
      timestamp: new Date().toISOString(),
    });
  }
}
