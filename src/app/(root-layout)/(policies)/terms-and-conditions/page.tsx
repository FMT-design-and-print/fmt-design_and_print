import React from "react";
import { Container, Text, Divider, Title } from "@mantine/core";
import { Metadata } from "next";
import { redirectAdminUser } from "@/lib/actions/admin-check.actions";

export const metadata: Metadata = {
  title: "Terms of Use | FMT Design and Print",
};

const TermsOfUsePage = async () => {
  await redirectAdminUser();

  return (
    <Container size="sm">
      <Title order={1} ta="center" my={20}>
        Terms and Conditions
      </Title>
      <Divider style={{ margin: "0 auto 20px" }} />

      <Text size="lg" fw={700} my={10}>
        1. Introduction
      </Text>
      <Text size="md" my={20}>
        These Terms and Conditions (&quot;Terms&quot;) govern the provision of
        products and services (&quot;Services&quot;) by FMT Design and print
        (&quot;We,&quot; &quot;Us,&quot; or &quot;Our&quot;) to the client
        (&quot;Client,&quot; &quot;You,&quot; or &quot;Your&quot;). By accepting
        a quote or making a payment, you agree to be bound by these Terms.
      </Text>

      <Text size="lg" fw={700} my={10}>
        2. Quotes and Estimates
      </Text>
      <Text size="md" my={20}>
        2.1. Validity: Quotes provided by Us are valid for [X] days from the
        date of issue, unless otherwise stated. 2.2. Acceptance: To accept a
        quote, you must sign and return the quote or provide written
        confirmation via email. Upon acceptance, these Terms apply to the
        Services outlined in the quote.
      </Text>

      <Text size="lg" fw={700} my={10}>
        3. Pricing and Payment
      </Text>
      <Text size="md" my={20}>
        <b>3.1. Pricing:</b> All prices quoted are exclusive of applicable taxes
        unless otherwise stated. Taxes will be added as required by law. <br />{" "}
        <b>3.2. Payment Terms:</b> Payment is due within 7 days of the invoice
        date unless otherwise specified. We reserve the right to require a
        deposit or full payment before commencing work.
        <br /> <b>3.3. Additional Costs: </b>Any additional work or changes
        requested by the Client that are not covered in the original quote will
        be charged at our standard rates.
      </Text>

      <Text size="lg" fw={700} my={10}>
        4. Delivery of Services
      </Text>
      <Text size="md" my={20}>
        <b>4.1. Timeline:</b> We will make every reasonable effort to deliver
        the Services within the estimated timeline. However, delivery dates are
        not guaranteed and may be subject to change due to unforeseen
        circumstances.
        <br />
        <b>4.2 Client Obligations:.</b> You agree to provide all necessary
        information, materials, and approvals in a timely manner to facilitate
        the delivery of the Services.
      </Text>

      <Text size="lg" fw={700} my={10}>
        4. Delivery of Services
      </Text>
      <Text size="md" my={20}>
        <b>5.1. Scope of Work:</b> Any changes to the scope of work after
        acceptance of the quote may result in additional charges and revised
        delivery timelines.
        <br /> <b>5.2. Revisions:</b> We allow for 3 rounds of revisions. Any
        additional revisions may incur extra costs.
      </Text>

      <Text size="lg" fw={700} my={10}>
        4. Cancellation and Refunds
      </Text>
      <Text size="md" my={20}>
        <b>6.1. Cancellation by Client:</b> If you have an account with us, once
        an order has NOT been confirmed, you can cancel your order or modify it,
        You can go to My account {">"} My Orders page to check the status of
        your order. Note that once an order has been confirmed, we are unable to
        cancel or modify it. However, if you have any concerns or need
        assistance, please contact our customer service team, and we&apos;ll do
        our best to accommodate your request.
        <br /> <b>6.2. Refunds:</b> Refunds will only be provided at our
        discretion and will be subject to deductions for work already completed
        and any expenses incurred.
      </Text>

      <Text size="lg" fw={700} my={10}>
        7. Confidentiality
      </Text>
      <Text size="md" my={20}>
        <b>7.1. Confidential Information: </b> Both parties agree to keep all
        confidential information received from the other party private and
        secure, and not to disclose it to any third party without prior written
        consent.
        <br /> <b>7.2. Use of Work:</b> We reserve the right to showcase the
        completed work as part of our portfolio unless a non-disclosure
        agreement (NDA) is in place.
      </Text>

      <Text size="lg" fw={700} my={10}>
        9. Limitation of Liability
      </Text>
      <Text size="md" my={20}>
        <b>9.1. No Liability: </b> We shall not be liable for any indirect,
        incidental, or consequential damages arising out of or related to the
        Services provided, including but not limited to loss of revenue,
        profits, or data.
        <br /> <b>9.2. Maximum Liability:</b> Our total liability for any claim
        related to the Services shall not exceed the total amount paid by the
        Client for those Services.
      </Text>

      <Text size="lg" fw={700} my={10}>
        10. Force Majeure
      </Text>
      <Text size="md" my={20}>
        <b>10.1. Definition: </b> We shall not be liable for any delays or
        failure to perform our obligations under these Terms due to events
        beyond our reasonable control, including but not limited to acts of God,
        war, strikes, or governmental actions.
        <br /> <b>10.2. Notification: </b> In the event of a force majeure, we
        will notify you as soon as possible and make every effort to resume
        performance of our obligations promptly.
      </Text>

      <Text size="lg" fw={700} my={10}>
        11. Governing Law
      </Text>
      <Text size="md" my={20}>
        <b>11.1. Jurisdiction: </b> These Terms shall be governed by and
        construed in accordance with the laws of Ghana. Any disputes arising
        from these Terms shall be subject to the exclusive jurisdiction of the
        courts of Ghana.
      </Text>

      <Text size="lg" fw={700} my={10}>
        12. Amendments
      </Text>
      <Text size="md" my={20}>
        <b>12.1. Changes: </b> We reserve the right to update or amend these
        Terms at any time. Any changes will be communicated to the Client and
        will apply to future engagements.
      </Text>

      <Text size="lg" fw={700} my={10}>
        13. Acceptance
      </Text>
      <Text size="md" my={20}>
        <b>13.1. Agreement: </b> By using our services and making
        order/payments, you acknowledge that you have read, understood, and
        agree to these Terms and Conditions.
      </Text>

      <Text size="sm" my={30}>
        If you have any questions or concerns about our Terms and services,
        please contact us at policy@fmtdesignandprint.com.
      </Text>
    </Container>
  );
};

export default TermsOfUsePage;
