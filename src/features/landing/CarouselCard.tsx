import React from "react";
import { Carousel } from "@mantine/carousel";
import { AspectRatio, Image } from "@mantine/core";
import classes from "./Style.module.css";

const images = [
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709546397/FMT/t-shirt_banner_wns0f9.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709552624/FMT/FMT-web_banner_Caps_he6htz.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709552624/FMT/FMT-web_banner_Mug_yoha5p.png",
  "https://res.cloudinary.com/dnbmynikp/image/upload/v1709543205/FMT/Photo_Framepsd_xfawem.jpg",
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
          <AspectRatio ratio={1080 / 720} mah={400} mx="auto" bg="cyan" p={4}>
            <Image src={image} height={220} alt="banner image" />
          </AspectRatio>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
