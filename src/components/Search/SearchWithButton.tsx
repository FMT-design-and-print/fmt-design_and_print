import { Button, Text, TextInput, TextInputProps, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { HiSearch } from "react-icons/hi";

export const SearchWithButton = (props: TextInputProps) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <TextInput
      radius={isMobile ? "xl" : "sm"}
      size={isMobile ? "sm" : "md"}
      placeholder="Search items..."
      rightSectionWidth={isMobile ? "70px" : "90px"}
      leftSection={<HiSearch />}
      rightSection={
        <Button
          radius={isMobile ? "xl" : "sm"}
          size={isMobile ? "xs" : "sm"}
          className={`btn`}
        >
          <Text size={isMobile ? "10px" : "md"} component="span">
            Search
          </Text>
        </Button>
      }
      {...props}
    />
  );
};
