import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import {
  Tooltip,
  Box,
  Text,
  Flex,
  Spacer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
} from "@chakra-ui/react";

function Topbar() {
  const [username, setUsername] = useState("username");
  const { asPath } = useRouter();
  const link = asPath.split("/");
  const x = link.shift();

  useEffect(() => {
    setUsername(parseCookies().username);
  }, []);

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
        <Tooltip hasArrow label={username} bg="gray.300" color="black">
          <Flex align="center">
            <Avatar size="sm" name={username} cursor="default" />
            <Text ml="2" fontWeight="bold">
              {username}
            </Text>
          </Flex>
        </Tooltip>
      </Box>
    </Flex>
  );
}

export default Topbar;
