import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface MessageEmailProps {
  subject: string;
  content: string;
}

export default function MessageEmail({ subject, content }: MessageEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container className="mx-auto py-5 px-4">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              {subject}
            </Heading>
            <Text className="text-gray-700 mb-0 leading-relaxed">
              {content}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
