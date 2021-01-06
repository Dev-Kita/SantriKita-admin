import React from "react";
import Head from "next/head";
import CardWrapper from "./cardWrapper";
import { AddIcon } from "@chakra-ui/icons";
import {
  Skeleton,
  SkeletonText,
  Flex,
  Spacer,
  Button,
  VStack,
} from "@chakra-ui/react";

function SkeletonLoading({ title, plusButton, children }) {
  return (
    <>
      <Head>
        <title>{title} | Santri Kita</title>
      </Head>

      {plusButton ? (
        <Flex mb="4">
          <Spacer />
          <Button leftIcon={<AddIcon />} variant="solid" colorScheme="teal">
            {plusButton}
          </Button>
        </Flex>
      ) : undefined}

      <CardWrapper>
        <VStack align="stretch" spacing={2}>
          <Skeleton height="20px" mb="4" rounded="md" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" rounded="full" />
        </VStack>
      </CardWrapper>
    </>
  );
}

export default SkeletonLoading;
