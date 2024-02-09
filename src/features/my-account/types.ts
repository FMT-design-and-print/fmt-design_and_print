import { ReactNode } from "react";

export interface ILink {
  icon: ReactNode;
  label: string;
  notifications?: number;
  link: string;
}
