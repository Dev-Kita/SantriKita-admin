import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaSignOutAlt } from "react-icons/fa";
import {
  HStack,
  Link,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Button,
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
  const router = useRouter();
  const link = router.asPath.split("/");
  const x = link.shift();

  useEffect(() => {
    setUsername(parseCookies().username);
  }, []);

  // Logout Handler
  const logoutHandler = () => {
    destroyCookie(null, "jwt");
    destroyCookie(null, "username");
    router.replace("/login");
  };

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
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            background="white"
          >
            <Flex align="center">
              <Avatar size="sm" name={username} cursor="default" />
              <Text ml="2" fontWeight="bold">
                {username}
              </Text>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem onClick={logoutHandler}>
                <HStack>
                  <p>Log out</p> <FaSignOutAlt />
                </HStack>
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}

export default Topbar;
