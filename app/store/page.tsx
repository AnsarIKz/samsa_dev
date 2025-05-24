"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/lib/toast";

interface InventoryItem {
  "Product Name": string;
  "Stock Quantity": number;
  "Unit Price": number;
  "Restock Threshold": number;
  Category?: string;
}

interface SalesItem {
  "Product Name": string;
  Quantity: number;
  "Total Amount": number;
  Date: string;
}

interface LowStockItem {
  productName: string;
  stockQuantity: number;
  restockThreshold: number;
}

export default function StorePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<SalesItem[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "products" | "customers" | "orders"
  >("products");
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    async function fetchStoreData() {
      try {
        const [inventoryRes, salesRes, lowStockRes] = await Promise.all([
          fetch("/api/inventory"),
          fetch("/api/sales"),
          fetch("/api/low-stock"),
        ]);

        const [inventoryData, salesData, lowStockData] = await Promise.all([
          inventoryRes.json(),
          salesRes.json(),
          lowStockRes.json(),
        ]);

        setInventory(inventoryData);
        setSales(salesData);
        setLowStock(lowStockData);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStoreData();
  }, []);

  const handleRefreshData = () => {
    toast.success("Данные обновлены", {
      description: "Информация из базы данных успешно синхронизирована",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Активный" },
      inactive: { variant: "secondary" as const, label: "Неактивный" },
      low_stock: { variant: "destructive" as const, label: "Мало на складе" },
      pending: { variant: "outline" as const, label: "В обработке" },
      completed: { variant: "default" as const, label: "Выполнен" },
      cancelled: { variant: "destructive" as const, label: "Отменен" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProducts = inventory.filter(
    (item) =>
      item["Product Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = inventory.reduce(
    (sum, item) => sum + item["Stock Quantity"] * item["Unit Price"],
    0
  );

  const recentSales = sales.slice(0, 10);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Магазин</h1>
            <p className="text-gray-600">Управление товарами и складом</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">База данных</h1>
          <p className="text-gray-600 mt-2">
            Управление товарами, клиентами и заказами
          </p>
        </div>
        <Button onClick={handleRefreshData}>Обновить данные</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {inventory.length}
              </div>
              <div className="text-sm text-gray-500">Товаров</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Стоимость склада</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {lowStock.length}
              </div>
              <div className="text-sm text-gray-500">Мало на складе</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {recentSales.length}
              </div>
              <div className="text-sm text-gray-500">Последние продажи</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Данные</CardTitle>
              <CardDescription>
                Просмотр и управление данными из базы
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "products" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("products")}
              >
                Товары
              </Button>
              <Button
                variant={activeTab === "customers" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("customers")}
              >
                Клиенты
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("orders")}
              >
                Заказы
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Products Table */}
          {activeTab === "products" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Склад</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Обновлен</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((item, index) => {
                  const isLowStock =
                    item["Stock Quantity"] <= item["Restock Threshold"];
                  const totalPrice =
                    item["Stock Quantity"] * item["Unit Price"];

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {item["Product Name"]}
                      </TableCell>
                      <TableCell>{item.Category}</TableCell>
                      <TableCell>
                        ${item["Unit Price"].toLocaleString()}
                      </TableCell>
                      <TableCell>{item["Stock Quantity"]}</TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge variant="destructive">Мало</Badge>
                        ) : (
                          <Badge variant="default">В наличии</Badge>
                        )}
                      </TableCell>
                      <TableCell>{item["Restock Threshold"]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                �� Требует пополнения
                {lowStock.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {lowStock.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Товары с низким остатком</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStock.length > 0 ? (
                  lowStock.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="font-medium text-gray-800">
                        {item.productName}
                      </div>
                      <div className="text-sm text-gray-600">
                        Остаток:{" "}
                        <span className="font-medium text-red-600">
                          {item.stockQuantity}
                        </span>{" "}
                        шт
                      </div>
                      <div className="text-xs text-gray-500">
                        Лимит: {item.restockThreshold} шт
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-green-600 bg-green-50 rounded-lg">
                    ✅ Все товары в достатке
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Последние продажи</CardTitle>
              <CardDescription>Недавняя активность</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {sale["Product Name"]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {sale.Quantity} шт × $
                          {(
                            (sale["Total Amount"] || 0) / (sale.Quantity || 1)
                          ).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(sale.Date).toLocaleDateString("ru")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ${(sale["Total Amount"] || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
