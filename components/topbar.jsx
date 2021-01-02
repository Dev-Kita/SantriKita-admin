import React from "react";
import { useRouter } from "next/router";
import {
  Tooltip,
  Box,
  HStack,
  Flex,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
} from "@chakra-ui/react";

function Topbar() {
  const { asPath } = useRouter();
  const link = asPath.split("/");
  const x = link.shift();
  return (
    <Flex bgColor="white" py="4" px="8" align="center">
      <Box>
        <Breadcrumb alignItems="center">
          {link.map((linkItem, i) => {
            return (
              <BreadcrumbItem key={i}>
                <BreadcrumbLink href="#" textTransform="capitalize">
                  {linkItem}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </Box>
      <Spacer />
      <Box>
        <Tooltip hasArrow label="Admin" bg="gray.300" color="black">
          <Avatar size="sm" name="Admin" cursor="default" />
        </Tooltip>
      </Box>
    </Flex>
  );
}

export default Topbar;
