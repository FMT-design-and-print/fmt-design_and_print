/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  user: IUserDetails;
  isUserSaved: boolean;
}

export const ProfileForm = ({ user, isUserSaved }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<IUserDetails>({ ...user });
  const queryClient = useQueryClient();

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

      if (isUserSaved) {
        setLoading(true);
        await supabase
          .from("users")
          .update(changedDetails as any)
          .eq("id", user.id);

        setLoading(false);
      } else {
        const { data } = await supabase
          .from("users")
          .insert([userDetails as any])
          .select(
            "firstName, lastName, profileImage, phone, country, region, gender, dateOfBirth"
          )
          .limit(1)
          .returns<IUserDetails[]>();
        setUserDetails((prevData) => ({ ...prevData, ...data?.[0] }));
      }

      toast.success("Profile details updated");
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      router.refresh();
    }
  };

  useEffect(() => {
    setUserDetails((prevDetails) => ({ ...prevDetails, ...user }));
  }, [user]);

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
          value={userDetails?.region?.id.toString() || ""}
          onChange={(value) => {
            const region = regionsInGhana.find(
              (region) => region.id.toString() === value
            );
            update("region", region || null);
          }}
          comboboxProps={{ withinPortal: true }}
          data={regionsInGhana.map((region) => ({
            value: region.id.toString(),
            label: region.name,
          }))}
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
