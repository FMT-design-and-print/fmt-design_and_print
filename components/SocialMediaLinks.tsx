import { ActionIcon, rem } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
} from "@tabler/icons-react";
import Link from "next/link";

const socialMediaHandles = [
  {
    name: "Twitter",
    handle: "https://x.com/fmtdesignprint",
    icon: IconBrandTwitter,
  },
  {
    name: "Instagram",
    handle: "https://www.instagram.com/fmtdesignprint/",
    icon: IconBrandInstagram,
  },
  {
    name: "Facebook",
    handle: "https://www.facebook.com/fmtdesignprint",
    icon: IconBrandFacebook,
  },

  {
    name: "TikTok",
    handle: "https://www.tiktok.com/@fmtdesignprint",
    icon: IconBrandTiktok,
  },
];

export const SocialMediaLinks = () => {
  return socialMediaHandles.map((handle) => (
    <ActionIcon
      key={handle.name}
      component={Link}
      href={handle.handle}
      target="_blank"
      rel="noopener noreferrer"
      size="lg"
      color="gray.2"
      variant="subtle"
      aria-label={handle.name}
    >
      <handle.icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
    </ActionIcon>
  ));
};
