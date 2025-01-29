import { Permission, Role } from "@/types/roles";

type Permissions = {
  // eslint-disable-next-line no-unused-vars
  [key in Role]: Permission[];
};

const roleHierarchy: Permissions = {
  "super-admin": ["all_permissions"],
  admin: [
    "admin_permissions",
    "manager_permissions",
    "editor_permissions",
    "sales-rep_permissions",
    "viewer_permissions",
    "guest_permissions",
  ],
  manager: [
    "manager_permissions",
    "editor_permissions",
    "sales-rep_permissions",
    "viewer_permissions",
    "guest_permissions",
  ],
  editor: [
    "editor_permissions",
    "sales-rep_permissions",
    "viewer_permissions",
    "guest_permissions",
  ],
  "sales-rep": [
    "sales-rep_permissions",
    "viewer_permissions",
    "guest_permissions",
  ],
  viewer: ["viewer_permissions", "guest_permissions"],
  guest: ["guest_permissions"],
};

export function hasPermission(
  userRole: Role,
  requiredPermission: Permission
): boolean {
  if (!userRole || !roleHierarchy[userRole]) {
    return false;
  }

  let permissions: string[] = [];

  if (userRole === "super-admin") {
    permissions = roleHierarchy[userRole];
    return true;
  }

  if (roleHierarchy[userRole].includes(requiredPermission)) {
    permissions = [...permissions, ...roleHierarchy[userRole]];
  }

  return permissions.includes(requiredPermission);
}

export const formatRole = (role?: Role) => {
  switch (role) {
    case "super-admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "editor":
      return "Editor";
    case "sales-rep":
      return "Sales Rep";
    case "viewer":
      return "Viewer";
    case "guest":
      return "Guest";
    default:
      return "";
  }
};
