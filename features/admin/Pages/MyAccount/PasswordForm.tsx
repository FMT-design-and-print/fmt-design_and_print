import { useForm } from "react-hook-form";
import { Box, Button, Alert, PasswordInput } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormData) => {
    setIsLoading(true);
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: await supabase.auth
          .getUser()
          .then(({ data }) => data.user?.email || ""),
        password: values.currentPassword,
      });

      if (signInError) {
        setError("Current password is incorrect");
        setShowError(true);
        setShowSuccess(false);
        return;
      }

      // If current password is correct, proceed with update
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (updateError) throw updateError;

      setShowSuccess(true);
      setShowError(false);
      setError(null);
      form.reset();
    } catch (err) {
      console.error(err);
      setError("Failed to update password. Please try again.");
      setShowError(true);
      setShowSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
      {showSuccess && (
        <Alert
          icon={<IconCheck size={16} />}
          color="green"
          mb="md"
          withCloseButton
          onClose={() => setShowSuccess(false)}
        >
          Password updated successfully
        </Alert>
      )}
      {error && showError && (
        <Alert
          icon={<IconX size={16} />}
          color="red"
          mb="md"
          withCloseButton
          onClose={() => setShowError(false)}
        >
          {error}
        </Alert>
      )}

      <Box maw={400}>
        <PasswordInput
          label="Current Password"
          placeholder="Enter your current password"
          mb="md"
          {...form.register("currentPassword")}
          error={form.formState.errors.currentPassword?.message}
        />
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
          mb="md"
          {...form.register("newPassword")}
          error={form.formState.errors.newPassword?.message}
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm new password"
          mb="xl"
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Button
          className="btn"
          type="submit"
          size="sm"
          loading={isLoading}
          disabled={isLoading}
        >
          Update Password
        </Button>
      </Box>
    </Box>
  );
}
