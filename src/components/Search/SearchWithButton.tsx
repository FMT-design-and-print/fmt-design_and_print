import { client } from "@/lib/client";
import { searchQuery } from "@/queries/global-search";
import { SearchItem } from "@/types";
import {
  Button,
  Center,
  Loader,
  Popover,
  Text,
  TextInput,
  TextInputProps,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { CategoriesResults } from "./CategoriesResults";
import { ProductTypesResults } from "./ProductTypesResults";
import { ProductsResults } from "./ProductsResults";

interface ISearchResults {
  printService: SearchItem[];
  productTypes: SearchItem[];
  printCategories: SearchItem[];
  pages: any[];
}

const initialSearchRes: ISearchResults = {
  printService: [],
  productTypes: [],
  printCategories: [],
  pages: [],
};

export const SearchWithButton = (props: TextInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] =
    useState<ISearchResults>(initialSearchRes);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const search = useCallback(async () => {
    setIsLoading(true);
    try {
      const res: ISearchResults = await client.fetch(searchQuery, {
        searchText: `*${searchTerm}*`,
      });
      setSearchResults(res);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, setSearchResults, setIsLoading]);

  const noItemAvailable = Object.entries(searchResults).every(
    ([_, value]) => value.length === 0
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        search();
      } else {
        setSearchResults(initialSearchRes);
      }
    }, 1000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timeout);
  }, [search, searchTerm]);

  return (
    <Popover width="target" position="bottom" shadow="md">
      <Popover.Target>
        <TextInput
          radius={isMobile ? "xl" : "sm"}
          size={isMobile ? "sm" : "md"}
          placeholder="Search items..."
          rightSectionWidth={isMobile ? "70px" : "90px"}
          leftSection={<HiSearch />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          rightSection={
            <Button
              radius={isMobile ? "xl" : "sm"}
              size={isMobile ? "xs" : "sm"}
              className={`btn`}
            >
              <Text c="white" size={isMobile ? "10px" : "md"} component="span">
                Search
              </Text>
            </Button>
          }
          {...props}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <ProductsResults products={searchResults.printService} />
        <ProductTypesResults items={searchResults.productTypes} />
        <CategoriesResults items={searchResults.printCategories} />

        {isLoading && (
          <Center>
            <Loader color="pink" size="sm" />
          </Center>
        )}
        {!isLoading && noItemAvailable && (
          <Center>
            <Text c="dimmed" size="sm">
              No results found
            </Text>
          </Center>
        )}
      </Popover.Dropdown>
    </Popover>
  );
};
