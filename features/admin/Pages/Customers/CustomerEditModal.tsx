"use client";

import { useState } from "react";
import { Modal, TextInput, Select, Stack, Button, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IUserDetails } from "@/types/user";
import { createClient } from "@/utils/supabase/client";

interface CustomerEditModalProps {
  opened: boolean;
  onClose?: () => void;
  customer: IUserDetails | null;
  onUpdate?: () => void;
}

export default function CustomerEditModal({
  opened,
  onClose,
  customer,
  onUpdate,
}: CustomerEditModalProps) {
  const [formData, setFormData] = useState<Partial<IUserDetails>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const supabase = createClient();

    if (!customer?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update(formData)
        .eq("id", customer.id);

      if (error) throw error;

      notifications.show({
        title: "Success",
        message: "Customer details updated successfully",
        color: "green",
      });

      onUpdate?.();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      notifications.show({
        title: "Error",
        message: "Failed to update customer details",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose || (() => {})}
      title="Edit Customer Details"
      size="lg"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Stack gap="md">
          <TextInput
            label="First Name"
            defaultValue={customer?.firstName || ""}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />

          <TextInput
            label="Last Name"
            defaultValue={customer?.lastName || ""}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />

          <TextInput
            label="Email"
            type="email"
            defaultValue={customer?.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <TextInput
            label="Phone"
            defaultValue={customer?.phone || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <Select
            label="Gender"
            defaultValue={customer?.gender || ""}
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            onChange={(value) => setFormData({ ...formData, gender: value })}
          />

          <TextInput
            label="Country"
            defaultValue={customer?.country || ""}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />

          <TextInput
            label="Region"
            defaultValue={customer?.region?.name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                region: { id: customer?.region?.id || 0, name: e.target.value },
              })
            }
          />

          <DateInput
            label="Date of Birth"
            defaultValue={
              customer?.dateOfBirth ? new Date(customer.dateOfBirth) : null
            }
            onChange={(value) =>
              setFormData({ ...formData, dateOfBirth: value })
            }
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose} size="sm" color="pink">
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="pink" size="sm">
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
