import { Town } from "@/types";

export interface Region {
  id: number;
  name: string;
}

export const regionsInGhana: Region[] = [
  { id: 7, name: "Greater Accra" },
  // Add other regions as needed
];

export const townsInGhana: Town[] = [
  {
    name: "Ablekuma",
    lat: 5.63,
    long: -0.1,
    regionId: 7,
    regionName: "Greater Accra",
  },
  {
    name: "Accra Central",
    lat: 5.55,
    long: -0.2,
    regionId: 7,
    regionName: "Greater Accra",
  },
  {
    name: "Adenta",
    lat: 5.7,
    long: -0.17,
    regionId: 7,
    regionName: "Greater Accra",
  },
  // Add more towns as needed
];
