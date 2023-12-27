import { Button, TextInput, TextInputProps, em } from "@mantine/core";
import { HiSearch } from "react-icons/hi";
import { useMediaQuery } from "@mantine/hooks";

export const SearchWithButton = (props: TextInputProps) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <TextInput
      radius="sm"
      size={isMobile ? "sm" : "md"}
      placeholder="Search items..."
      rightSectionWidth="85px"
      leftSection={<HiSearch />}
      rightSection={
        <Button
          radius="sm"
          mr={isMobile ? "-10px" : "0px"}
          className={`btn ${isMobile ? "rounded-l-none" : ""} `}
        >
          Search
        </Button>
      }
      {...props}
    />
  );
};
