import {
  IconBrandWechat,
  IconCalculator,
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
import { Dashboard } from "../Pages/Dashboard";
import { Orders } from "../Pages/Orders";
import { IAdminNavItems } from "@/types";

export const adminNavItems: IAdminNavItems[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <IconGauge />,
    isVisible: true,
    component: <Dashboard />,
  },
  {
    value: "customers",
    label: "Customers",
    icon: <IconUsersGroup />,
    isVisible: true,
    component: <>Customers</>,
  },
  {
    value: "orders",
    label: "Orders",
    icon: <IconShoppingCart />,
    isVisible: true,
    component: <Orders />,
  },
  {
    value: "reviews",
    label: "Reviews",
    icon: <IconStars />,
    isVisible: false,
    component: <>Reviews</>,
  },
  {
    value: "messages",
    label: "Messages",
    icon: <IconMail />,
    isVisible: true,
    component: <>Messages</>,
  },
  {
    value: "chat",
    label: "Chat",
    icon: <IconBrandWechat />,
    isVisible: false,
    component: <>Chat</>,
  },
  {
    value: "discount-coupons",
    label: "Discount & Coupons",
    icon: <IconTicket />,
    isVisible: false,
    component: <>Discount & Coupons</>,
  },
  {
    value: "invoices",
    label: "Invoices",
    icon: <IconFileInvoice />,
    isVisible: false,
    component: <>Invoices</>,
  },
  {
    value: "receipts",
    label: "Receipts",
    icon: <IconReceipt />,
    isVisible: false,
    component: <>Receipts</>,
  },
  {
    value: "reports",
    label: "Reports",
    icon: <IconFileAnalytics />,
    isVisible: false,
    component: <>Reports</>,
  },
  {
    value: "employees",
    label: "Employees",
    icon: <IconUser />,
    isVisible: true,
    component: <>Employees</>,
  },

  {
    value: "price-calculator",
    label: "Price Calculator",
    icon: <IconCalculator />,
    isVisible: true,
    component: <>Price Calculator</>,
  },

  "divider",

  {
    value: "my-account",
    label: "My Account",
    icon: <IconUserCog />,
    isVisible: true,
    component: <>My Account</>,
  },
];
