import { Role } from "./roles";

export interface IAdminUser {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  role?: Role;
  confirmed: boolean;
}
