import { Role } from "@/types/roles";

export const adminRoles: { label: string; value: Role }[] = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "Editor",
    value: "editor",
  },
  {
    label: "Sales Rep",
    value: "sales-rep",
  },
  {
    label: "Viewer",
    value: "viewer",
  },
  {
    label: "Guest",
    value: "guest",
  },
];
