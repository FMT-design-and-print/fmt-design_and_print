import {
  Title,
  Text,
  Button,
  Container,
  Group,
  Box,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconRefresh,
  IconCheck,
  IconMail,
} from "@tabler/icons-react";
import classes from "./Error.module.css";

interface Props {
  reset: () => void;
}
export function ErrorComponent({ reset }: Props) {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.errorContainer}>
          <div className={classes.imageSection}>
            <div className={classes.label}>Oops!</div>
            <IconAlertCircle size={120} className={classes.icon} stroke={1.5} />
          </div>

          <div className={classes.contentSection}>
            <Title className={classes.title}>Something went wrong</Title>
            <Text size="lg" className={classes.description}>
              We encountered an issue while loading this page. Our team has been
              notified and is working on it.
            </Text>

            <Box className={classes.troubleshootSection}>
              <Text fw={600} size="lg" mb="md">
                Try these quick fixes:
              </Text>

              <List
                spacing="sm"
                size="md"
                center
                icon={
                  <ThemeIcon color="pink" size={24} radius="xl">
                    <IconCheck style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                <List.Item>Check your internet connection</List.Item>
                <List.Item>Refresh the page and try again</List.Item>
                <List.Item>Clear your browser cache and cookies</List.Item>
                <List.Item>Verify the URL is correct</List.Item>
              </List>

              <Group justify="center" mt="xl">
                <Button
                  variant="filled"
                  color="pink"
                  size="md"
                  onClick={() => reset()}
                  leftSection={<IconRefresh size={20} />}
                >
                  Refresh the page
                </Button>
              </Group>
            </Box>

            <Group justify="center" mt="xl" className={classes.supportSection}>
              <IconMail size={16} color="gray" />
              <Text c="dimmed" fs="italic" size="sm">
                Need help? Contact us at{" "}
                <a
                  href="mailto:customer-service@fmt.com"
                  className={classes.supportLink}
                >
                  customer-service@fmt.com
                </a>
              </Text>
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
}
