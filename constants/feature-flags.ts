// feature flags for services
export const featureFlags = {
  print: true,
  cod: true, // availability of "cash on delivery"

  design: false,
  plainItems: false,
  gifts: false,
  deals: false,
  recentlyViewed: false,
  recentlySearched: false,
  inbox: false,
  productRatings: false,
};

export type FeatureFlagKeys = keyof typeof featureFlags;
