import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface QuoteEmailTemplateProps {
  subject: string;
  content: string;
  link: string;
  recipientName: string;
}

export default function QuoteEmailTemplate({
  subject,
  content,
  link,
  recipientName,
}: QuoteEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Tailwind>
        <Body style={main}>
          <Container className="mx-auto py-5 px-2">
            <Img
              src={`https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png`}
              width="70"
              height="45"
              alt="FMT"
              style={logo}
            />

            <Text className="text-gray-700 mb-0 leading-relaxed">
              Dear {recipientName || "Customer"},
            </Text>

            <Text className="text-gray-700 mb-0 leading-relaxed">
              {content} You can access it using the button below :
            </Text>

            <Section style={btnContainer}>
              <Button style={button} href={link}>
                Review Quote
              </Button>
            </Section>

            <Section>
              <Text className="text-gray-700 mb-0 leading-relaxed">
                Button does not work? Copy and paste the link into a browser URL
                to review your quote.
              </Text>
              <a href={link} className="text-blue-500 text-sm">
                {link}
              </a>
            </Section>

            <Section>
              <Text className="text-gray-700 mb-0 leading-relaxed">
                If you encounter any issues reviewing the quote or have any
                further questions, please don&apos;t hesitate to reach out at
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

QuoteEmailTemplate.PreviewProps = {
  subject: "Quote for order 1234567890",
  content:
    "We received a custom order request from you. We've created a quote for your order for you to review and make payment upon acceptance.",
  link: "http://localhost:3001/quotes/1234567890",
  recipientName: "John Doe",
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

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

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#f10849",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
