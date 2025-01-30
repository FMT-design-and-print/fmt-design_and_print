"use client";
import { SocialMediaLinks } from "@/components/SocialMediaLinks";
import {
  Button,
  Group,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { ContactIconsList } from "./ContactIcons";
import classes from "./ContactUs.module.css";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface FormValues {
  email: string;
  name: string;
  message: string;
}

export function ContactUs() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    initialValues: {
      email: "",
      name: "",
      message: "",
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      message: (value: string) =>
        value.length < 10 ? "Message is too short" : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      notifications.show({
        title: "Success",
        message:
          "Your message has been sent successfully. We'll get back to you within 24 hours.",
        color: "green",
      });

      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      notifications.show({
        title: "Error",
        message: "Failed to send message. Please try again later.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={50}
        w={{ base: "100%", lg: "80%" }}
        mx="auto"
      >
        <div className={classes.contacts}>
          <Title className={classes.title}>Contact us</Title>
          <Text size="sm" className={classes.description} mt="sm" mb={30}>
            Leave your email and we will get back to you within 24 hours
          </Text>

          <ContactIconsList />

          <Group mt="xl">
            <SocialMediaLinks />
          </Group>
        </div>

        <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            classNames={{ input: classes.input, label: classes.inputLabel }}
            {...form.getInputProps("email")}
            disabled={isLoading}
          />
          <TextInput
            label="Name"
            placeholder="John Doe"
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
            {...form.getInputProps("name")}
            disabled={isLoading}
          />
          <Textarea
            required
            label="Your message"
            placeholder="I want to order your goods"
            minRows={8}
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
            {...form.getInputProps("message")}
            disabled={isLoading}
          />

          <Group justify="flex-end" mt="md">
            <Button
              className={classes.control}
              type="submit"
              loading={isLoading}
            >
              Send message
            </Button>
          </Group>
        </form>
      </SimpleGrid>
    </div>
  );
}
