import { Component, ReactNode } from "react";
import { Paper, Title, Text, Button, Stack } from "@mantine/core";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="md">
            <Title order={3} c="red">
              Something went wrong
            </Title>
            <Text size="sm" c="dimmed">
              {this.state.error?.message || "An unexpected error occurred"}
            </Text>
            <Button
              color="pink"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </Button>
          </Stack>
        </Paper>
      );
    }

    return this.props.children;
  }
}
