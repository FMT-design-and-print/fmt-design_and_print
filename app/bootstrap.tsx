"use client";
import SiteUnderConstruction from "@/components/UnderConstruction";
import useWebsiteSettings, {
  prefetchWebsiteSettings,
} from "@/hooks/useWebsiteSettings";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const AppBootstrap = ({
  children,
  section = "user",
}: {
  children: React.ReactNode;
  section?: "user" | "admin";
}) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useWebsiteSettings();

  // Prefetch settings for future navigations
  useEffect(() => {
    prefetchWebsiteSettings(queryClient);
  }, [queryClient]);

  useEffect(() => {
    if (isLoading) {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  // Skip settings check for quotes/[id] page
  if (pathname.startsWith("/quotes/")) {
    return (
      <>
        <NavigationProgress />
        {children}
      </>
    );
  }

  if (settings) {
    const siteSettings = settings[0];

    if (section === "user" && siteSettings.userSectionUnderConstruction) {
      return <SiteUnderConstruction />;
    }

    if (section === "admin" && siteSettings.adminSectionUnderConstruction) {
      return <SiteUnderConstruction />;
    }
  }

  return (
    <>
      <NavigationProgress />
      {children}
    </>
  );
};

export default AppBootstrap;
