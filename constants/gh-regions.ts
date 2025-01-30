import { GHRegion } from "@/types";

export const regionsInGhana: GHRegion[] = [
  { id: 1, name: "Ahafo" },
  { id: 2, name: "Ashanti" },
  { id: 3, name: "Bono East" },
  { id: 4, name: "Brong Ahafo" },
  { id: 5, name: "Central" },
  { id: 6, name: "Eastern" },
  { id: 7, name: "Greater Accra" },
  { id: 8, name: "North East" },
  { id: 9, name: "Northern" },
  { id: 10, name: "Oti" },
  { id: 11, name: "Savannah" },
  { id: 12, name: "Upper East" },
  { id: 13, name: "Upper West" },
  { id: 14, name: "Volta" },
  { id: 15, name: "Western" },
  { id: 16, name: "Western North" },
];

export const baseShippingFeeByRegion: { [key: number]: number } = {
  1: 0, // Ahafo
  2: 0, // Ashanti
  3: 0, // Bono East
  4: 0, // Brong Ahafo
  5: 0, // Central
  6: 0, // Eastern
  7: 0, // Greater Accra
  8: 0, // North East
  9: 0, // Northern
  10: 0, // Oti
  11: 0, // Savannah
  12: 0, // Upper East
  13: 0, // Upper West
  14: 0, // Volta
  15: 0, // Western
  16: 0, // Western North
};

export const visibleRegionIds = [7];
