import { SearchParamsProvider } from "@/components/SearchParamsProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { client } from "@/sanity/lib/client";
import { searchQuery } from "@/sanity/queries/global-search";
import { SearchItem } from "@/types";
import {
  Center,
  Loader,
  Popover,
  Text,
  TextInput,
  TextInputProps,
  em,
} from "@mantine/core";
import { useClickOutside, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { CategoriesResults } from "./CategoriesResults";
import { ProductTypesResults } from "./ProductTypesResults";
import { ProductsResults } from "./ProductsResults";

interface ISearchResults {
  printService: SearchItem[];
  productTypes: SearchItem[];
  printCategories: SearchItem[];
  pages: unknown[];
}

const initialSearchRes: ISearchResults = {
  printService: [],
  productTypes: [],
  printCategories: [],
  pages: [],
};

// Component that uses search params
const SearchWithButtonContent = (props: TextInputProps) => {
  const [opened, { close, open }] = useDisclosure(false);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  const [control, setControl] = useState<HTMLInputElement | null>(null);
  const { trackSearch } = useAnalytics();
  useClickOutside(() => close(), null, [control, dropdown]);
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
      trackSearch(searchTerm);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, setSearchResults, setIsLoading, trackSearch]);

  const noItemAvailable = Object.entries(searchResults).every(
    ([, value]) => value.length === 0
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        search();
      } else {
        setSearchResults(initialSearchRes);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search, searchTerm]);

  return (
    <Popover width="target" position="bottom" shadow="md" opened={opened}>
      <Popover.Target>
        <TextInput
          ref={setControl}
          radius="xl"
          size="sm"
          placeholder="Start typing to search products..."
          rightSectionWidth={isMobile ? "50px" : "78px"}
          leftSection={<HiSearch />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onClick={open}
          {...props}
        />
      </Popover.Target>
      <Popover.Dropdown ref={setDropdown}>
        <ProductsResults products={searchResults.printService} close={close} />
        <ProductTypesResults items={searchResults.productTypes} close={close} />
        <CategoriesResults
          items={searchResults.printCategories}
          close={close}
        />

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

// Wrapper component with Suspense boundary
export const SearchWithButton = (props: TextInputProps) => {
  return (
    <SearchParamsProvider>
      <SearchWithButtonContent {...props} />
    </SearchParamsProvider>
  );
};
