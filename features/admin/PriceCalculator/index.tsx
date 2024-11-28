import { usePermission } from "@/hooks/admin/usePermission";
import { Button, Group, Stack, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { Calculator } from "./Calculator";
import { CalculatorSettingsProvider } from "./components/CalculatorSettingsProvider";
import { SettingsManager } from "./components/SettingsManager";

export function PriceCalculator() {
  const [showSettings, setShowSettings] = useState(false);
  const { hasPermission } = usePermission();

  return (
    <CalculatorSettingsProvider>
      <Stack>
        {showSettings ? (
          <SettingsManager onClose={() => setShowSettings(false)} />
        ) : (
          <>
            <Group justify="space-between">
              <Title order={3}>Price Calculator</Title>
              {hasPermission("admin_permissions") && (
                <Button
                  leftSection={<IconSettings size={20} />}
                  variant="light"
                  onClick={() => setShowSettings(true)}
                  color="pink"
                >
                  Manage Settings
                </Button>
              )}
            </Group>
            <Calculator />
          </>
        )}
      </Stack>
    </CalculatorSettingsProvider>
  );
}
