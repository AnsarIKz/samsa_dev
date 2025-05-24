"use client";

import { useState } from "react";
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

// Типы данных
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "low_stock";
  lastUpdated: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive";
}

interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
  items: number;
}

// Моковые данные
const mockProducts: Product[] = [
  {
    id: "P001",
    name: "Беспроводные наушники Pro",
    category: "Электроника",
    price: 15990,
    stock: 45,
    status: "active",
    lastUpdated: "2024-01-15",
  },
  {
    id: "P002",
    name: "Умные часы Sport",
    category: "Электроника",
    price: 12990,
    stock: 23,
    status: "active",
    lastUpdated: "2024-01-14",
  },
  {
    id: "P003",
    name: "Куртка зимняя",
    category: "Одежда",
    price: 8990,
    stock: 5,
    status: "low_stock",
    lastUpdated: "2024-01-13",
  },
  {
    id: "P004",
    name: "Кофемашина Deluxe",
    category: "Дом и сад",
    price: 45990,
    stock: 12,
    status: "active",
    lastUpdated: "2024-01-12",
  },
  {
    id: "P005",
    name: "Книга 'Бизнес-аналитика'",
    category: "Книги",
    price: 1990,
    stock: 0,
    status: "inactive",
    lastUpdated: "2024-01-10",
  },
];

const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Иван Петров",
    email: "ivan@example.com",
    totalOrders: 15,
    totalSpent: 125000,
    lastOrder: "2024-01-15",
    status: "active",
  },
  {
    id: "C002",
    name: "Мария Сидорова",
    email: "maria@example.com",
    totalOrders: 8,
    totalSpent: 75000,
    lastOrder: "2024-01-12",
    status: "active",
  },
  {
    id: "C003",
    name: "Алексей Козлов",
    email: "alex@example.com",
    totalOrders: 3,
    totalSpent: 25000,
    lastOrder: "2023-12-20",
    status: "inactive",
  },
];

const mockOrders: Order[] = [
  {
    id: "O001",
    customerName: "Иван Петров",
    amount: 15990,
    status: "completed",
    date: "2024-01-15",
    items: 1,
  },
  {
    id: "O002",
    customerName: "Мария Сидорова",
    amount: 8990,
    status: "pending",
    date: "2024-01-14",
    items: 2,
  },
  {
    id: "O003",
    customerName: "Алексей Козлов",
    amount: 12990,
    status: "cancelled",
    date: "2024-01-13",
    items: 1,
  },
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<
    "products" | "customers" | "orders"
  >("products");
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

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

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {mockProducts.length}
              </div>
              <div className="text-sm text-gray-500">Товаров</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mockCustomers.length}
              </div>
              <div className="text-sm text-gray-500">Клиентов</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mockOrders.length}
              </div>
              <div className="text-sm text-gray-500">Заказов</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₽
                {(
                  mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0) /
                  1000
                ).toFixed(0)}
                K
              </div>
              <div className="text-sm text-gray-500">Стоимость склада</div>
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.id}</TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₽{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Customers Table */}
          {activeTab === "customers" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Заказов</TableHead>
                  <TableHead>Потрачено</TableHead>
                  <TableHead>Последний заказ</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-mono">{customer.id}</TableCell>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>
                      ₽{customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Orders Table */}
          {activeTab === "orders" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Товаров</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell>₽{order.amount.toLocaleString()}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
