"use client";
import SiteUnderConstruction from "@/components/UnderConstruction";
import useWebsiteSettings from "@/hooks/useWebsiteSettings";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import React, { useEffect } from "react";

const AppBootstrap = ({
  children,
  section = "user",
}: {
  children: React.ReactNode;
  section?: "user" | "admin";
}) => {
  const { data: settings, isLoading } = useWebsiteSettings();

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
