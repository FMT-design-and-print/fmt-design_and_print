import { Category, CalculationHistory, CalculationHistoryStore } from "./types";

type Unit = "mm" | "cm" | "inch" | "ft";

const CONVERSION_RATES = {
  mm: {
    mm: 1,
    cm: 0.1,
    inch: 0.0393701,
    ft: 0.00328084,
  },
  cm: {
    mm: 10,
    cm: 1,
    inch: 0.393701,
    ft: 0.0328084,
  },
  inch: {
    mm: 25.4,
    cm: 2.54,
    inch: 1,
    ft: 0.0833333,
  },
  ft: {
    mm: 304.8,
    cm: 30.48,
    inch: 12,
    ft: 1,
  },
};

export function convertMeasurement(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  return value * CONVERSION_RATES[fromUnit][toUnit];
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function getCalculationHistory(
  category: Category
): CalculationHistory[] {
  try {
    const historyStore = JSON.parse(
      localStorage.getItem("calculationHistory") || "{}"
    ) as CalculationHistoryStore;
    return historyStore[category] || [];
  } catch {
    return [];
  }
}

export function saveCalculationHistory(
  calculation: CalculationHistory,
  maxHistory: number = 5
): void {
  try {
    const historyStore = JSON.parse(
      localStorage.getItem("calculationHistory") || "{}"
    ) as CalculationHistoryStore;

    const categoryHistory = historyStore[calculation.category] || [];
    categoryHistory.unshift(calculation);

    // Keep only the last maxHistory items
    if (categoryHistory.length > maxHistory) {
      categoryHistory.length = maxHistory;
    }

    historyStore[calculation.category] = categoryHistory;
    localStorage.setItem("calculationHistory", JSON.stringify(historyStore));
  } catch (error) {
    console.error("Failed to save calculation history:", error);
  }
}
