import {
  Card,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { IconBrandSupabase } from "@tabler/icons-react";
import { FcGoogle } from "react-icons/fc";
import { HiBars3BottomLeft } from "react-icons/hi2";
import {
  SiCloudinary,
  SiNetlify,
  SiResend,
  SiSanity,
  SiSentry,
} from "react-icons/si";
import classes from "./Styles.module.css";

const mockdata = [
  {
    title: "Supabase",
    icon: IconBrandSupabase,
    color: "teal",
    link: "https://supabase.com/dashboard/projects",
  },
  {
    title: "Sanity",
    icon: SiSanity,
    color: "pink",
    link: "https://www.sanity.io/manage/personal/projects",
  },
  {
    title: "Resend",
    icon: SiResend,
    color: "gray",
    link: "https://resend.com/emails",
  },
  {
    title: "Netlify",
    icon: SiNetlify,
    color: "green",
    link: "https://app.netlify.com/sites/fmtdesignprint/overview",
  },
  {
    title: "Cloudinary",
    icon: SiCloudinary,
    color: "indigo",
    link: "https://console.cloudinary.com/console/c-3b6a0489874a0f570a119f26a96eac/home/product-explorer",
  },
  {
    title: "Sentry",
    icon: SiSentry,
    color: "pink",
    link: "https://fmt-design-and-print.sentry.io/projects/",
  },
  { title: "Google Analytics", icon: FcGoogle, color: "green", link: "#" },
  {
    title: "Paystack",
    icon: HiBars3BottomLeft,
    color: "cyan",
    link: "https://dashboard.paystack.com/#/dashboard",
  },
];

export function Services() {
  const theme = useMantineTheme();

  const items = mockdata.map((item) => (
    <UnstyledButton
      key={item.title}
      className={classes.item}
      component="a"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <item.icon color={theme.colors[item.color][6]} size="2rem" />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>Services</Text>
      </Group>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
