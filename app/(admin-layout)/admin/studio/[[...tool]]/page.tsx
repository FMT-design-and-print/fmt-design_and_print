import { Metadata } from "next";
import { Renderer } from "./Renderer";

export const metadata: Metadata = {
  title: "Admin | Studio | FMT Design and Print",
};

export default function AdminPage() {
  return <Renderer />;
}
