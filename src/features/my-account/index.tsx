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

const topLinks: ILink[] = [
  {
    icon: <IconPackage size="1rem" />,
    label: "My Orders",
    link: "/my-account/orders",
  },
  {
    icon: <IconMail size="1rem" />,
    label: "Inbox",
    notifications: 2,
    link: "/my-account/inbox",
  },
  {
    icon: <IconTicket size="1rem" />,
    label: "My Coupons",
    link: "/my-account/coupons",
  },
  {
    icon: <IconHeart size="1rem" />,
    label: "Saved Items",
    link: "/my-account/saved-items",
  },
  {
    icon: <IconHistory size="1rem" />,
    label: "Recently viewed",
    link: "/my-account/recently-viewed",
  },
  {
    icon: <IconClockSearch size="1rem" />,
    label: "Recently Searched",
    link: "/my-account/recently-searched",
  },
];

const accountLinks: ILink[] = [
  {
    icon: <IconUser size="1rem" />,
    label: "Profile",
    link: "/my-account/profile",
  },
  {
    icon: <IconMapPins size="1rem" />,
    label: "Shipping Address",
    link: "/my-account/shipping-address",
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

        <Box p="lg" style={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Flex>
    </>
  );
}
