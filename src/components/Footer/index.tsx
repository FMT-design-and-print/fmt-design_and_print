"use client";
import { Container, Group, Text } from "@mantine/core";
import { FMTLogo } from "../FMTLogo";
import { SocialMediaLinks } from "../SocialMediaLinks";
import classes from "./Footer.module.css";
import Link from "next/link";

const thisYear = new Date().getFullYear();

const data = [
  {
    title: "About Company",
    links: [
      { label: "About Us", link: "/about-us" },
      { label: "Contact Us", link: "/contact-us" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "All Products", link: "/services" },
      { label: "FAQ", link: "/faq" },
      { label: "Artwork Help", link: "/artwork-help" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", link: "/privacy-policy" },
      { label: "Shipping and Returns", link: "/shipping-and-returns" },
      { label: "Terms of Use", link: "/terms-of-use" },
    ],
  },
  // {
  //   title: "Tools & Resources",
  //   links: [
  //     { label: "Price Calculator", link: "#" },
  //     { label: "Online Editor", link: "#" },
  //     { label: "Color Picker", link: "#" },
  //   ],
  // },
];

export function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component={Link}
        href={link.link}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <FMTLogo />
          <Text size="xs" c="gray.3" className={classes.description}>
            All forms of Graphic Design and Printing Services available to you
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © {thisYear} FMT Design & Print. All rights reserved.
        </Text>

        <Group gap={0} justify="flex-end" wrap="nowrap">
          <SocialMediaLinks />
        </Group>
      </Container>
    </footer>
  );
}
