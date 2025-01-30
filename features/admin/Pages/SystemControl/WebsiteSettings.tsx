"use client";

import { IWebsiteSettings } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Group, Paper, Stack, Switch, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

export function WebsiteSettings() {
  const [settings, setSettings] = useState<IWebsiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("website-settings")
        .select("*")
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load website settings",
        color: "red",
      });
    }
  };

  const updateSettings = async (updates: Partial<IWebsiteSettings>) => {
    if (!settings) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("website-settings")
        .update(updates)
        .eq("id", settings.id);

      if (error) throw error;

      setSettings({ ...settings, ...updates });
      notifications.show({
        title: "Success",
        message: "Settings updated successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update settings",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <Paper p="xl" radius="md">
      <Stack>
        <Title order={2} mb="lg">
          Website Settings
        </Title>

        <Group align="flex-start">
          <Title order={4} miw={"150px"}>
            User Section
          </Title>
          <Stack>
            <Switch
              label="Under Maintenance"
              checked={settings.userSectionUnderMaintenance}
              onChange={(event) =>
                updateSettings({
                  userSectionUnderMaintenance: event.currentTarget.checked,
                })
              }
              disabled={loading}
            />
            <Switch
              label="Under Construction"
              checked={settings.userSectionUnderConstruction}
              onChange={(event) =>
                updateSettings({
                  userSectionUnderConstruction: event.currentTarget.checked,
                })
              }
              disabled={loading}
            />
          </Stack>
        </Group>

        <hr />

        <Group align="flex-start">
          <Title order={4} miw={"150px"}>
            Admin Section
          </Title>
          <Stack>
            <Switch
              label="Under Maintenance"
              checked={settings.adminSectionUnderMaintenance}
              onChange={(event) =>
                updateSettings({
                  adminSectionUnderMaintenance: event.currentTarget.checked,
                })
              }
              disabled={loading}
            />
            <Switch
              label="Under Construction"
              checked={settings.adminSectionUnderConstruction}
              onChange={(event) =>
                updateSettings({
                  adminSectionUnderConstruction: event.currentTarget.checked,
                })
              }
              disabled={loading}
            />
          </Stack>
        </Group>
      </Stack>
    </Paper>
  );
}
