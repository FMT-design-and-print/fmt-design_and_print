import { Loader } from "@mantine/core";
import { useEffect } from "react";
import { useCalculatorSettings } from "../hooks/useCalculatorSettings";
import { setCalculatorSettings } from "../utils";

type Props = {
  children: React.ReactNode;
};

export function CalculatorSettingsProvider({ children }: Props) {
  const { data: settings, isLoading, error } = useCalculatorSettings();

  useEffect(() => {
    if (settings) {
      setCalculatorSettings(settings);
    }
  }, [settings]);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error loading calculator settings</div>;
  }

  if (!settings?.length) {
    return <div>No calculator settings found</div>;
  }

  return <>{children}</>;
}
