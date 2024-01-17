import { Title, Text, Button, Container, Group } from "@mantine/core";
import classes from "./Error.module.css";

interface Props {
  reset: () => void;
}
export function ErrorComponent({ reset }: Props) {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>Sorry!</div>
        <Title className={classes.title}>Something went wrong!</Title>
        <Text size="lg" ta="center" className={classes.description}>
          There was an error encountered while loading this page. Don&apos;t
          worry, our development team was already notified. Try refreshing the
          page.
        </Text>

        <Group justify="center">
          <Button
            variant="light"
            color="pink"
            size="md"
            onClick={() => reset()}
          >
            Refresh the page
          </Button>
        </Group>

        <Text my="lg" ta="center" fs="italic" c="gray.6">
          Contact Support if this issue persist
        </Text>
      </Container>
    </div>
  );
}
