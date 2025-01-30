"use client";

import { event } from "@/lib/analytics/gtag";

export const useAnalytics = () => {
  const trackEvent = (
    action: string,
    category: string,
    label: string,
    value?: number
  ) => {
    event({ action, category, label, value });
  };

  const trackProductView = (productId: string, productName: string) => {
    trackEvent("view_item", "Product", productName, undefined);
  };

  const trackAddToCart = (
    productId: string,
    productName: string,
    value: number
  ) => {
    trackEvent("add_to_cart", "Ecommerce", productName, value);
  };

  const trackPurchase = (orderId: string, value: number) => {
    trackEvent("purchase", "Ecommerce", orderId, value);
  };

  const trackSearch = (searchTerm: string) => {
    trackEvent("search", "User Interaction", searchTerm);
  };

  const trackCustomRequest = (requestType: string) => {
    trackEvent("custom_request", "User Interaction", requestType);
  };

  return {
    trackEvent,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch,
    trackCustomRequest,
  };
};
