import {
  Body,
  Button,
  CodeInline,
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
import * as React from "react";

interface Props {
  firstName: string;
  email: string;
  tempPassword: string;
  origin: string;
}

export const NewAdminUserEmail = ({
  firstName,
  email,
  tempPassword,
  origin,
}: Props) => (
  <Html>
    <Head />
    <Preview>Welcome! Your New Admin Account Has Been Created</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png`}
          width="70"
          height="45"
          alt="FMT"
          style={logo}
        />
        <Text style={paragraph}>Hi {firstName},</Text>
        <Text style={paragraph}>
          Your new admin account has been successfully created. You can now
          access the FMT admin panel using the details provided below.
        </Text>

        <Section>
          <Heading as="h4">Login Details:</Heading>
          <Text>
            Username/Email: <b>{email}</b>
          </Text>
          <Text>
            Temporal Password:
            <CodeInline>
              <b> {tempPassword}</b>
            </CodeInline>
          </Text>
          <Text style={{ fontStyle: "italic" }}>
            Click on the button below to change your password
          </Text>
        </Section>

        <Section style={btnContainer}>
          <Button
            style={button}
            href={`${origin}/admin/new-admin-user-login?confirmed=false`}
          >
            Reset Password
          </Button>
        </Section>

        <Section>
          <Text>
            If you encounter any issues during the login process or need further
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

NewAdminUserEmail.PreviewProps = {
  firstName: "FMT",
  email: "admin@fmtdesignprint.com",
  tempPassword: "",
} as Props;

export default NewAdminUserEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
