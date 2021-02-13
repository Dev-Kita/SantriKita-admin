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
import { GiAchievement, GiPoliceBadge, GiTeacher } from "react-icons/gi";
import {
  FaSchool,
  FaBookOpen,
  FaBook,
  FaBriefcaseMedical,
  FaMoneyBillWaveAlt,
  FaSignOutAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";

const sideMenu = [
  { icon: <MdDashboard />, title: "Dashboard", slug: "/dashboard" },
  { icon: <FaSchool />, title: "Kelas", slug: "/kelas" },
  { icon: <FaBook />, title: "Silabus", slug: "/silabus" },
  { icon: <MdSchool />, title: "Daftar Siswa", slug: "/daftarSiswa" },
  {
    icon: <FaChalkboardTeacher />,
    title: "Daftar Guru & Ustad",
    slug: "/daftarGuru",
  },
  {
    icon: <FaBookOpen />,
    title: "Aktivitas Siswa",
    slug: "/aktivitasSiswa",
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

  return (
    <Flex flexDir="row" justifyContent="space-between">
      <VStack
        py="8"
        pl="4"
        bgColor="teal.700"
        w="20%"
        h="100%"
        color="gray.200"
        align="stretch"
        justify="space-between"
        overflowX="hidden"
        overflowY="auto"
        position="fixed"
        zIndex={1}
      >
        <Heading ml="4" mb="8" fontSize="3xl" color="gray.100">
          SANTRI KITA
        </Heading>
        <VStack align="stretch">
          {sideMenu.map(({ icon, title, slug }, i) => {
            return (
              <NextLink href={slug} key={i}>
                <Link
                  py="3"
                  px="4"
                  w="100%"
                  roundedLeft="md"
                  fontWeight="medium"
                  bgColor={router.pathname === slug ? "teal.800" : undefined}
                  color={router.pathname === slug ? "gray.100" : undefined}
                  _hover={{
                    background: "teal.500",
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

        <Spacer />
      </VStack>

      <Box ml="20%" minH="100vh" w="80%" bgColor="gray.100">
        {children}
      </Box>
    </Flex>
  );
}
