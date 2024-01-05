"use client";
import {
  Box,
  Card,
  Checkbox,
  Flex,
  Grid,
  Input,
  ScrollArea,
  Title,
} from "@mantine/core";
import React from "react";
import { ProductCard } from "@/components/ProductCard";

export const ProductType = () => {
  return (
    <Box px="xl">
      <Grid>
        <Grid.Col span={{ base: 4, lg: 3 }} visibleFrom="md">
          <Card withBorder>
            <Box bg="gray.1" p="xs">
              <Title order={4} tt="uppercase" mb={4}>
                Topic
              </Title>
              <Input placeholder="Search topic..." size="xs" />
              <ScrollArea h={300} p="xs">
                <Checkbox my="xs" label="Adventure and Outdoors" />
                <Checkbox my="xs" label="Animals" />
                <Checkbox my="xs" label="Back to School" />
                <Checkbox my="xs" label="Bible" />
                <Checkbox my="xs" label="Christian" />
                <Checkbox my="xs" label="Birthday" />
                <Checkbox my="xs" label="Adventure and Outdoors" />
                <Checkbox my="xs" label="Animals" />
                <Checkbox my="xs" label="Back to School" />
                <Checkbox my="xs" label="Bible" />
                <Checkbox my="xs" label="Christian" />
                <Checkbox my="xs" label="Birthday" />
                <Checkbox my="xs" label="Adventure and Outdoors" />
                <Checkbox my="xs" label="Animals" />
                <Checkbox my="xs" label="Back to School" />
                <Checkbox my="xs" label="Bible" />
                <Checkbox my="xs" label="Christian" />
                <Checkbox my="xs" label="Birthday" />
              </ScrollArea>
            </Box>

            <Box bg="gray.1" p="xs" my="sm">
              <Title order={4} tt="uppercase" mb={4}>
                Occupation and Profession
              </Title>
              <Input
                placeholder="Search occupation and professsion..."
                size="xs"
              />
              <ScrollArea h={300} p="xs">
                <Checkbox my="xs" label="Nurse" />
                <Checkbox my="xs" label="Teacher" />
                <Checkbox my="xs" label="Accountant" />
                <Checkbox my="xs" label="Bartender" />
                <Checkbox my="xs" label="Black Smith" />
                <Checkbox my="xs" label="Bus Driver" />
                <Checkbox my="xs" label="Chef" />
                <Checkbox my="xs" label="Chemist" />
                <Checkbox my="xs" label="Construction" />
                <Checkbox my="xs" label="Dentist" />
                <Checkbox my="xs" label="DJ" />
                <Checkbox my="xs" label="Engineer" />
                <Checkbox my="xs" label="Firefighter" />
                <Checkbox my="xs" label="Firework Tech" />
                <Checkbox my="xs" label="Counsellor" />
                <Checkbox my="xs" label="Hair Stylist" />
                <Checkbox my="xs" label="IT" />
                <Checkbox my="xs" label="Journalist" />
              </ScrollArea>
            </Box>
          </Card>
        </Grid.Col>
        <Grid.Col span="auto">
          <Input placeholder="Type to Search..." />

          <Flex
            wrap="wrap"
            align="center"
            py="lg"
            justify={{ base: "center", md: "space-evenly" }}
            gap="md"
          >
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </Flex>
        </Grid.Col>
      </Grid>
    </Box>
  );
};
