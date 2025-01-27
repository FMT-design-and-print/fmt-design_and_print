import { calculateDistance } from "./calculate-distance";
import { Town } from "@/types";
export const calculateDeliveryFeeFromDomeBranchByDistance = (
  selectedTown: Town
) => {
  const distance = calculateDistance(
    { lat: selectedTown.lat, long: selectedTown.long },
    { lat: 5.65, long: -0.24 }
  );

  if (Math.ceil(distance.kilometers) <= 5) {
    return 15;
  }

  if (Math.ceil(distance.kilometers) <= 12) {
    return 20;
  }

  if (Math.ceil(distance.kilometers) <= 16) {
    return 25;
  }

  if (Math.ceil(distance.kilometers) <= 25) {
    return 30;
  }
  if (Math.ceil(distance.kilometers) > 25) {
    return 40;
  }

  return 50;
};
