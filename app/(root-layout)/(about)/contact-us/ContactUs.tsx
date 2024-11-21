import { SocialMediaLinks } from "@/components/SocialMediaLinks";
import {
  Button,
  Group,
  SimpleGrid,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { ContactIconsList } from "./ContactIcons";
import classes from "./ContactUs.module.css";

export function ContactUs() {
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
        <div className={classes.form}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />
          <TextInput
            label="Name"
            placeholder="John Doe"
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />
          <Textarea
            required
            label="Your message"
            placeholder="I want to order your goods"
            minRows={4}
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />

          <Group justify="flex-end" mt="md">
            <Button className={classes.control}>Send message</Button>
          </Group>
        </div>
      </SimpleGrid>
    </div>
  );
}
