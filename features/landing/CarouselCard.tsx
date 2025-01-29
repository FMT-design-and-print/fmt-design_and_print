import React from "react";
import { Carousel } from "@mantine/carousel";
import { AspectRatio } from "@mantine/core";
import classes from "./Style.module.css";
import Image from "next/image";

const images = [
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709546397/FMT/t-shirt_banner_wns0f9.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1737932440/FMT/FMT-web_banner_caps_qa1lxx.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1737932439/FMT/FMT-web_banner_mugs_ihofu7.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709543373/FMT/Stelle_Catering_Business_Card-mockup_r7t74m.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709543257/FMT/Ceramic-mug-mom-fmt_erkged.jpg",
];

export const CarouselCard = () => {
  return (
    <Carousel
      withIndicators
      loop
      classNames={{
        root: classes.carousel,
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator,
        control: classes.carouselControl,
      }}
    >
      {images.map((image) => (
        <Carousel.Slide key={image}>
          <AspectRatio ratio={16 / 9} mah={400} mx="auto" p={4}>
            <Image src={image} alt="banner image" width={1080} height={720} />
          </AspectRatio>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
