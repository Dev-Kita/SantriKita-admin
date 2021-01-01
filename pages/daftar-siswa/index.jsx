import React from "react";
import useSWR from "swr";
import axios from "axios";
import { parseCookies } from "nookies";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Heading,
  Box,
  Button,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;

// Function untuk fetch data dari API
const fetcher = async (url) => {
  try {
    const jwt = parseCookies().jwt;

    const { data } = await axios.get(`${URL}${url}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "You need to login first" };
  }
};

function DaftarSiswa() {
  // useSWR Hooks untuk fetch data client-side
  const { data, error } = useSWR(`/students`, fetcher);

  if (error) console.log(error);
  if (!data) {
    return (
      <Box bgColor="white" p="4" rounded="md">
        <Heading fontSize="2xl" textAlign="center">
          Loading...
        </Heading>
      </Box>
    );
  }
  console.log(data);
  return (
    <Box bgColor="white" p="4" rounded="md">
      <Heading fontSize="xl" mb="4" textAlign="center">
        Daftar Siswa
      </Heading>

      <Table variant="simple" size="sm">
        <TableCaption>Daftar Siswa</TableCaption>
        <Thead bgColor="gray.100">
          <Tr>
            <Th py="4">No</Th>
            <Th py="4">Nama</Th>
            <Th py="4">Kelas</Th>
            <Th py="4">Tanggal Lahir</Th>
            <Th py="4" isNumeric>
              Tahun Masuk
            </Th>
            <Th py="4">Edit</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(
            ({ id, nama, classroom, tanggal_lahir, tahun_masuk }, i) => {
              return (
                <Tr key={id}>
                  <Td>{i + 1}</Td>
                  <Td>{nama}</Td>
                  <Td>{classroom}</Td>
                  <Td>{tanggal_lahir}</Td>
                  <Td isNumeric>{tahun_masuk}</Td>
                  <Td>
                    <Button colorScheme="teal" variant="solid">
                      Edit
                    </Button>
                  </Td>
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </Box>
  );
}

export default DaftarSiswa;
