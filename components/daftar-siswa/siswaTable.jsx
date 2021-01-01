import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Heading,
  Link,
} from "@chakra-ui/react";

function SiswaTable({ data }) {
  const router = useRouter();
  return (
    <>
      <Box bgColor="white" p="4" rounded="md" borderWidth="1px">
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
            {data.map((siswa, i) => {
              const { id, nama, classroom, tanggal_lahir, tahun_masuk } = siswa;
              return (
                <Tr key={id}>
                  <Td>{i + 1}</Td>
                  <Td>{nama}</Td>
                  <Td>{classroom}</Td>
                  <Td>{tanggal_lahir}</Td>
                  <Td isNumeric>{tahun_masuk}</Td>
                  <Td>
                    <NextLink href={`${router.pathname}/${id}`}>
                      <Link color="teal.500" fontWeight="medium">
                        Detail
                      </Link>
                    </NextLink>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}

export default SiswaTable;
