"use client";
import SiteUnderConstruction from "@/components/UnderConstruction";
import useWebsiteSettings, {
  prefetchWebsiteSettings,
} from "@/hooks/useWebsiteSettings";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LandingPageSkeleton from "@/components/skeletons/LandingPageSkeleton";
import GeneralPageSkeleton from "@/components/skeletons/GeneralPageSkeleton";
import CustomRequestSkeleton from "@/components/skeletons/CustomRequestSkeleton";
import OrderTrackingSkeleton from "@/components/skeletons/OrderTrackingSkeleton";
import MyAccountSkeleton from "@/components/skeletons/MyAccountSkeleton";
import AdminSkeleton from "@/components/skeletons/AdminSkeleton";

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

  const getSkeletonComponent = () => {
    if (pathname.startsWith("/admin")) return <AdminSkeleton />;
    if (pathname === "/") return <LandingPageSkeleton />;
    if (pathname.startsWith("/custom-request"))
      return <CustomRequestSkeleton />;
    if (pathname.startsWith("/order-tracking"))
      return <OrderTrackingSkeleton />;
    if (pathname.startsWith("/my-account")) return <MyAccountSkeleton />;
    return <GeneralPageSkeleton />;
  };

  if (isLoading) {
    return (
      <>
        <NavigationProgress />
        {getSkeletonComponent()}
      </>
    );
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
