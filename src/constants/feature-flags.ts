// feature flags for services
export const featureFlags = {
  print: true,
  design: false,
  plainItems: false,
  gifts: false,
  deals: false,
};

export type FeatureFlagKeys = keyof typeof featureFlags;
