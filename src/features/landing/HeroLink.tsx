import { ICategory } from "@/types";
import { Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface HeroLinkProps {
  item: ICategory;
  isMobile?: boolean;
  link: string;
}

export const HeroLink = ({ item, link, isMobile }: HeroLinkProps) => (
  <Link href={link}>
    <Group py="md" wrap="nowrap">
      <Image src={item.icon} alt={item.tagline} width={25} height={25} />
      <Text
        lineClamp={1}
        c="gray.7"
        size={isMobile ? "sm" : "md"}
        title={item.title}
      >
        {item.title}
      </Text>
    </Group>
  </Link>
);
