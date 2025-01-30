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

const ResetPasswordEmail = ({ verificationCode = "678567" }: Props) => (
  <Html>
    <Head />
    <Preview>Reset Your Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png`}
          width="70"
          height="45"
          alt="FMT"
          style={logo}
        />
        <Heading as="h4">Reset Password</Heading>
        <Text style={paragraph}>
          You&apos;ve requested to reset your password for your FMT account. Use
          the code below to confirm your email and reset your password:
        </Text>

        <Section style={verificationSection}>
          <Text style={codeText}>{verificationCode}</Text>
          <Text style={validityText}>This code is valid for 1 hour</Text>
        </Section>

        <Section>
          <Text>
            If you encounter any issues during the process or need further
            assistance, please do not hesitate to reach out at
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
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  verificationCode: "678567",
} as Props;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "16px 0",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

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

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
