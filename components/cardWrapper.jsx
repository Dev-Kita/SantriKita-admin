import React from "react";
import { Box } from "@chakra-ui/react";

function CardWrapper({ children }) {
  return (
    <Box
      bgColor="white"
      mt="4"
      p="4"
      rounded="md"
      borderWidth="1px"
      boxShadow="lg"
    >
      {children}
    </Box>
  );
}

export default CardWrapper;
