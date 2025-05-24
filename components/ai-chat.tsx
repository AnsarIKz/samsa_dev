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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/lib/toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Привет! Я ваш AI ассистент. Помогу проанализировать данные и ответить на вопросы о бизнесе.",
      sender: "ai",
      timestamp: "10:00",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const quickQuestions = [
    "Какой самый популярный товар?",
    "Покажи динамику продаж",
    "Анализ клиентской базы",
    "Прогноз на следующий месяц",
    "Топ регионы по продажам",
    "Анализ прибыльности",
  ];

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const currentTime = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: "user",
      timestamp: currentTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const thinkingToast = toast.chat.thinking();

    setTimeout(() => {
      toast.dismiss(thinkingToast);
      setIsLoading(false);

      const responses = [
        "Согласно анализу ваших данных, самый популярный товар - 'Беспроводные наушники Pro' с 234 продажами за месяц.",
        "Выручка выросла на 12.5% по сравнению с прошлым месяцем. Основной рост в категории 'Электроника'.",
        "В вашей клиентской базе 1,247 активных клиентов. Средний LTV составляет ₽15,340.",
        "Прогноз показывает рост продаж на 8-12% в следующем месяце на основе сезонных трендов.",
        "Топ-3 региона: Москва (35%), СПб (18%), Екатеринбург (12%). Потенциал роста в южных регионах.",
        "Маржинальность по категориям: Электроника 23%, Одежда 45%, Дом и сад 31%. Рекомендую фокус на одежде.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (Math.random() < 0.3) {
        setTimeout(() => {
          toast.aiInsight.discovered(
            "Обнаружена аномалия в данных о возвратах - увеличение на 15%"
          );
        }, 2000);
      }
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Ассистент</CardTitle>
        <CardDescription>
          Задавайте вопросы о ваших данных и получайте инсайты
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Quick Questions */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Быстрые вопросы:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 px-3 text-left justify-start"
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4 h-[300px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-lg px-3 py-2 bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Задайте вопрос о ваших данных..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
          >
            Отправить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
