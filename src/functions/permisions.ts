import { Role } from "@/types/roles";

const roleHierarchy: { [key in Role]: string[] } = {
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
  requiredPermission: string
): boolean {
  let permissions: string[] = [];
  for (const role in roleHierarchy) {
    if (
      role === userRole ||
      roleHierarchy[role as Role].includes(`${userRole}_permissions`)
    ) {
      permissions = [...permissions, ...roleHierarchy[role as Role]];
    }
  }

  return permissions.includes(requiredPermission);
}
