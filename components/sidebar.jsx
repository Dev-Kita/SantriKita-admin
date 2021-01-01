import React from "react";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Spacer,
  VStack,
  StackDivider,
  Link,
  Heading,
  Button,
} from "@chakra-ui/react";

const sideMenu = [
  { title: "Dashboard", slug: "/dashboard" },
  { title: "Daftar Siswa", slug: "/daftar-siswa" },
  { title: "Riwayat Pembelajaran", slug: "/riwayat-pembelajaran" },
  { title: "Riwayat Kesehatan", slug: "/riwayat-kesehatan" },
  { title: "Biaya", slug: "/biaya" },
  { title: "Prestasi", slug: "/prestasi" },
  { title: "Pelanggaran", slug: "/pelanggaran" },
];

export default function Sidebar({ children }) {
  const router = useRouter();

  // Logout Handler
  const logoutHandler = () => {
    destroyCookie(null, "jwt");
    router.replace("/login");
  };

  return (
    <Flex flexDir="row" justifyContent="space-between">
      <VStack
        px="4"
        py="8"
        w="20%"
        h="100vh"
        align="stretch"
        justify="space-between"
      >
        <Heading fontSize="2xl" color="teal.600" textAlign="center">
          SANTRI KITA
        </Heading>
        <VStack
          align="stretch"
          divider={<StackDivider borderColor="gray.200" />}
        >
          {sideMenu.map(({ title, slug }, i) => {
            return (
              <NextLink href={slug} key={i}>
                <Link
                  py="2"
                  px="4"
                  w="100%"
                  rounded="md"
                  fontWeight="medium"
                  bgColor={router.pathname === slug ? "teal.100" : undefined}
                  _hover={{
                    background: "gray.100",
                    color: "teal.700",
                  }}
                >
                  {title}
                </Link>
              </NextLink>
            );
          })}
        </VStack>
        <Button colorScheme="red" variant="solid" onClick={logoutHandler}>
          Log out
        </Button>
      </VStack>

      <Box w="80%" bgColor="gray.100" p="8">
        {children}
      </Box>
    </Flex>
  );
}
