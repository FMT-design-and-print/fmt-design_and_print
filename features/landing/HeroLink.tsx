import { ICategory } from "@/types";
import { Avatar, Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

interface HeroLinkProps {
  item: ICategory;
  isMobile?: boolean;
  link: string;
}

export const HeroLink = ({ item, link, isMobile }: HeroLinkProps) => (
  <Link href={link}>
    <Group py="5px" wrap="nowrap">
      <Avatar className="border border-1">
        <Image src={item.icon} alt={item.tagline} width={20} height={20} />
      </Avatar>
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
