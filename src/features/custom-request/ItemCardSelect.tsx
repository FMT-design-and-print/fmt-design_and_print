import { Avatar, Card, Stack, Text } from "@mantine/core";
import React from "react";
import { FlexLayout } from "./FlexLayout";

type Item = { image: string; label: string; value: string };
interface Props {
  items: Item[];
  label?: string;
  onChange: (item: string) => void;
  value: string;
}

export const ItemsCardSelect = ({ items, label, onChange, value }: Props) => {
  const handleItemSelect = (label: string) => {
    onChange(label);
  };

  return (
    <>
      <Text size="sm">{label}</Text>
      <FlexLayout grow>
        {items.map((item, i) => (
          <Card
            withBorder
            key={item.value + i}
            onClick={() => handleItemSelect(item.value)}
            style={{
              borderColor: value === item.value ? "pink" : "",
              backgroundColor: value === item.value ? "#eceeef" : "",
              cursor: "pointer",
            }}
          >
            <Stack align="center">
              <Avatar radius="sm" size="lg" src={item.image} />
              <Text size="sm">{item.label}</Text>
            </Stack>
          </Card>
        ))}
      </FlexLayout>
    </>
  );
};
