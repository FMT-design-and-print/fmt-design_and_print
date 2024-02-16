import { Box, Divider, Flex, Group, Text } from "@mantine/core";
import {
  IconClockSearch,
  IconHeart,
  IconHistory,
  IconMail,
  IconMapPins,
  IconPackage,
  IconTicket,
  IconUser,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { ILink } from "./types";
import { featureFlags } from "@/constants/feature-flags";

const topLinks: ILink[] = [
  {
    icon: <IconPackage size="1rem" />,
    label: "My Orders",
    link: "/my-account/orders",
    isVisible: true,
  },
  {
    icon: <IconMail size="1rem" />,
    label: "Inbox",
    notifications: 2,
    link: "/my-account/inbox",
    isVisible: featureFlags.inbox,
  },
  {
    icon: <IconTicket size="1rem" />,
    label: "My Coupons",
    link: "/my-account/coupons",
    isVisible: true,
  },
  {
    icon: <IconHeart size="1rem" />,
    label: "Saved Items",
    link: "/my-account/saved-items",
    isVisible: true,
  },
  {
    icon: <IconHistory size="1rem" />,
    label: "Recently viewed",
    link: "/my-account/recently-viewed",
    isVisible: featureFlags.recentlyViewed,
  },
  {
    icon: <IconClockSearch size="1rem" />,
    label: "Recently Searched",
    link: "/my-account/recently-searched",
    isVisible: featureFlags.recentlySearched,
  },
];

const accountLinks: ILink[] = [
  {
    icon: <IconUser size="1rem" />,
    label: "Profile",
    link: "/my-account/profile",
    isVisible: true,
  },
  {
    icon: <IconMapPins size="1rem" />,
    label: "Shipping Address",
    link: "/my-account/shipping-address",
    isVisible: true,
  },
];

interface Props {
  email: string;
  name?: string;
  children: ReactNode;
}

export function MyAccount({ email, name, children }: Props) {
  return (
    <>
      <Box hiddenFrom="md">
        <Group justify="space-between" p="xs">
          <Text size="sm" fw="bold" mx="md" c="pink.6">
            My Account
          </Text>
          <MobileMenu
            email={email}
            name={name}
            image=""
            topLinks={topLinks}
            accountLinks={accountLinks}
          />
        </Group>
        <Divider />
      </Box>

      <Flex>
        <Box visibleFrom="md">
          <DesktopMenu
            name={name}
            image=""
            email={email}
            topLinks={topLinks}
            accountLinks={accountLinks}
          />
        </Box>

        <Box p="lg" style={{ flexGrow: 1, width: "100%" }}>
          {children}
        </Box>
      </Flex>
    </>
  );
}
