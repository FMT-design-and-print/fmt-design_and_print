"use client";
import { featureFlags } from "@/constants/feature-flags";
import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconMap,
  IconPhone,
  IconPrinter,
  IconReceipt2,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { CarouselCard } from "./CarouselCard";
import { PrintCategories } from "./PrintCategories";
import { whatsappDefaultMessage, whatsappNumber } from "@/constants";
import { useState } from "react";

export const Hero = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove any non-numeric characters from the phone number
    const cleanPhoneNumber = whatsappNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(
      whatsappDefaultMessage + "\n\n" + message
    );
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Grid px={{ base: "md", sm: "xl" }}>
      <Grid.Col span={3} visibleFrom="sm">
        <Card withBorder h="100%">
          <PrintCategories />
        </Card>
      </Grid.Col>
      <Grid.Col span="auto">
        <CarouselCard />
      </Grid.Col>

      <Grid.Col span={3} visibleFrom="md">
        <Card withBorder h="100%">
          <Link href="/custom-request">
            <Group py="5px" wrap="nowrap">
              <Avatar src="./printer.png" className="border border-1">
                <IconPrinter className="text-gray-500" size="1.4rem" />
              </Avatar>

              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Request Custom Print
              </Text>
            </Group>
          </Link>

          <Link href="/quote-or-invoice-request">
            <Group py="5px" wrap="nowrap">
              <Avatar src="./chat-bubble.png" className="border border-1" p={4}>
                <IconReceipt2 className="text-gray-500" size="1.4rem" />
              </Avatar>

              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Request Quote/Invoice
              </Text>
            </Group>
          </Link>

          <Link href="/order-tracking">
            <Group py="5px" wrap="nowrap">
              <Avatar src="./location.png" className="border border-1">
                <IconMap className="text-gray-500" size="1.4rem" />
              </Avatar>

              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Track my order
              </Text>
            </Group>
          </Link>

          <Group py="5px" wrap="nowrap">
            <Avatar src="./call.png" className="border border-1" p={4}>
              <IconPhone className="text-gray-500" size="1.4rem" />
            </Avatar>

            <Stack gap={0}>
              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Call to order
              </Text>
              <Text size="xs">0559617959</Text>
            </Stack>
          </Group>

          {/* WhatsApp Chat */}
          <Box className="pt-4" w="100%">
            <Text size="xs" fw={500} c="dimmed">
              Chat with us directly on WhatsApp
            </Text>
            <form onSubmit={handleSubmit} className="py-2">
              <div className="flex gap-2 ">
                <TextInput
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message here"
                  radius="xl"
                  className="flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#1ea952] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </Box>

          {featureFlags.gifts && (
            <>
              <Divider />

              <Link href="">
                <Group py="5px" wrap="nowrap">
                  <Image
                    src="./gift-box-3d.png"
                    alt=""
                    width={25}
                    height={25}
                  />
                  <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                    Gift and Packages
                  </Text>
                </Group>
              </Link>
            </>
          )}

          {featureFlags.plainItems && (
            <Link href="">
              <Group py="5px" wrap="nowrap">
                <Image src="" alt="" width={25} height={25} />
                <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                  Buy Plain Items
                </Text>
              </Group>
            </Link>
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
};
