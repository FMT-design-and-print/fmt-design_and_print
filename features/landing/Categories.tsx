"use client";
import { ICategory } from "@/types";
import { Box, Grid, Text, Title, Group, Badge } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { FaLongArrowAltRight } from "react-icons/fa";

interface Props {
  categories: ICategory[];
}

export const Categories = ({ categories }: Props) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Box my="xl">
      <Group mb="xl" justify="space-between">
        <Title order={3} c="gray.8">
          Browse Categories
        </Title>
        <Link href="/services" style={{ textDecoration: "none" }}>
          <Group gap="xs">
            <Text c="pink.6" fw={500}>
              View All
            </Text>
            <FaLongArrowAltRight color="var(--mantine-color-pink-6)" />
          </Group>
        </Link>
      </Group>

      <Grid gutter={{ base: "md", sm: "lg" }}>
        {categories.map((category) => (
          <Grid.Col key={category.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Link
              href={`/services/print/categories/${category.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                className="category-card"
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  height: 240,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Background Image with Overlay */}
                <Box
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  {/* Overlay */}
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                      zIndex: 2,
                    }}
                  />
                </Box>

                {/* Content */}
                <Box
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: "24px",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Category Icon Badge */}
                  {category.icon && (
                    <Box
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "white",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        zIndex: 4,
                      }}
                    >
                      <Image
                        src={category.icon}
                        alt={`${category.title} icon`}
                        width={24}
                        height={24}
                      />
                    </Box>
                  )}

                  {/* Category Title */}
                  <Title
                    order={4}
                    c="white"
                    mb={2}
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    {category.title.includes("Large Format")
                      ? "Large Format, Branding"
                      : category.title}
                  </Title>

                  {/* Explore Button */}
                  <Badge
                    color="pink"
                    variant="filled"
                    size="lg"
                    radius="sm"
                    className="explore-badge"
                  >
                    Explore
                  </Badge>
                </Box>
              </Box>
            </Link>
          </Grid.Col>
        ))}
      </Grid>

      <style jsx global>{`
        .category-card {
          transform: translateY(0);
        }
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        /* Always show explore badge on mobile */
        .explore-badge {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        /* Hide and animate explore badge only on larger screens */
        @media (min-width: 768px) {
          .explore-badge {
            opacity: 0;
            transform: translateY(10px);
          }

          .category-card:hover .explore-badge {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};
