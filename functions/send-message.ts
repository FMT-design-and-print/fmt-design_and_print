import { createClient } from "@/utils/supabase/client";

interface SendMessageParams {
  subject: string;
  content: string;
  source: string;
  metadata?: object;
}

export const sendMessage = async ({
  subject,
  content,
  source,
  metadata,
}: SendMessageParams) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("messages").insert([
    {
      subject,
      content,
      source,
      group: "inbox",
      status: "unread",
      metadata,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return data || { success: true };
};
