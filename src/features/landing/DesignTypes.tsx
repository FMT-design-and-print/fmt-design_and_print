import { featureFlags } from "@/constants/feature-flags";
import { Button, Group, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { FaLongArrowAltRight } from "react-icons/fa";

const designItems = [
  {
    title: "Flyer Designs",
    image: "/flyer.png",
  },

  {
    title: "Logo Designs",
    image: "/logo_d.png",
  },
  {
    title: "Label Designs",
    image: "/label.png",
  },
  {
    title: "Brochures",
    image: "/brochure.png",
  },
  {
    title: "3D Designs",
    image: "/3d-modeling.png",
  },
];

export const DesignTypes = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return featureFlags.design ? (
    <>
      {designItems.map((item, i) => (
        <Group key={item.title + i} py="md" wrap="nowrap">
          <Image src={item.image} alt="" width={25} height={25} />
          <Text
            lineClamp={1}
            c="gray.7"
            size={isMobile ? "sm" : "md"}
            title={item.title}
          >
            {item.title}
          </Text>
        </Group>
      ))}
      <Group py={8} grow>
        <Button className="btn">
          View More <FaLongArrowAltRight style={{ margin: "0 10px" }} />
        </Button>
      </Group>
    </>
  ) : null;
};
