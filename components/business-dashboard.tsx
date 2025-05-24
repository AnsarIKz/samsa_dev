"use client";

import { useState } from "react";
import { useToast } from "@/lib/toast";

interface DataFile {
  name: string;
  size: number;
  recordCount?: number;
  status: "uploading" | "processing" | "completed" | "error";
}

export function BusinessDashboard() {
  const toast = useToast();
  const [files, setFiles] = useState<DataFile[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Invalid file type", {
        description: "Please upload a CSV file",
        action: {
          label: "Try Again",
          onClick: () => event.target.click(),
        },
      });
      return;
    }

    const newFile: DataFile = {
      name: file.name,
      size: file.size,
      status: "uploading",
    };

    setFiles((prev) => [...prev, newFile]);

    // Simulate upload process
    const processingToast = toast.dataImport.processing(file.name);

    setTimeout(() => {
      // Simulate validation issues (randomly)
      if (Math.random() < 0.3) {
        const issues = [
          "Missing headers in columns B, D",
          "Date format inconsistency in rows 15-20",
          "Duplicate customer IDs found",
        ];

        toast.dismiss(processingToast);
        toast.dataImport.validation(issues);

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, status: "error" } : f
          )
        );
        return;
      }

      // Success case
      const recordCount = Math.floor(Math.random() * 2000) + 100;

      toast.dismiss(processingToast);
      toast.dataImport.success(file.name, recordCount);

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, status: "completed", recordCount } : f
        )
      );

      // Generate AI insights after successful import
      setTimeout(() => {
        generateInsights(file.name, recordCount);
      }, 2000);
    }, 3000);
  };

  const generateInsights = (filename: string, recordCount: number) => {
    const sampleInsights = [
      `Revenue trend analysis from ${filename} shows 23% growth in Q4`,
      `Top performing product category accounts for 34% of total sales`,
      `Customer retention rate improved by 12% compared to last quarter`,
      `Seasonal patterns suggest optimizing inventory in March and September`,
      `Geographic analysis reveals untapped potential in western regions`,
    ];

    const insight =
      sampleInsights[Math.floor(Math.random() * sampleInsights.length)];

    toast.aiInsight.discovered(insight);
    setInsights((prev) => [...prev, insight]);

    // Sometimes generate anomaly detection
    if (Math.random() < 0.4) {
      setTimeout(() => {
        toast.aiInsight.anomaly(
          "Unusual spike in returns detected in the last 7 days",
          "Return Rate"
        );
      }, 3000);
    }

    // Sometimes generate recommendation
    if (Math.random() < 0.5) {
      setTimeout(() => {
        toast.aiInsight.recommendation(
          "Optimize marketing spend",
          "Based on ROI analysis, reallocate 15% budget from social media to email campaigns"
        );
      }, 5000);
    }
  };

  const askAI = (question: string) => {
    const thinkingToast = toast.chat.thinking();

    setTimeout(() => {
      toast.dismiss(thinkingToast);

      if (Math.random() < 0.1) {
        toast.chat.error(
          "Unable to analyze the data due to incomplete customer information"
        );
        return;
      }

      const responses = [
        "Your highest performing product is Premium Widget with $2.3M in revenue",
        "Q4 showed the strongest sales with 34% of annual revenue",
        "Customer acquisition cost decreased by 18% this quarter",
        "Top 3 customers contribute 42% of total revenue",
        "Average order value increased from $245 to $289 this year",
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];

      toast.info("Analysis complete", {
        description: response,
        duration: 8000,
        action: {
          label: "See Details",
          onClick: () => console.log("Opening detailed analysis..."),
        },
      });
    }, 2500);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Business Dashboard
        </h1>
        <p className="text-gray-600">
          Upload data and get AI-powered insights with toast notifications
        </p>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Data Import</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload CSV File
          </label>
          <p className="mt-2 text-sm text-gray-500">
            Upload your business data to get started with AI analysis
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                      {file.recordCount && ` • ${file.recordCount} records`}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      file.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : file.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : file.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {file.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Ask AI Assistant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "What's my best performing product?",
            "Which quarter had the highest sales?",
            "What's my customer acquisition cost?",
            "Who are my top customers?",
            "What's the average order value?",
            "Show me revenue trends",
          ].map((question, index) => (
            <button
              key={index}
              onClick={() => askAI(question)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
            >
              <div className="text-sm font-medium text-gray-900">
                {question}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400"
              >
                <div className="text-sm text-blue-800">{insight}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
