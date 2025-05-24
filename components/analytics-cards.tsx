"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AnalyticsCards() {
  return (
    <div className="space-y-6 pr-4">
      {/* Revenue Chart */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Выручка</CardTitle>
          <CardDescription>Последние 6 месяцев</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-3 mb-4">
            {[65, 45, 78, 52, 89, 67].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md w-full transition-all hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${(value / 100) * 200}px` }}
                />
                <span className="text-xs text-gray-500 mt-2 font-medium">
                  {["Янв", "Фев", "Мар", "Апр", "Май", "Июн"][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <span className="text-2xl font-bold text-green-600">+12.5%</span>
            <p className="text-sm text-gray-600 mt-1">
              по сравнению с прошлым периодом
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Ключевые метрики</CardTitle>
          <CardDescription>Сегодня</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">1,247</div>
              <div className="text-sm text-blue-600 font-medium">
                Новых клиентов
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">₽2.1M</div>
              <div className="text-sm text-green-600 font-medium">Продажи</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">94.2%</div>
              <div className="text-sm text-purple-600 font-medium">
                Удержание
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">₽312</div>
              <div className="text-sm text-orange-600 font-medium">
                Средний чек
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales by Category */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Продажи по категориям</CardTitle>
          <CardDescription>Топ-5 категорий</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Электроника", value: 45, color: "bg-blue-500" },
              { name: "Одежда", value: 30, color: "bg-green-500" },
              { name: "Дом и сад", value: 15, color: "bg-purple-500" },
              { name: "Спорт", value: 8, color: "bg-orange-500" },
              { name: "Книги", value: 2, color: "bg-red-500" },
            ].map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-500 font-semibold">
                    {category.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${category.color} h-3 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Последняя активность</CardTitle>
          <CardDescription>События за сегодня</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "14:30", event: "Новый заказ #1247", type: "success" },
              { time: "13:15", event: "Возврат товара #1201", type: "warning" },
              { time: "12:45", event: "Пополнение склада", type: "info" },
              { time: "11:20", event: "Отмена заказа #1190", type: "error" },
              {
                time: "10:30",
                event: "Новый клиент зарегистрирован",
                type: "success",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                      ? "bg-yellow-500"
                      : activity.type === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">
                    {activity.event}
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
