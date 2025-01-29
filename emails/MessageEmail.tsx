import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
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
            <Img
              src={`https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png`}
              width="70"
              height="45"
              alt="FMT"
              style={logo}
            />

            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              {subject}
            </Heading>
            <Text className="text-gray-700 mb-0 leading-relaxed">
              {content}
            </Text>

            <Section>
              <Text>
                If you encounter any issues during the login process or need
                further assistance, please do not hesitate to reach out at
                <b> support@fmtdesignprint.com</b>
              </Text>
            </Section>

            <Text style={paragraph}>
              Regards,
              <br />
              FMT Design and Print
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              St. John&apos;s - Dome - Kwabenya - Brekuso Rd.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
