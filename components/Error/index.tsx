import { Title, Text, Button, Container, Group, Box } from "@mantine/core";
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
          There was an error encountered while loading this page. If this is not
          internet issue, don&apos;t worry, our development team was already
          notified.
        </Text>
        <Box className="text-center">
          <Text>Here are some friendly suggestions to troubleshoot</Text>
          <ol>
            <li className="my-4 text-sm text-gray-500">
              Ensure you&apos;re connected to the internet.
            </li>
            <li className="my-4 text-sm text-gray-500">
              Verify if there are any temporary network issues or outages.
            </li>
            <li className="my-4 text-sm text-gray-500">
              Double-check the accuracy of the page URL you are visiting.
            </li>

            <li className="my-4 text-sm text-gray-500">
              If using a bookmark, make sure it points to the correct page.
            </li>
            <li className="my-4 text-sm text-gray-500">
              If the problem persists, clear your browser cache and cookies.
            </li>
            <li className="my-4 text-sm text-gray-500">
              Refresh the page and try again.
            </li>
          </ol>
        </Box>

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
          Contact Support (customer-service@fmt.com) if this issue persist
        </Text>
      </Container>
    </div>
  );
}
