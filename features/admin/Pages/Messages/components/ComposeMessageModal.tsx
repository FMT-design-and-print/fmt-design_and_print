import { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

interface ComposeMessageModalProps {
  opened: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ComposeMessageModal({
  opened,
  onClose,
  onSuccess,
}: ComposeMessageModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users for email selection
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("email, firstName, lastName")
        .order("firstName");

      if (error) throw error;
      return data.map((user) => ({
        value: user.email,
        label: `${user.firstName} ${user.lastName} (${user.email})`,
        email: user.email,
      }));
    },
  });

  const handleUserSelect = (value: string | null) => {
    setSelectedUser(value);
    if (value) {
      const selectedUserEmail = users.find(
        (user) => user.value === value
      )?.email;
      if (selectedUserEmail) {
        setEmail(selectedUserEmail);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    setLoading(true);

    try {
      // First create the message in the database
      const { error: dbError } = await createClient()
        .from("messages")
        .insert([
          {
            subject,
            content,
            status: "read",
            source: "admin",
            group: "sent",
            metadata: {
              recipient: email,
              isUser: !!selectedUser,
            },
          },
        ]);

      if (dbError) throw dbError;

      // Then send the email
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.success("Message sent successfully");
      onSuccess();
      setSelectedUser(null);
      setEmail("");
      setSubject("");
      setContent("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
    setEmail("");
    setSubject("");
    setContent("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Compose New Message"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md" pos="relative">
          <LoadingOverlay visible={isLoading} />

          <Stack gap="xs">
            <Select
              label="Select User (Optional)"
              placeholder="Choose a user"
              data={users}
              searchable
              clearable
              value={selectedUser}
              onChange={handleUserSelect}
            />

            <TextInput
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              description={
                selectedUser
                  ? "Email populated from selected user"
                  : "Enter any email address"
              }
            />
          </Stack>

          <TextInput
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Textarea
            label="Content"
            required
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="pink">
              Send Message
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
