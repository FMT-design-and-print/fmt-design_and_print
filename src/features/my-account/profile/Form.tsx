"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { regionsInGhana } from "@/constants/gh-regions";
import { getChangedDetails } from "@/functions/user";
import { IUserDetails } from "@/types/user";
import { createClient } from "@/utils/supabase/client";
import {
  Box,
  Button,
  Card,
  InputLabel,
  SegmentedControl,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  user: IUserDetails;
}

export const ProfileForm = ({ user }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<IUserDetails>({ ...user });

  const dob =
    !userDetails.dateOfBirth || userDetails.dateOfBirth == null
      ? undefined
      : new Date(userDetails.dateOfBirth);

  const update = (key: keyof IUserDetails, value: any) => {
    setUserDetails({ ...userDetails, [key]: value });
  };

  const handleUpdateUserDetails = async () => {
    const changedDetails = getChangedDetails(user, userDetails);

    if (Object.keys(changedDetails).length > 0) {
      const supabase = createClient();
      setLoading(true);
      await supabase
        .from("users")
        .update(changedDetails)
        .eq("id", user.id)
        .select();
      setLoading(false);

      toast.success("Profile details updated");
      router.refresh();
    }
  };

  return (
    <Card maw={500} withBorder my="sm" mx="auto">
      <LoadingOverlay visible={loading} />
      <Title ta="center" order={3} py={16} c="dimmed">
        Update Profile
      </Title>

      <Stack>
        <TextInput
          type="email"
          value={user.email}
          label="Email"
          placeholder="qI8gM@example.com"
          readOnly
        />
        <TextInput
          value={userDetails?.firstName || ""}
          onChange={(e) => update("firstName", e.currentTarget.value)}
          label="First name"
          placeholder="John Doe"
          autoComplete="on"
        />
        <TextInput
          value={userDetails?.lastName || ""}
          onChange={(e) => update("lastName", e.currentTarget.value)}
          label="Last name"
          placeholder="John Doe"
          autoComplete="on"
        />
        <TextInput
          value={userDetails?.phone || ""}
          onChange={(e) => update("phone", e.currentTarget.value)}
          label="Phone"
          placeholder="+233555555555"
        />
        <Select
          value={userDetails?.country || ""}
          onChange={(value) => update("country", value || "")}
          comboboxProps={{ withinPortal: true }}
          data={[{ value: "ghana", label: "Ghana" }]}
          placeholder="Ghana"
          label="Country"
        />

        <Select
          value={userDetails?.region || ""}
          onChange={(value) => update("region", value || "")}
          comboboxProps={{ withinPortal: true }}
          data={regionsInGhana}
          label="Region"
          placeholder="choose region"
        />
        <Box>
          <InputLabel mb={0}>Gender</InputLabel>
          <br />
          <SegmentedControl
            value={userDetails.gender || "Male"}
            onChange={(value) => update("gender", value)}
            data={["Male", "Female", "Other"]}
          />
        </Box>
        <DateInput
          value={dob}
          onChange={(value) => update("dateOfBirth", value)}
          valueFormat="DD MMM YYYY"
          label="Date of Birth"
          placeholder="DD MMM YYYY"
        />

        <Button className="btn" onClick={() => handleUpdateUserDetails()}>
          Update
        </Button>
      </Stack>
    </Card>
  );
};
