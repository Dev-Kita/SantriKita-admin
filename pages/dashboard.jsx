import React from "react";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useQuery } from "react-query";
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
import SkeletonLoading from "../components/skeletonLoading";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function Dashboard() {
  // console.log(jumlahSiswa, jumlahPelanggaran);
  const countData = useQuery(
    [
      "count",
      {
        siswa: "students",
        kelas: "classrooms",
        prestasi: "achievements",
        pelanggaran: "violations",
        biaya: "bills",
        kesehatan: "medical-histories",
      },
    ],
    fetcher
  );

  if (countData.isLoading) {
    return (
      <>
        <CardWrapper>
          <Heading textAlign="center" fontSize="2xl">
            Wellcome to dashboard
          </Heading>
        </CardWrapper>

        <SkeletonLoading title={"Dashboard"} />
      </>
    );
  }

  if (countData.isSuccess) {
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

          <Flex justify="space-between" wrap="wrap">
            <CardWrapper width="49%">
              <Stat>
                <StatLabel>Jumlah Siswa</StatLabel>
                <StatNumber>{countData.data.siswa}</StatNumber>
                <StatHelpText>Total Siswa Terdata</StatHelpText>
              </Stat>
            </CardWrapper>

            <CardWrapper width="49%">
              <Stat>
                <StatLabel>Jumlah Kelas</StatLabel>
                <StatNumber>{countData.data.kelas}</StatNumber>
                <StatHelpText>Total Kelas Terdata</StatHelpText>
              </Stat>
            </CardWrapper>

            <CardWrapper width="49%">
              <Stat>
                <StatLabel>Jumlah Pelanggaran</StatLabel>
                <StatNumber>{countData.data.pelanggaran}</StatNumber>
                <StatHelpText>Total Pelanggaran Terdata</StatHelpText>
              </Stat>
            </CardWrapper>

            <CardWrapper width="49%">
              <Stat>
                <StatLabel>Jumlah Prestasi</StatLabel>
                <StatNumber>{countData.data.prestasi}</StatNumber>
                <StatHelpText>Total Prestasi Terdata</StatHelpText>
              </Stat>
            </CardWrapper>

            <CardWrapper width="49%">
              <Stat>
                <StatLabel>Jumlah Pembayaran</StatLabel>
                <StatNumber>{countData.data.biaya}</StatNumber>
                <StatHelpText>Total Pembayaran Terdata</StatHelpText>
              </Stat>
            </CardWrapper>

            <CardWrapper width="49%">
              <Stat>
                <StatLabel>Jumlah Riwayat Kesehatan</StatLabel>
                <StatNumber>{countData.data.kesehatan}</StatNumber>
                <StatHelpText>Total Riwayat Kesehatan Terdata</StatHelpText>
              </Stat>
            </CardWrapper>
          </Flex>
        </Box>
      </>
    );
  }
}

const fetcher = async ({ queryKey }) => {
  try {
    const params = queryKey[0];

    // Query Jumlah Siswa
    const siswaData = await axios.get(`${URL}/${queryKey[1].siswa}/${params}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    // Query Jumlah Kelas
    const kelasData = await axios.get(`${URL}/${queryKey[1].kelas}/${params}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    // Query Jumlah Prestasi
    const prestasiData = await axios.get(
      `${URL}/${queryKey[1].prestasi}/${params}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    // Query Jumlah Biaya
    const biayaData = await axios.get(`${URL}/${queryKey[1].biaya}/${params}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    // Query Jumlah Pelanggaran
    const pelanggaranData = await axios.get(
      `${URL}/${queryKey[1].pelanggaran}/${params}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    // Query Jumlah Kesehatan
    const kesehatanData = await axios.get(
      `${URL}/${queryKey[1].kesehatan}/${params}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const data = {
      kelas: kelasData.data,
      siswa: siswaData.data,
      pelanggaran: pelanggaranData.data,
      biaya: biayaData.data,
      prestasi: prestasiData.data,
      kesehatan: kesehatanData.data,
    };

    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Query data failed" };
  }
};

export default Dashboard;
