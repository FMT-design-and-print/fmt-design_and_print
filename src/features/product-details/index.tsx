"use client";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  NumberInput,
  Rating,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { BsCartPlus } from "react-icons/bs";
import classes from "./Style.module.css";

export const ProductDetails = () => {
  return (
    <Box px="xl" py="lg">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 5 }}>
          <AspectRatio
            ratio={1 / 1.2}
            maw={450}
            mx={{ base: "sm", sm: "auto" }}
          >
            <Image
              radius="md"
              src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703781261/FMT/tshirt-mockup_ppflhq.png"
              alt=""
            />
          </AspectRatio>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 7 }} px="md">
          <Title order={3}>Black T-Shirt geometric print pattern</Title>
          <Group gap="xs">
            <Rating size="xs" value={4.5} fractions={2} readOnly color="pink" />
            <Text size="xs" my="md">
              (123)
            </Text>
          </Group>
          <Box mb="sm">
            <Text fw="bold">Color</Text>
            <Text size="sm" c="dimmed">
              Please choose color below
            </Text>
            <Group gap="xs" my="xs">
              <Box w={30} h={30} bg="cyan" className="rounded-full" />
              <Box w={30} h={30} bg="grape" className="rounded-full" />
              <Box w={30} h={30} bg="indigo" className="rounded-full" />
              <Box w={30} h={30} bg="orange" className="rounded-full" />
              <Box w={30} h={30} bg="pink" className="rounded-full" />
              <Box w={30} h={30} bg="red" className="rounded-full" />
              <Box w={30} h={30} bg="green" className="rounded-full" />
            </Group>
          </Box>
          <Box mb="sm">
            <Text fw="bold">Size</Text>
            <Text size="sm" c="dimmed">
              Please choose size below
            </Text>
            <Group gap="xs" my="xs">
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                S
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                M
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                L
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                XL
              </Card>
              <Card w={35} h={35} p={4} className="text-center" withBorder>
                2XL
              </Card>
            </Group>
          </Box>
          <Divider label="Quantity" labelPosition="left" mt="md" />
          <Flex my="sm" justify="space-between">
            <Group>
              <Button variant="light" color="gray">
                -
              </Button>
              <NumberInput
                w={50}
                placeholder="1"
                value={1}
                min={1}
                hideControls
              />
              <Button variant="light" color="gray">
                +
              </Button>
            </Group>

            <Group align="flex-start" gap={1}>
              <Text pt="5px">GHS</Text>
              <Title>55</Title>
            </Group>
          </Flex>
          <Divider mb="md" />
          <Group my="xl">
            <Button
              size="md"
              miw={{ base: "100%", xs: 150 }}
              className={classes["cart-btn"]}
              leftSection={<BsCartPlus />}
            >
              Add to cart
            </Button>
            <Button size="md" miw={{ base: "100%", xs: 150 }} className="btn">
              Buy now
            </Button>
          </Group>
          <Text>
            Click{" "}
            <Link href="/custom-request">
              <Text component="span" c="pink">
                here
              </Text>
            </Link>{" "}
            to request for custom print service.
          </Text>
        </Grid.Col>
      </Grid>

      <Tabs
        variant="outline"
        color="gray"
        radius="sm"
        defaultValue="description"
        px="xl"
        mt="xl"
      >
        <Tabs.List py="md">
          <Tabs.Tab value="description" px="xl" py="md">
            Description
          </Tabs.Tab>
          <Tabs.Tab value="details" px="xl" py="md">
            Product Details
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description" py="md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          aspernatur sapiente sed incidunt, atque commodi a ullam quo ipsa?
          Excepturi deserunt neque, sunt velit veritatis autem minus corrupti
          non quos.
        </Tabs.Panel>
        <Tabs.Panel value="details" py="md">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et tempore
          natus adipisci illo? Officiis magnam exercitationem laborum laudantium
          officia maiores nihil fugit totam in nesciunt iste temporibus quia
          laboriosam tempora nulla natus, harum repellat, accusamus voluptate,
          aliquam nobis ab cupiditate. Ea enim nobis minima, vel iusto
          cupiditate alias accusamus, consectetur nulla, mollitia ex dolorum
          pariatur debitis maxime quis ipsa? Similique eligendi distinctio natus
          dicta a consequatur ipsum. Velit, modi iusto excepturi dolorem quam
          veritatis quidem voluptate non ipsum laudantium error distinctio! Quod
          quam aliquam omnis, tenetur cumque temporibus maiores quos fugit, aut
          adipisci rerum deserunt doloremque iure necessitatibus molestiae est!
        </Tabs.Panel>
      </Tabs>

      <Box my="xl">
        <Text fw="bold" my="sm">
          Related search terms
        </Text>
        <Group>
          <Badge variant="outline" color="gray">
            Search Term 1
          </Badge>
          <Badge variant="outline" color="gray">
            Term 2
          </Badge>
          <Badge variant="outline" color="gray">
            Screen printing
          </Badge>
          <Badge variant="outline" color="gray">
            Heat transfer printing
          </Badge>
        </Group>
      </Box>
    </Box>
  );
};
