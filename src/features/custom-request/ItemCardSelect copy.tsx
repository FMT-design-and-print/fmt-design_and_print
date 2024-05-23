import { Avatar, Card, Text } from "@mantine/core";
import { FlexLayout } from "@/components/FlexLayout";

type Item = { id: string; image: string };
interface Props {
  items: Item[];
  label?: string;
  onChange: (item: Item) => void;
  value: string;
}

export const ImagesCardSelect = ({ items, label, onChange, value }: Props) => {
  const handleItemSelect = (item: Item) => {
    onChange(item);
  };

  return (
    <>
      <Text size="sm">{label}</Text>
      <FlexLayout>
        {items.map((item, i) => (
          <Card
            withBorder
            key={item.id + i}
            onClick={() => handleItemSelect(item)}
            style={{
              borderColor: value === item.id ? "pink" : "",
              backgroundColor: value === item.id ? "#eceeef" : "",
              cursor: "pointer",
            }}
          >
            <Avatar radius="sm" size="xl" src={item.image} />
          </Card>
        ))}
      </FlexLayout>
    </>
  );
};
