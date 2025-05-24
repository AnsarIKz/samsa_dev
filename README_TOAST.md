# Toast Notification System

A modern, contextual toast notification system built with shadcn/ui's Sonner integration, specifically designed for AI Business Assistant applications.

## Features

- ✨ **Smooth animations** with Sonner
- 🎨 **Theme-aware** (light/dark mode support)
- 📱 **Mobile responsive** design
- 🎯 **Context-specific** toast types for business scenarios
- ⚡ **TypeScript** support with full type safety
- 🔧 **Customizable** durations and actions

## Installation

The system is already set up in your project with:

- `sonner` for toast functionality
- `next-themes` for theme support
- Custom `useToast` hook with business-specific presets

## Basic Usage

```tsx
import { useToast } from "@/lib/toast";

function MyComponent() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success("Operation completed!")}>
      Click me
    </button>
  );
}
```

## Toast Types

### Basic Toasts

```tsx
toast.success("Data saved successfully!");
toast.error("Failed to connect to database");
toast.warning("API rate limit approaching");
toast.info("New features available");
```

### Loading States

```tsx
const loadingId = toast.loading("Processing data...");
// Later...
toast.dismiss(loadingId);
```

### With Actions

```tsx
toast.info("Update available", {
  description: "Version 2.0 includes new AI features",
  action: {
    label: "Update Now",
    onClick: () => performUpdate(),
  },
});
```

## Business-Specific Toast Functions

### Data Import

```tsx
// Processing
const processingId = toast.dataImport.processing("sales_data.csv");

// Success
toast.dataImport.success("sales_data.csv", 1250); // 1250 records

// Error
toast.dataImport.error("sales_data.csv", "Invalid date format in row 15");

// Validation issues
toast.dataImport.validation([
  "Missing headers in columns B, D",
  "Date format inconsistency",
  "Duplicate customer IDs",
]);
```

### AI Insights

```tsx
// New insight discovered
toast.aiInsight.discovered("Sales increased 34% after marketing campaign");

// Anomaly detection
toast.aiInsight.anomaly("Revenue dropped 15% unexpectedly", "Daily Revenue");

// Recommendations
toast.aiInsight.recommendation(
  "Optimize inventory levels",
  "Reduce Product A inventory by 20% next month"
);
```

### Chat Interactions

```tsx
// AI thinking
const thinkingId = toast.chat.thinking();
// Later dismiss when response ready
toast.dismiss(thinkingId);

// Chat errors
toast.chat.error("Connection timeout while fetching data");
```

## Customization Options

### Duration

```tsx
toast.success("Quick message", { duration: 2000 }); // 2 seconds
toast.warning("Important warning", { duration: 8000 }); // 8 seconds
```

### With Description

```tsx
toast.info("Analysis complete", {
  description: "Found 3 key insights in your sales data",
  duration: 6000,
});
```

### With Action Button

```tsx
toast.error("Import failed", {
  description: "Check file format and try again",
  action: {
    label: "Retry",
    onClick: () => retryImport(),
  },
});
```

## Real-World Integration Examples

### File Upload with Validation

```tsx
const handleFileUpload = async (file: File) => {
  if (!file.name.endsWith(".csv")) {
    toast.error("Invalid file type", {
      description: "Please upload a CSV file",
      action: {
        label: "Select File",
        onClick: () => fileInput.click(),
      },
    });
    return;
  }

  const processingId = toast.dataImport.processing(file.name);

  try {
    const result = await uploadFile(file);
    toast.dismiss(processingId);
    toast.dataImport.success(file.name, result.recordCount);
  } catch (error) {
    toast.dismiss(processingId);
    toast.dataImport.error(file.name, error.message);
  }
};
```

### AI Analysis Flow

```tsx
const analyzeData = async (query: string) => {
  const thinkingId = toast.chat.thinking();

  try {
    const response = await aiService.analyze(query);
    toast.dismiss(thinkingId);

    toast.info("Analysis complete", {
      description: response.summary,
      action: {
        label: "View Details",
        onClick: () => showAnalysisDetails(response),
      },
    });
  } catch (error) {
    toast.dismiss(thinkingId);
    toast.chat.error("Unable to analyze data: " + error.message);
  }
};
```

### Proactive Insights

```tsx
// Monitor data and show proactive insights
useEffect(() => {
  const checkForAnomalies = () => {
    if (revenueDropDetected) {
      toast.aiInsight.anomaly(
        "Revenue dropped 15% in the last 3 days",
        "Daily Revenue"
      );
    }
  };

  const interval = setInterval(checkForAnomalies, 60000); // Check every minute
  return () => clearInterval(interval);
}, []);
```

## Best Practices

1. **Use appropriate durations**:

   - Success: 4 seconds
   - Info: 4-6 seconds
   - Warning: 5-8 seconds
   - Error: 6+ seconds

2. **Provide actionable feedback**:

   - Include action buttons for errors when user can retry
   - Link to relevant pages or sections
   - Offer alternative solutions

3. **Be contextual**:

   - Use business-specific toast functions
   - Include relevant details in descriptions
   - Match the tone to your application

4. **Handle loading states**:

   - Always dismiss loading toasts
   - Provide feedback on completion
   - Handle both success and error cases

5. **Don't spam users**:
   - Dismiss previous toasts when showing new ones
   - Avoid showing multiple similar toasts
   - Use appropriate timing between notifications

## Theme Integration

The toast system automatically adapts to your application's theme:

```tsx
// In your layout.tsx
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
  <Toaster />
</ThemeProvider>
```

## Accessibility

The toast system includes:

- Screen reader announcements
- Keyboard navigation support
- Focus management
- ARIA attributes for better accessibility

## Components Structure

```
lib/
  toast.ts          # Main toast utilities and hooks
components/
  ui/
    sonner.tsx      # Sonner component configuration
  toast-demo.tsx    # Demo component
  business-dashboard.tsx # Real-world example
```

This toast system provides a solid foundation for user feedback in your AI Business Assistant application, with specific presets that match your business intelligence use cases.
