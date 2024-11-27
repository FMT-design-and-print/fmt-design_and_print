import { useState } from "react";
import { Category, CalculationHistory } from "../types";
import { getCalculationHistory, saveCalculationHistory } from "../utils";

export function useCalculationHistory(category: Category) {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>(
    getCalculationHistory(category)
  );

  const clearHistory = () => {
    const emptyHistory: { [key: string]: never[] } = {};
    emptyHistory[category] = [];
    localStorage.setItem("calculationHistory", JSON.stringify(emptyHistory));
    setHistory([]);
  };

  const saveToHistory = (
    calculation: Omit<CalculationHistory, "id" | "timestamp">
  ) => {
    const newCalculation: CalculationHistory = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    saveCalculationHistory(newCalculation);
    setHistory(getCalculationHistory(category));
  };

  return {
    history,
    showHistory,
    setShowHistory,
    clearHistory,
    saveToHistory,
  };
}
