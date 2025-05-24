import { AnalyticsCards } from "@/components/analytics-cards";
import { AIChat } from "@/components/ai-chat";

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Page Description */}
      <div>
        <p className="text-muted-foreground">
          Аналитика бизнеса и AI ассистент для принятия решений
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side - Analytics Cards */}
        <div className="xl:col-span-2">
          <AnalyticsCards />
        </div>

        {/* Right Side - AI Chat */}
        <div className="xl:col-span-1">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
