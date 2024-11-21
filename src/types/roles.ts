/* eslint-disable no-unused-vars */
export type Role =
  | "super-admin"
  | "admin"
  | "manager"
  | "editor"
  | "sales-rep"
  | "viewer"
  | "guest";

export type Permission =
  | "all_permissions"
  | "admin_permissions"
  | "manager_permissions"
  | "editor_permissions"
  | "sales-rep_permissions"
  | "viewer_permissions"
  | "guest_permissions";

export enum UserRole {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  MANAGER = "manager",
  EDITOR = "editor",
  SALES_REP = "sales-rep",
  VIEWER = "viewer",
  GUEST = "guest",
}

export enum UserPermission {
  ALL_PERMISSIONS = "all_permissions",
  ADMIN_PERMISSIONS = "admin_permissions",
  MANAGER_PERMISSIONS = "manager_permissions",
  EDITOR_PERMISSIONS = "editor_permissions",
  SALES_REP_PERMISSIONS = "sales-rep_permissions",
  VIEWER_PERMISSIONS = "viewer_permissions",
  GUEST_PERMISSIONS = "guest_permissions",
}
