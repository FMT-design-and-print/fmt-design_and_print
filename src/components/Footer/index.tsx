"use client";
import { Container, Text } from "@mantine/core";
import { FMTLogo } from "../FMTLogo";
import { SocialMediaLinks } from "../SocialMediaLinks";
import classes from "./Footer.module.css";

const thisYear = new Date().getFullYear();

const data = [
  {
    title: "About Company",
    links: [
      { label: "Contact Us", link: "#" },
      { label: "About Us", link: "#" },
      { label: "Privacy Policy", link: "#" },
      { label: "Shipping and Returns", link: "#" },
      { label: "Terms of Use", link: "#" },
      { label: "Mission Statement", link: "#" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "All Services", link: "#" },
      { label: "FAQ", link: "#" },
      { label: "Support", link: "#" },
      { label: "Artwork Help", link: "#" },
    ],
  },
  {
    title: "Tools & Resources",
    links: [
      { label: "Price Calculator", link: "#" },
      { label: "Online Editor", link: "#" },
      { label: "Color Picker", link: "#" },
    ],
  },
];

export function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
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

        <SocialMediaLinks />
      </Container>
    </footer>
  );
}
