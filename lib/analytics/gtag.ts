/* eslint-disable @typescript-eslint/no-explicit-any */
// Type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

// This is your Google Analytics 4 Measurement ID
export const GA_MEASUREMENT_ID = process.env
  .NEXT_PUBLIC_GA_MEASUREMENT_ID as string;

// Log page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
