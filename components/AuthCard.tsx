"use client";
import { MessageStatus } from "@/types";
import { getAlertColor } from "@/functions";
import { Alert, Avatar, Box, Card, Title } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  searchParams: { message: string; messageStatus?: MessageStatus };
}
export const AuthCard = ({ title, children, searchParams }: Props) => {
  const { bgColor, textColor } = getAlertColor(searchParams.messageStatus);

  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      mx="auto"
      my="2rem"
      withBorder
      maw="400px"
      bg="gray.0"
    >
      <Card.Section className="primary-gradient relative flex h-[150px] justify-center overflow-hidden rounded-t-md">
        <Avatar
          variant="filled"
          size="xl"
          mt="xl"
          mx="auto"
          radius="100%"
          color="grape"
          src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703264782/FMT/logo1_tpiges.png"
          bg="white"
          className="static z-10"
        />
        <Box
          bg="gray.0"
          className="absolute left-[-50px] top-[70px] mx-auto size-[500px] rounded-full border bg-gray-50 text-center text-lg font-bold text-primary-500"
        >
          <Title order={4} my="3rem">
            {title}
          </Title>
        </Box>
      </Card.Section>

      <Box px="lg" py="md">
        {children}
      </Box>

      {searchParams?.message && (
        <Alert variant="light" color={bgColor} className="text-center">
          <p className={textColor}>{searchParams.message}</p>
        </Alert>
      )}
    </Card>
  );
};
