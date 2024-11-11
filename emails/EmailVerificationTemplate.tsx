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

interface Props {
  verificationCode?: string;
}

export default function EmailVerificationTemplate({
  verificationCode = "596853",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Email Verification - FMT Design and Print</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Img
              src={`https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png`}
              width="70"
              height="45"
              alt="FMT"
              style={logo}
            />
            <Section style={upperSection}>
              <Heading style={h1}>Verify your email address</Heading>
              <Text style={mainText}>
                {
                  "Thanks for creating an account. Please enter the following verification code when prompted."
                }
              </Text>
              <Section style={verificationSection}>
                <Text style={codeText}>{verificationCode}</Text>
                <Text style={validityText}>This code is valid for 1 hour</Text>
              </Section>
            </Section>
          </Section>
          <Hr style={hr} />
          FMT Design and Print
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  border: "1px solid #eee",
};

const logo = {
  margin: "20px auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "16px 0",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
};

const validityText = {
  ...text,
  margin: "0px",
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
