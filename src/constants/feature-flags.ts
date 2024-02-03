// feature flags for services
export const featureFlags = {
  print: true,
  design: false,
  plainItems: false,
  gifts: false,
  deals: false,
  cod: false, // availability of "cash on delivery"
};

export type FeatureFlagKeys = keyof typeof featureFlags;
