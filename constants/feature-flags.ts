// feature flags for services
export const featureFlags = {
  print: true,
  design: false,
  plainItems: false,
  gifts: false,
  deals: false,
  cod: true, // availability of "cash on delivery"
  recentlyViewed: false,
  recentlySearched: false,
  inbox: false,
};

export type FeatureFlagKeys = keyof typeof featureFlags;
