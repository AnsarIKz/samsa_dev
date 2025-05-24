import { AnalyticsCards } from "@/components/analytics-cards";
import { AIChat } from "@/components/ai-chat";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col p-6 space-y-6 overflow-hidden">
      {/* Page Description */}
      <div>
        <p className="text-muted-foreground">
          Аналитика бизнеса и AI ассистент для принятия решений
        </p>
      </div>

      {/* Контейнер на всю оставшуюся высоту экрана */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 overflow-hidden">
        {/* Левая часть — чарты, с прокруткой */}
        <div className="flex-1 overflow-auto">
          <AnalyticsCards />
        </div>

        {/* Правая часть — чат, не прокручивается */}
        <div className="w-full xl:w-1/3 flex-shrink-0">
          <AIChat />
        </div>
      </div>
    </div>
  );
}

