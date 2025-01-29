import {
  IconBrandWechat,
  IconCalculator,
  IconFileAnalytics,
  IconFileInvoice,
  IconGauge,
  IconMail,
  IconMoneybag,
  IconReceipt,
  IconSettings2,
  IconShoppingCart,
  IconStars,
  IconTicket,
  IconUser,
  IconUserCog,
  IconUserShield,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Dashboard } from "../Pages/Dashboard";
import { Orders } from "../Pages/Orders";
import { IAdminNavItems } from "@/types";
import { AdminUsers } from "../Pages/AdminUsers";
import { UserPermission } from "@/types/roles";
import { Services } from "../Pages/Services";
import MyAccount from "../Pages/MyAccount";
import { PriceCalculator } from "../PriceCalculator";
import CustomersPage from "../Pages/Customers";
import MessagesPage from "../Pages/Messages";
import SalesExpenses from "../Pages/SalesExpenses";
import { ReceiptsPage } from "../Pages/Receipts";
import QuotesPage from "../Pages/quotes";

export const adminNavItems: IAdminNavItems[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <IconGauge />,
    isVisible: true,
    component: <Dashboard />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "customers",
    label: "Customers",
    icon: <IconUsersGroup />,
    isVisible: true,
    component: <CustomersPage />,
    requiredPermission: UserPermission.MANAGER_PERMISSIONS,
  },
  {
    value: "orders",
    label: "Orders",
    icon: <IconShoppingCart />,
    isVisible: true,
    component: <Orders />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "reviews",
    label: "Reviews",
    icon: <IconStars />,
    isVisible: false,
    component: <>Reviews</>,
    requiredPermission: UserPermission.MANAGER_PERMISSIONS,
  },
  {
    value: "messages",
    label: "Messages",
    icon: <IconMail />,
    isVisible: true,
    component: <MessagesPage />,
    requiredPermission: UserPermission.MANAGER_PERMISSIONS,
  },
  {
    value: "chat",
    label: "Chat",
    icon: <IconBrandWechat />,
    isVisible: false,
    component: <>Chat</>,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "discount-coupons",
    label: "Discount & Coupons",
    icon: <IconTicket />,
    isVisible: false,
    component: <>Discount & Coupons</>,
    requiredPermission: UserPermission.ADMIN_PERMISSIONS,
  },
  {
    value: "receipts",
    label: "Receipts",
    icon: <IconReceipt />,
    isVisible: true,
    component: <ReceiptsPage />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "quotes-invoices",
    label: "Quotes & Invoices",
    icon: <IconFileInvoice />,
    isVisible: true,
    component: <QuotesPage />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "reports",
    label: "Reports",
    icon: <IconFileAnalytics />,
    isVisible: false,
    component: <>Reports</>,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  "divider",

  {
    value: "price-calculator",
    label: "Price Calculator",
    icon: <IconCalculator />,
    isVisible: true,
    component: <PriceCalculator />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "sales-expenses",
    label: "Sales & Expenses",
    icon: <IconMoneybag />,
    isVisible: true,
    component: <SalesExpenses />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
  {
    value: "employees",
    label: "Employees",
    icon: <IconUser />,
    isVisible: false,
    component: <>Employees</>,
    requiredPermission: UserPermission.MANAGER_PERMISSIONS,
  },

  {
    value: "new-admin-user",
    label: "Admin Users",
    icon: <IconUserShield />,
    isVisible: true,
    component: <AdminUsers />,
    requiredPermission: UserPermission.ADMIN_PERMISSIONS,
  },
  {
    value: "services",
    label: "Services",
    icon: <IconSettings2 />,
    isVisible: true,
    component: <Services />,
    requiredPermission: UserPermission.ADMIN_PERMISSIONS,
  },
  "divider",
  {
    value: "my-account",
    label: "My Account",
    icon: <IconUserCog />,
    isVisible: true,
    component: <MyAccount />,
    requiredPermission: UserPermission.SALES_REP_PERMISSIONS,
  },
];
