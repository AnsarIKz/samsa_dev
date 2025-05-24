"use client";

import { useToast } from "@/lib/toast";

export function ToastDemo() {
  const toast = useToast();

  const demoBasicToasts = () => {
    toast.success("Operation completed successfully!");

    setTimeout(() => {
      toast.info("New data analysis is ready", {
        description: "Click to view the latest insights from your sales data",
        action: {
          label: "View Report",
          onClick: () => console.log("Opening report..."),
        },
      });
    }, 1000);

    setTimeout(() => {
      toast.warning("API rate limit approaching", {
        description: "Consider upgrading your plan for unlimited requests",
        duration: 6000,
      });
    }, 2000);
  };

  const demoDataImport = () => {
    // Simulate data import process
    const loadingToast = toast.dataImport.processing("sales_data_2024.csv");

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.dataImport.success("sales_data_2024.csv", 1250);
    }, 3000);
  };

  const demoDataValidation = () => {
    const issues = [
      "Missing date format in row 15",
      "Invalid currency code in row 23",
      "Duplicate entries found in rows 45-47",
      "NULL values in required field 'customer_id'",
    ];

    toast.dataImport.validation(issues);
  };

  const demoAIInsights = () => {
    toast.aiInsight.discovered(
      "Sales increased by 34% after marketing campaign launch on March 15th"
    );

    setTimeout(() => {
      toast.aiInsight.anomaly(
        "Revenue dropped 15% unexpectedly in the last 3 days",
        "Daily Revenue"
      );
    }, 2000);

    setTimeout(() => {
      toast.aiInsight.recommendation(
        "Optimize inventory levels",
        "Based on seasonal trends, consider reducing Product A inventory by 20% next month"
      );
    }, 4000);
  };

  const demoChatFlow = () => {
    const thinkingToast = toast.chat.thinking();

    setTimeout(() => {
      toast.dismiss(thinkingToast);
      toast.info("Analysis complete", {
        description: "Your top 3 customers account for 45% of total revenue",
        action: {
          label: "See Details",
          onClick: () => console.log("Showing customer analysis..."),
        },
      });
    }, 3000);
  };

  const demoError = () => {
    toast.chat.error(
      "Connection timeout while fetching data from external API"
    );
  };

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Toast Notification Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={demoBasicToasts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Demo Basic Toasts
        </button>

        <button
          onClick={demoDataImport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Demo Data Import
        </button>

        <button
          onClick={demoDataValidation}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Demo Data Validation
        </button>

        <button
          onClick={demoAIInsights}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Demo AI Insights
        </button>

        <button
          onClick={demoChatFlow}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Demo Chat Flow
        </button>

        <button
          onClick={demoError}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Demo Error Toast
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Examples:</h3>
        <div className="text-sm space-y-2 font-mono">
          <div>
            <strong>Basic:</strong> <code>toast.success("Data saved!")</code>
          </div>
          <div>
            <strong>With action:</strong>{" "}
            <code>
              toast.info("Update available",{" "}
              {"{action: {label: 'Update', onClick: () => update()}}"}
            </code>
          </div>
          <div>
            <strong>Data import:</strong>{" "}
            <code>toast.dataImport.success("file.csv", 100)</code>
          </div>
          <div>
            <strong>AI insight:</strong>{" "}
            <code>toast.aiInsight.discovered("Sales trend detected")</code>
          </div>
          <div>
            <strong>Loading state:</strong>{" "}
            <code>
              const id = toast.loading("Processing..."); toast.dismiss(id)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
