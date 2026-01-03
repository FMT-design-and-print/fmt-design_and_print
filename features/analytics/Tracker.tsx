"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_KEY = "fmt_visitor_id";

import { SearchParamsProvider } from "@/components/SearchParamsProvider";

const AnalyticsTrackerContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  const lastPath = useRef("");

  useEffect(() => {
    // Only track in production or if explicitly enabled
    if (process.env.NODE_ENV !== "production") {
      console.log("Tracking disabled in development");
      return; 
    }

    const track = async () => {
      // Avoid double tracking in React Strict Mode or fast re-renders if path hasn't changed
      const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      
      // If we already tracked this path in this session (component lifecycle), skip
      // But searchParams change should trigger it.
      if (initialized.current && lastPath.current === currentPath) return;
      
      initialized.current = true;
      lastPath.current = currentPath;

      try {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        // Fetch location data
        let traceData: Record<string, string> = {};
        try {
          const res = await fetch(`https://www.cloudflare.com/cdn-cgi/trace?_=${Date.now()}`);
          if (res.ok) {
              const data = await res.text();
              const lines = data.split("\n");
              lines.forEach((line) => {
                const [key, value] = line.split("=");
                if (key && value) traceData[key] = value;
              });
          }
        } catch (e) {
          console.error("Error fetching trace data:", e);
        }

        // Send to API
        await fetch("/api/track-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitorId,
            ip: traceData.ip || null,
            country: traceData.loc || null, // Cloudflare trace provides 'loc' as 2-letter country code
            city: null, 
            region: traceData.colo || null,
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer || null,
          }),
        });

      } catch (error) {
        console.error("Analytics error:", error);
      }
    };

    track();
  }, [pathname, searchParams]);

  return null;
};

export const AnalyticsTracker = () => {
  return (
    <SearchParamsProvider fallback={null}>
      <AnalyticsTrackerContent />
    </SearchParamsProvider>
  );
};
