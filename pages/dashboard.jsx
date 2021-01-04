import React from "react";
import Head from "next/head";
import { parseCookies } from "nookies";
import axios from "axios";
import {
  Flex,
  Box,
  Heading,
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import CardWrapper from "../components/cardWrapper";

const URL = process.env.NEXT_PUBLIC_API_URL;

function Dashboard() {
  // console.log(jumlahSiswa, jumlahPelanggaran);

  return (
    <>
      <Head>
        <title>Dashboard | Santri Kita</title>
      </Head>

      <Box>
        <CardWrapper>
          <Heading textAlign="center" fontSize="2xl">
            Wellcome to dashboard
          </Heading>
        </CardWrapper>

        <Flex justify="space-between">
          <CardWrapper width="49%">
            <Stat>
              <StatLabel>Jumlah Siswa</StatLabel>
              <StatNumber>0</StatNumber>
              <StatHelpText>Total Siswa Terdata</StatHelpText>
            </Stat>
          </CardWrapper>

          <CardWrapper width="49%">
            <Stat>
              <StatLabel>Jumlah Pelanggaran</StatLabel>
              <StatNumber>0</StatNumber>
              <StatHelpText>Total Pelanggaran Terdata</StatHelpText>
            </Stat>
          </CardWrapper>
        </Flex>
      </Box>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const jwt = parseCookies(context).jwt;
//   const studentsCount = await axios.get(`${URL}/students/count`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   });
//   const violationsCount = await axios.get(`${URL}/violations/count`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   });
//   return {
//     props: {
//       jumlahSiswa: studentsCount.data,
//       jumlahPelanggaran: violationsCount.data,
//     },
//   };
// }

export default Dashboard;
