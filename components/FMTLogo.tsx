import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  image?: string;
}
export const FMTLogo = ({ image }: Props) => {
  return (
    <Link href="/">
      <Image
        src={
          image ||
          "https://res.cloudinary.com/dnbmynikp/image/upload/v1703269414/FMT/logo-white_mfxmmk.png"
        }
        alt="FMT Logo"
        width={60}
        height={50}
      />
    </Link>
  );
};
