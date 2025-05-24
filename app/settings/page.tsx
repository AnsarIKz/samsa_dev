import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">
          Конфигурация системы и AI ассистента
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Настройки AI</CardTitle>
            <CardDescription>
              Параметры искусственного интеллекта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Автоматические инсайты</div>
                <div className="text-sm text-gray-500">
                  Показывать проактивные рекомендации
                </div>
              </div>
              <Badge variant="default">Включено</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Мониторинг аномалий</div>
                <div className="text-sm text-gray-500">
                  Автоматическое обнаружение отклонений
                </div>
              </div>
              <Badge variant="default">Включено</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Частота анализа</div>
                <div className="text-sm text-gray-500">
                  Интервал обновления данных
                </div>
              </div>
              <Badge variant="secondary">15 минут</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Уровень детализации</div>
                <div className="text-sm text-gray-500">
                  Глубина аналитических отчетов
                </div>
              </div>
              <Badge variant="secondary">Высокий</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle>База данных</CardTitle>
            <CardDescription>
              Управление данными и синхронизация
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Статус подключения</div>
                <div className="text-sm text-gray-500">
                  SQLite локальная база
                </div>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Подключено
              </Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Автобэкап</div>
                <div className="text-sm text-gray-500">
                  Ежедневное резервирование
                </div>
              </div>
              <Badge variant="default">Включено</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Размер БД</div>
                <div className="text-sm text-gray-500">
                  Текущий объем данных
                </div>
              </div>
              <Badge variant="secondary">2.4 MB</Badge>
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full">
                Экспорт данных
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>Настройки оповещений и алертов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Toast уведомления</div>
                <div className="text-sm text-gray-500">
                  Всплывающие сообщения
                </div>
              </div>
              <Badge variant="default">Включено</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Email алерты</div>
                <div className="text-sm text-gray-500">
                  Критические уведомления
                </div>
              </div>
              <Badge variant="secondary">Отключено</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Звуковые сигналы</div>
                <div className="text-sm text-gray-500">Аудио оповещения</div>
              </div>
              <Badge variant="secondary">Отключено</Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>Информация о системе</CardTitle>
            <CardDescription>Версия и статус компонентов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Версия приложения</div>
                <div className="text-sm text-gray-500">
                  AI Business Assistant
                </div>
              </div>
              <Badge variant="outline">v1.0.0</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Next.js</div>
                <div className="text-sm text-gray-500">React framework</div>
              </div>
              <Badge variant="outline">v15.3.0</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">shadcn/ui</div>
                <div className="text-sm text-gray-500">UI компоненты</div>
              </div>
              <Badge variant="outline">Latest</Badge>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">Время работы</div>
                <div className="text-sm text-gray-500">Без перезагрузки</div>
              </div>
              <Badge variant="secondary">2ч 15м</Badge>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full">
                Проверить обновления
              </Button>
              <Button variant="destructive" className="w-full">
                Перезапустить систему
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
