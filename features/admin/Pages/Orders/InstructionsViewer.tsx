import { useCustomReadOnlyEditor } from "@/hooks/useCustomEditor";
import { Box, Paper, Text, Title } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";

interface InstructionsViewerProps {
  instructions?: string;
}

export const InstructionsViewer = ({
  instructions,
}: InstructionsViewerProps) => {
  // Always call the hook, regardless of whether instructions exist
  const editor = useCustomReadOnlyEditor(instructions || "<p></p>");

  if (!instructions || instructions === "<p></p>") {
    return null;
  }

  return (
    <Box>
      <Title order={5} mb="md">
        Customer Instructions
      </Title>
      <Paper p="md" withBorder>
        {editor ? (
          <RichTextEditor editor={editor}>
            <RichTextEditor.Content />
          </RichTextEditor>
        ) : (
          <Text size="sm" c="dimmed">
            Loading instructions...
          </Text>
        )}
      </Paper>
    </Box>
  );
};
