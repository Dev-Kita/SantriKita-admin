import React from "react";
import { Box } from "@chakra-ui/react";

function CardWrapper({ children, width }) {
  return (
    <Box
      width={width ? width : "full"}
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
