import OpenAI from "openai";

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "your_openai_api_key_here",
    });
  }

  async generateBusinessInsights(analyticsData) {
    try {
      const {
        revenue,
        orders,
        inventory,
        expenses,
        profit,
        analytics,
        alerts,
      } = analyticsData;

      const prompt = `Ты эксперт бизнес-аналитик. Проанализируй следующие данные моего бизнеса и дай конкретные рекомендации на русском языке:

**ФИНАНСОВЫЕ ПОКАЗАТЕЛИ:**
- Общая выручка: ₽${revenue?.total?.toLocaleString() || 0}
- Общие расходы: ₽${expenses?.total?.toLocaleString() || 0}
- Прибыль: ₽${profit?.amount?.toLocaleString() || 0}
- Маржинальность: ${profit?.margin?.toFixed(1) || 0}%

**ЗАКАЗЫ:**
- Всего заказов: ${orders?.total || 0}
- В ожидании: ${orders?.pending || 0}
- Выполнено: ${orders?.completed || 0}

**СКЛАД:**
- Товаров всего: ${inventory?.totalProducts || 0}
- Мало на складе: ${inventory?.lowStock || 0} товаров
- Стоимость склада: ₽${inventory?.totalValue?.toLocaleString() || 0}

**ПРОДАЖИ:**
- Топ товары: ${
        analytics?.topProducts
          ?.slice(0, 3)
          .map((p) => `${p.productName} (${p.totalQuantity} шт)`)
          .join(", ") || "нет данных"
      }
- Последние недельные продажи: ₽${
        analytics?.weeklySales?.[0]?.weeklySales?.toLocaleString() || 0
      }

**АЛЕРТЫ:**
- Товары с низким остатком: ${alerts?.lowStock?.length || 0}
- Крупные расходы (>₽1000): ${alerts?.highExpenses?.length || 0}
- Медленные товары (оборачиваемость <0.1): ${
        alerts?.lowTurnoverProducts?.length || 0
      }

**РАСХОДЫ ПО КАТЕГОРИЯМ:**
${
  expenses?.byCategory
    ?.slice(0, 5)
    .map((cat) => `- ${cat.Category}: ₽${cat.total?.toLocaleString()}`)
    .join("\n") || "нет данных"
}

**ОБОРАЧИВАЕМОСТЬ ТОВАРОВ (топ 5):**
${
  analytics?.turnoverAnalysis
    ?.slice(0, 5)
    .map(
      (item) =>
        `- ${item.productName}: ${item.turnoverRatio?.toFixed(2)} (продано: ${
          item.totalSold
        }, остаток: ${item.stockQuantity})`
    )
    .join("\n") || "нет данных"
}

Дай мне:
1. **КРИТИЧЕСКИЕ ПРОБЛЕМЫ** - что требует немедленного внимания
2. **ВОЗМОЖНОСТИ РОСТА** - где можно увеличить прибыль
3. **УПРАВЛЕНИЕ СКЛАДОМ** - что докупить, что не заказывать
4. **КОНТРОЛЬ РАСХОДОВ** - где экономить
5. **КОНКРЕТНЫЕ ДЕЙСТВИЯ** - что делать на этой неделе

Ответ должен быть кратким, конкретным и практичным. Используй эмодзи для визуального оформления.`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content:
              "Ты опытный бизнес-консультант, который дает четкие и практичные рекомендации на основе финансовых данных. Отвечай кратко и по делу.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      return {
        insights:
          completion.choices[0]?.message?.content ||
          "Не удалось сгенерировать инсайты",
        tokensUsed: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("OpenAI Service Error:", error);
      return {
        insights: `❌ Ошибка генерации инсайтов: ${error.message}`,
        error: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async generateProductRecommendations(
    topProducts,
    lowStock,
    turnoverAnalysis
  ) {
    try {
      const prompt = `Проанализируй товарные данные и дай рекомендации о закупках:

**ТОП ПРОДАВАЕМЫЕ ТОВАРЫ:**
${
  topProducts
    ?.slice(0, 5)
    .map(
      (p) =>
        `- ${p.productName}: ${
          p.totalQuantity
        } шт (₽${p.totalSales?.toLocaleString()})`
    )
    .join("\n") || "нет данных"
}

**ТОВАРЫ С НИЗКИМ ОСТАТКОМ:**
${
  lowStock
    ?.slice(0, 5)
    .map(
      (item) =>
        `- ${item.productName}: остаток ${item.stockQuantity}, нужно ${item.restockThreshold}`
    )
    .join("\n") || "нет товаров"
}

**МЕДЛЕННЫЕ ТОВАРЫ (низкая оборачиваемость):**
${
  turnoverAnalysis
    ?.filter((item) => item.turnoverRatio < 0.1)
    .slice(0, 5)
    .map(
      (item) =>
        `- ${item.productName}: оборот ${item.turnoverRatio?.toFixed(
          3
        )}, остаток ${item.stockQuantity}`
    )
    .join("\n") || "нет медленных товаров"
}

Дай рекомендации:
1. 🛒 Что срочно докупить
2. ⚠️ Что не заказывать (медленные товары)
3. 📈 На что делать упор в продажах
4. 💡 Идеи по продвижению медленных товаров`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content: "Ты эксперт по управлению товарными запасами и продажам.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.6,
      });

      return {
        recommendations:
          completion.choices[0]?.message?.content ||
          "Не удалось сгенерировать рекомендации",
        tokensUsed: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Product Recommendations Error:", error);
      return {
        recommendations: `❌ Ошибка: ${error.message}`,
        error: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async generateExpenseAlert(highExpenses, monthlyExpensesByCategory) {
    try {
      const prompt = `Проанализируй расходы и дай рекомендации по оптимизации:

**КРУПНЫЕ РАСХОДЫ (>₽1000):**
${
  highExpenses
    ?.slice(0, 5)
    .map(
      (exp) =>
        `- ${
          exp.description || "Без описания"
        }: ₽${exp.amount?.toLocaleString()} (${exp.category}, ${exp.date})`
    )
    .join("\n") || "нет крупных расходов"
}

**РАСХОДЫ ПО МЕСЯЦАМ И КАТЕГОРИЯМ:**
${
  monthlyExpensesByCategory
    ?.slice(0, 10)
    .map(
      (exp) =>
        `- ${exp.month} / ${
          exp.category
        }: ₽${exp.totalExpense?.toLocaleString()}`
    )
    .join("\n") || "нет данных"
}

Дай рекомендации:
1. 🔍 Где можно сэкономить
2. ⚠️ Подозрительные траты
3. 📊 Тренды расходов
4. 💰 План оптимизации`;

      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
            role: "system",
            content:
              "Ты финансовый консультант, специализирующийся на контроле расходов бизнеса.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 700,
        temperature: 0.5,
      });

      return {
        expenseAlert:
          completion.choices[0]?.message?.content ||
          "Не удалось проанализировать расходы",
        tokensUsed: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Expense Alert Error:", error);
      return {
        expenseAlert: `❌ Ошибка: ${error.message}`,
        error: true,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default new OpenAIService();
