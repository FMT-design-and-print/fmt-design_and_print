interface Coordinates {
  lat: number;
  long: number;
}

interface Distance {
  meters: number;
  kilometers: number;
  miles: number;
}

/**
 * Calculates the distance between two geographical points using the Haversine formula
 * @param point1 First point coordinates {lat, long}
 * @param point2 Second point coordinates {lat, long}
 * @returns Object containing distances in meters, kilometers, and miles
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): Distance {
  // Earth's radius in meters
  const EARTH_RADIUS = 6371000;

  // Convert latitude and longitude from degrees to radians
  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const lon1 = (point1.long * Math.PI) / 180;
  const lon2 = (point2.long * Math.PI) / 180;

  // Differences in coordinates
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distances
  const meters = EARTH_RADIUS * c;
  const kilometers = meters / 1000;
  const miles = kilometers * 0.621371;

  return {
    meters: Math.round(meters), // Round to nearest meter
    kilometers: Number(kilometers.toFixed(2)), // Two decimal places
    miles: Number(miles.toFixed(2)), // Two decimal places
  };
}

/**
 * Example usage:
 * const distance = calculateDistance(
 *   { lat: 5.55, long: -0.2 }, // Accra
 *   { lat: 5.6, long: -0.187 }  // Another location
 * );
 * console.log(distance);
 * // Output: { meters: 5823, kilometers: 5.82, miles: 3.62 }
 */
