import { toast } from "sonner";

export interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      description: options?.description,
    });
  };

  const dismiss = (toastId?: string | number) => {
    return toast.dismiss(toastId);
  };

  // Specialized toast functions for business assistant scenarios
  const dataImport = {
    processing: (filename: string) => {
      return loading("Processing " + filename + "...", {
        description: "Validating data format and structure",
      });
    },
    success: (filename: string, recordCount: number) => {
      return success("Successfully imported " + filename, {
        description: recordCount + " records processed and ready for analysis",
        action: {
          label: "View Data",
          onClick: () => {
            window.location.href = "/data-management";
          },
        },
      });
    },
    error: (filename: string, errorMsg: string) => {
      return error("Failed to import " + filename, {
        description: errorMsg,
        action: {
          label: "Try Again",
          onClick: () => {}, // Will be overridden by caller
        },
      });
    },
    validation: (issues: string[]) => {
      const issueCount = issues.length;
      const preview = issues.slice(0, 2).join(", ");
      const description =
        issueCount +
        " issues detected: " +
        preview +
        (issueCount > 2 ? "..." : "");

      return warning("Data validation issues found", {
        description,
        duration: 8000,
      });
    },
  };

  const aiInsight = {
    discovered: (insight: string) => {
      return info("New insight discovered", {
        description: insight,
        duration: 6000,
        action: {
          label: "Learn More",
          onClick: () => {}, // Will be overridden by caller
        },
      });
    },
    anomaly: (anomaly: string, metric: string) => {
      return warning("Anomaly detected in " + metric, {
        description: anomaly,
        duration: 8000,
        action: {
          label: "Investigate",
          onClick: () => {}, // Will be overridden by caller
        },
      });
    },
    recommendation: (title: string, description: string) => {
      return info(title, {
        description,
        duration: 7000,
        action: {
          label: "Apply",
          onClick: () => {}, // Will be overridden by caller
        },
      });
    },
  };

  const chat = {
    thinking: () => {
      return loading("AI is thinking...", {
        description: "Analyzing your data and generating insights",
      });
    },
    error: (errorMsg: string) => {
      return error("Unable to process your request", {
        description: errorMsg,
        action: {
          label: "Retry",
          onClick: () => {}, // Will be overridden by caller
        },
      });
    },
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dataImport,
    aiInsight,
    chat,
  };
};

export { toast };
