import React from "react";
import { useRouter } from "next/router";
import { parseCookies, destroyCookie } from "nookies";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Spacer,
  VStack,
  HStack,
  StackDivider,
  Link,
  Heading,
  Button,
} from "@chakra-ui/react";
import { MdDashboard, MdSchool } from "react-icons/md";
import { GiAchievement, GiPoliceBadge } from "react-icons/gi";
import {
  FaSchool,
  FaBookOpen,
  FaBook,
  FaBriefcaseMedical,
  FaMoneyBillWaveAlt,
} from "react-icons/fa";

const sideMenu = [
  { icon: <MdDashboard />, title: "Dashboard", slug: "/dashboard" },
  { icon: <MdSchool />, title: "Daftar Siswa", slug: "/daftarSiswa" },
  { icon: <FaSchool />, title: "Kelas", slug: "/kelas" },
  {
    icon: <FaBookOpen />,
    title: "Riwayat Pembelajaran",
    slug: "/riwayatPembelajaran",
  },
  {
    icon: <FaBriefcaseMedical />,
    title: "Riwayat Kesehatan",
    slug: "/riwayatKesehatan",
  },
  { icon: <FaMoneyBillWaveAlt />, title: "Biaya", slug: "/biaya" },
  { icon: <GiAchievement />, title: "Prestasi", slug: "/prestasi" },
  { icon: <GiPoliceBadge />, title: "Pelanggaran", slug: "/pelanggaran" },
];

export default function Sidebar({ children }) {
  const router = useRouter();

  // Logout Handler
  const logoutHandler = () => {
    destroyCookie(null, "jwt");
    destroyCookie(null, "username");
    router.replace("/login");
  };

  return (
    <Flex flexDir="row" justifyContent="space-between" bgColor="gray.800">
      <VStack
        py="8"
        pl="4"
        w="20%"
        h="100vh"
        color="gray.200"
        align="stretch"
        justify="space-between"
      >
        <Heading ml="4" fontSize="3xl" color="teal.400">
          SANTRI KITA
        </Heading>
        <VStack align="stretch" spacing={2}>
          {sideMenu.map(({ icon, title, slug }, i) => {
            return (
              <NextLink href={slug} key={i}>
                <Link
                  py="3"
                  px="4"
                  w="100%"
                  roundedLeft="md"
                  fontWeight="medium"
                  bgColor={router.pathname === slug ? "teal.600" : undefined}
                  color={router.pathname === slug ? "gray.200" : undefined}
                  _hover={{
                    background: "gray.700",
                    color: "gray.100",
                  }}
                >
                  <HStack spacing={4}>
                    {icon}
                    <p>{title}</p>
                  </HStack>
                </Link>
              </NextLink>
            );
          })}
        </VStack>

        <Button
          mx="4"
          colorScheme="red"
          variant="solid"
          onClick={logoutHandler}
        >
          Log out
        </Button>
      </VStack>

      <Box w="80%" bgColor="gray.100">
        {children}
      </Box>
    </Flex>
  );
}
