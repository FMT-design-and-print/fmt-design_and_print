import { Metadata } from "next";
import { Renderer } from "./Renderer";

export const metadata: Metadata = {
  title: "Admin| FMT Design and Print",
};

export default function StudioPage() {
  return <Renderer />;
}
