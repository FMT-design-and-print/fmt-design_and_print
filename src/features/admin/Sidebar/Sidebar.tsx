import { LogoutButton } from "@/components/LogoutButton";
import {
  Avatar,
  Button,
  Center,
  Divider,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import {
  IconBrandWechat,
  IconCalculator,
  IconDeviceLaptop,
  IconFileAnalytics,
  IconFileInvoice,
  IconGauge,
  IconMail,
  IconReceipt,
  IconShoppingCart,
  IconStars,
  IconTicket,
  IconUser,
  IconUserCog,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import classes from "./Sidebar.module.css";

const navItems = [
  { value: "dashboard", label: "Dashboard", icon: IconGauge, isVisible: true },
  {
    value: "customers",
    label: "Customers",
    icon: IconUsersGroup,
    isVisible: true,
  },
  { value: "orders", label: "Orders", icon: IconShoppingCart, isVisible: true },
  { value: "reviews", label: "Reviews", icon: IconStars, isVisible: false },
  { value: "messages", label: "Messages", icon: IconMail, isVisible: true },
  { value: "chat", label: "Chat", icon: IconBrandWechat, isVisible: false },
  {
    value: "discount-coupons",
    label: "Discount & Coupons",
    icon: IconTicket,
    isVisible: false,
  },

  {
    value: "invoices",
    label: "Invoices",
    icon: IconFileInvoice,
    isVisible: false,
  },
  { value: "receipts", label: "Receipts", icon: IconReceipt, isVisible: false },
  {
    value: "reports",
    label: "Reports",
    icon: IconFileAnalytics,
    isVisible: false,
  },
  { value: "employees", label: "Employees", icon: IconUser, isVisible: true },

  {
    value: "price-calculator",
    label: "Price Calculator",
    icon: IconCalculator,
    isVisible: true,
  },
];

export function Sidebar() {
  const links = navItems.map((item) =>
    item.isVisible ? (
      <Group key={item.value} p="sm" className={classes.link}>
        <Avatar radius="md">{<item.icon />}</Avatar>
        <Text>{item.label}</Text>
      </Group>
    ) : null
  );

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Text fw="bold">FMT Design and Print</Text>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <Center px="md">
          <Button
            leftSection={<IconDeviceLaptop />}
            component={Link}
            href="/admin/studio"
            variant="light"
            color="pink"
            w="100%"
            mt="sm"
          >
            Open Studio
          </Button>
        </Center>
        <Divider my="md" />
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <Button
          variant="subtle"
          color="gray"
          my="sm"
          size="md"
          w="100%"
          leftSection={
            <IconUserCog className={classes.linkIcon} stroke={1.5} />
          }
        >
          My Account
        </Button>

        <LogoutButton />
      </div>
    </nav>
  );
}
