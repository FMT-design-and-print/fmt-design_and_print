import {
  Box,
  Button,
  TextInput,
  Grid,
  Alert,
  Text,
  Card,
  Avatar,
  Flex,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { z } from "zod";
import { useUserAccount } from "./hooks/useUserAccount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { user, isLoading, updateProfile } = useUserAccount();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { reset, formState, register, watch, handleSubmit } =
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        avatar: "",
      },
    });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        avatar: user.avatar ?? "",
      });
    }
  }, [user, reset]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const onSubmit = async (values: ProfileFormData) => {
    updateProfile.mutate(values);
    setShowSuccess(true);
    setShowError(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {updateProfile.isSuccess && showSuccess && (
        <Alert
          icon={<IconCheck size={16} />}
          color="green"
          mb="md"
          withCloseButton
          onClose={() => setShowSuccess(false)}
        >
          Profile updated successfully
        </Alert>
      )}
      {updateProfile.isError && showError && (
        <Alert
          icon={<IconX size={16} />}
          color="red"
          mb="md"
          withCloseButton
          onClose={() => setShowError(false)}
        >
          Failed to update profile. Please try again.
        </Alert>
      )}

      <Grid>
        <Grid.Col span={12}>
          <TextInput
            label="Email"
            value={user?.email}
            disabled
            description="Email cannot be changed"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Role"
            value={user?.role}
            disabled
            description="Role cannot be changed"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            {...register("firstName")}
            error={formState.errors.firstName?.message}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            {...register("lastName")}
            error={formState.errors.lastName?.message}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Flex gap={8} align="flex-end">
            <Card withBorder p="xs">
              <Avatar src={watch("avatar")} size="lg" />
            </Card>
            <TextInput
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpg"
              {...register("avatar")}
              error={formState.errors.avatar?.message}
              flex={1}
            />
          </Flex>
        </Grid.Col>
      </Grid>

      <Box mt="xl">
        <Button
          className="btn"
          type="submit"
          size="sm"
          loading={updateProfile.isPending}
        >
          Update Profile
        </Button>
      </Box>
    </Box>
  );
}
