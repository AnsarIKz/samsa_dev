"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DatabaseStats {
  tables: {
    name: string;
    recordCount: number;
    lastModified: string;
  }[];
  totalRecords: number;
  databaseSize: string;
}

interface SystemInfo {
  version: string;
  lastBackup: string;
  uptime: string;
  performance: {
    avgResponseTime: number;
    errorRate: number;
    activeConnections: number;
  };
}

export default function SettingsPage() {
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(
    null
  );
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettingsData() {
      try {
        // Fetch data from all API endpoints to get database stats
        const [salesRes, ordersRes, inventoryRes] = await Promise.all([
          fetch("/api/sales"),
          fetch("/api/orders"),
          fetch("/api/inventory"),
        ]);

        const [salesData, ordersData, inventoryData] = await Promise.all([
          salesRes.json(),
          ordersRes.json(),
          inventoryRes.json(),
        ]);

        // Calculate database statistics
        const tables = [
          {
            name: "sales",
            recordCount: salesData.length,
            lastModified:
              salesData.length > 0
                ? new Date(
                    Math.max(
                      ...salesData.map((s: any) => new Date(s.Date).getTime())
                    )
                  ).toISOString()
                : new Date().toISOString(),
          },
          {
            name: "orders",
            recordCount: ordersData.length,
            lastModified:
              ordersData.length > 0
                ? new Date(
                    Math.max(
                      ...ordersData.map((o: any) => new Date(o.Date).getTime())
                    )
                  ).toISOString()
                : new Date().toISOString(),
          },
          {
            name: "inventory",
            recordCount: inventoryData.length,
            lastModified: new Date().toISOString(), // No date field in inventory
          },
        ];

        setDatabaseStats({
          tables,
          totalRecords: tables.reduce(
            (sum, table) => sum + table.recordCount,
            0
          ),
          databaseSize: "2.4 MB", // Estimated
        });

        // Mock system info
        setSystemInfo({
          version: "1.0.0",
          lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          uptime: "7 дней 12 часов",
          performance: {
            avgResponseTime: 150,
            errorRate: 0.1,
            activeConnections: 5,
          },
        });
      } catch (error) {
        console.error("Failed to fetch settings data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettingsData();
  }, []);

  const handleDatabaseRefresh = () => {
    window.location.reload();
  };

  const handleExportData = () => {
    // Mock export functionality
    alert("Экспорт данных будет реализован в следующей версии");
  };

  const handleCreateBackup = () => {
    // Mock backup functionality
    alert("Создание резервной копии будет реализовано в следующей версии");
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
            <p className="text-gray-600">Системная информация и конфигурация</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600">Системная информация и конфигурация</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Statistics */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Статистика базы данных</CardTitle>
              <CardDescription>Информация о таблицах и данных</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {databaseStats?.totalRecords || 0}
                  </div>
                  <div className="text-sm text-blue-700">Всего записей</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {databaseStats?.tables.length || 0}
                  </div>
                  <div className="text-sm text-green-700">Таблиц</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {databaseStats?.databaseSize}
                  </div>
                  <div className="text-sm text-purple-700">Размер БД</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Таблицы</h4>
                {databaseStats?.tables.map((table, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {table.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Последнее изменение:{" "}
                          {new Date(table.lastModified).toLocaleDateString(
                            "ru"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {table.recordCount.toLocaleString()} записей
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 mt-6">
                <Button onClick={handleDatabaseRefresh} variant="outline">
                  Обновить данные
                </Button>
                <Button onClick={handleExportData} variant="outline">
                  Экспорт данных
                </Button>
                <Button onClick={handleCreateBackup} variant="outline">
                  Создать резервную копию
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>Системная информация</CardTitle>
              <CardDescription>
                Состояние системы и производительность
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Версия системы:</span>
                  <Badge variant="default">{systemInfo?.version}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Время работы:</span>
                  <span className="text-sm font-medium">
                    {systemInfo?.uptime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Последний бэкап:
                  </span>
                  <span className="text-sm font-medium">
                    {systemInfo
                      ? new Date(systemInfo.lastBackup).toLocaleDateString("ru")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Активные соединения:
                  </span>
                  <Badge variant="secondary">
                    {systemInfo?.performance.activeConnections}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Производительность</CardTitle>
              <CardDescription>
                Метрики производительности системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Среднее время ответа:
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {systemInfo?.performance.avgResponseTime}ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((systemInfo?.performance.avgResponseTime || 0) /
                            500) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Процент ошибок:
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {systemInfo?.performance.errorRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (systemInfo?.performance.errorRate || 0) * 10
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      Отличная
                    </div>
                    <div className="text-sm text-gray-500">
                      Производительность системы
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Конфигурация</CardTitle>
              <CardDescription>Настройки системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">
                      Автоматические резервные копии
                    </div>
                    <div className="text-sm text-gray-500">
                      Ежедневно в 2:00
                    </div>
                  </div>
                  <Badge variant="default">Включено</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">
                      Уведомления по email
                    </div>
                    <div className="text-sm text-gray-500">Важные события</div>
                  </div>
                  <Badge variant="secondary">Отключено</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">Логирование</div>
                    <div className="text-sm text-gray-500">Детальные логи</div>
                  </div>
                  <Badge variant="default">Включено</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">
                      API ограничения
                    </div>
                    <div className="text-sm text-gray-500">
                      1000 запросов/час
                    </div>
                  </div>
                  <Badge variant="outline">Активно</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>Часто используемые операции</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Очистить кэш
                </Button>
                <Button className="w-full" variant="outline">
                  Перезапустить службы
                </Button>
                <Button className="w-full" variant="outline">
                  Оптимизировать БД
                </Button>
                <Button className="w-full" variant="destructive">
                  Сброс настроек
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
