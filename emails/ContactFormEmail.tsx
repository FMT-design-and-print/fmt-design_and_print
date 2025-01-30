import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
  Heading,
  Hr,
  Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Message from {name}</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container>
            <Section className="bg-white px-6 py-8">
              <Img
                src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png"
                width="70"
                height="45"
                alt="FMT"
                className="mb-4"
              />

              <Heading className="text-2xl font-bold text-gray-900 mb-6">
                New Contact Form Message
              </Heading>

              <Section className="mb-6">
                <Text className="text-gray-700 mb-2">
                  <strong>From:</strong> {name}
                </Text>
                <Text className="text-gray-700 mb-2">
                  <strong>Email:</strong> {email}
                </Text>
                <Hr className="my-4 border-gray-200" />
                <Text className="text-gray-700 whitespace-pre-wrap">
                  {message}
                </Text>
              </Section>

              <Hr className="my-6 border-gray-200" />
              <Text className="text-sm text-gray-500">
                This message was sent from the contact form on
                fmtdesignprint.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
