"use client";
import { Accordion, Container, Title } from "@mantine/core";
import Link from "next/link";
import classes from "./Faq.module.css";

export function Faq() {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="order-placement">
          <Accordion.Control>How do I place an order?</Accordion.Control>
          <Accordion.Panel>
            To place an order, simply browse our website and select the product
            you&apos;d like. Add to cart or click on the buy icon to make your
            purchase. You can pay with Mobile money or credit Card.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="order-cancellation">
          <Accordion.Control>
            Can I cancel or modify my order after it&apos;s been placed?
          </Accordion.Control>
          <Accordion.Panel>
            Unfortunately, once an order has been placed and confirmed, we are
            unable to cancel or modify it. However, if you have any concerns or
            need assistance, please contact our customer service team, and
            we&apos;ll do our best to accommodate your request.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="order-duration">
          <Accordion.Control>
            How long will it take to receive my order?
          </Accordion.Control>
          <Accordion.Panel>
            The delivery time depends on several factors, including the
            complexity of your custom design and our current production
            schedule. Typically, orders are processed and shipped within 1 - 3
            business days. You will receive a tracking number once your order
            has been dispatched for delivery
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="return-policy">
          <Accordion.Control>What is your return policy?</Accordion.Control>
          <Accordion.Panel>
            We want you to be completely satisfied with your purchase. If for
            any reason you are not happy with your custom product, please
            contact us within 7 days of receiving your order to discuss a return
            or exchange. Please note that personalized items may be subject to
            certain restrictions.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="bulk-discount">
          <Accordion.Control>
            Do you offer bulk discounts for large orders?
          </Accordion.Control>
          <Accordion.Panel>
            Yes, we offer discounts for bulk orders. Please reach out to our
            sales team to discuss your specific requirements, and we&apos;ll
            provide you with a custom quote tailored to your needs.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="order-tracking">
          <Accordion.Control>
            Can I track the status of my order?
          </Accordion.Control>
          <Accordion.Panel>
            Yes, once your order has been processed and shipped, you will
            receive a tracking number via email. You can use this tracking
            number to monitor the status of your shipment and estimated delivery
            date. You can go to{" "}
            <Link href="/order-tracking" className="text-primary-400">
              Track my order page
            </Link>{" "}
            to track your order.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="contact-for-help">
          <Accordion.Control>
            How can I contact your customer service team?
          </Accordion.Control>
          <Accordion.Panel>
            You can reach our customer service team by sending email to
            customer@fmtdesignprint.com or calling +233537656594, Monday through
            Friday, 7am - 6pm GMT. Our friendly representatives are here to
            assist you with any questions or concerns you may have.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="artwork-file-types">
          <Accordion.Control>
            What types of files can I upload for customization?
          </Accordion.Control>
          <Accordion.Panel>
            We accept various file formats, including PNG, PDF, EPS and AI. For
            best results, we recommend using high-resolution images or vector
            files to ensure the quality of your custom design.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
