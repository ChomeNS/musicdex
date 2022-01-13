import {
  Box,
  Button,
  CloseButton,
  Heading,
  HStack,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Suspense, useEffect, useMemo } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { QueryStatus } from "../components/common/QueryStatus";
import { SongTable } from "../components/data/SongTable";
import { PageContainer } from "../components/layout/PageContainer";
import {
  SearchParams,
  useSongSearch,
} from "../modules/services/search.service";
import { FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  AdvancedSearchProps,
  AdvancedSearchFiltersForm,
} from "../components/nav/AdvancedSearchComponent";

export interface SearchableSong extends Song {
  channel_org?: string;
  channel_suborg?: string;
}

export default function Search() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
    search.entries()
  );
  const { data: searchResult, ...rest } = useSongSearch<SearchableSong>({
    q: "",
    query_by:
      "name, channel_name, channel_english_name, original_artist, channel_org, channel_suborg, title",
    ...qObj,
    facet_by: "channel_org, is_mv, channel_suborg",
    // filter_by: "original_artist: doriko",
  });

  function doSearch(queryNew: Partial<SearchParams<Song>> = {}) {
    navigate({
      pathname: "/search",
      search: `?${createSearchParams({
        q: qObj.q,
        ...qObj,
        ...queryNew,
      } as any)}`,
    });
  }

  const songs = useMemo(() => {
    console.log(searchResult);

    return searchResult?.hits?.map((doc) => {
      return doc.document;
    });
  }, [searchResult]);

  return (
    <PageContainer>
      <AdvancedSearchFilters
        facets={searchResult?.facet_counts}
      ></AdvancedSearchFilters>
      <QueryStatus queryStatus={rest} />
      <Suspense fallback={<div></div>}>
        <HStack align="end">
          <Heading size="lg">Search: "{qObj.q || ""}"</Heading>
          <Spacer></Spacer>
          <Text>
            {(searchResult?.page || 0) * 10 - 10 + (songs?.length || 0)} out of{" "}
            {searchResult?.found}
          </Text>
        </HStack>
        <Suspense fallback={<div>Loading...</div>}>
          {songs && <SongTable songs={songs} />}
        </Suspense>

        {searchResult && (
          <HStack spacing={3} my={3}>
            <Button
              disabled={searchResult?.page <= 1}
              onClick={() =>
                searchResult?.page > 1 &&
                doSearch({ page: searchResult?.page - 1 })
              }
            >
              Prev
            </Button>
            <Button
              disabled={
                searchResult?.page * 10 + (songs?.length || 0) - 10 >=
                searchResult?.found
              }
              onClick={() =>
                searchResult?.page >= 1 &&
                doSearch({ page: searchResult?.page + 1 })
              }
            >
              Next
            </Button>
          </HStack>
        )}
      </Suspense>
    </PageContainer>
  );
}

function AdvancedSearchFilters({ ...props }: AdvancedSearchProps) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [search] = useSearchParams();

  useEffect(() => {
    const qObj: Partial<SearchParams<SearchableSong>> = Object.fromEntries(
      search.entries()
    );
    if ((qObj as any)?.advanced) {
      onOpen();
    }
  }, [search]);

  return (
    <Box
      style={{
        width: isOpen ? "100%" : "120px",
        backgroundColor: isOpen ? "#222" : "transparent",
        padding: isOpen ? "1.5rem" : "0px",
        borderRadius: isOpen ? "1.5rem" : "auto",
        // marginLeft: "auto",
        // marginRight: "0px",
      }}
      my={4}
      // layout
      transition="all 0.4s"
    >
      {isOpen ? (
        <Box>
          <CloseButton
            onClick={onClose}
            mt="-3"
            mr="-3"
            mb="-3"
            ml="auto"
            position="relative"
          />

          <AdvancedSearchFiltersForm {...props} />
        </Box>
      ) : (
        <Button w="120px" onClick={onOpen} leftIcon={<FiFilter />}>
          Filter
        </Button>
      )}
    </Box>
  );
}
