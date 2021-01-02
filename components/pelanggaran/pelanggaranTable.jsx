import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import CardWrapper from "../cardWrapper";
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

function PelanggaranTable({ data }) {
  return (
    <>
      <CardWrapper>
        <Heading fontSize="xl" mb="4" textAlign="center">
          Daftar Pelanggaran
        </Heading>

        <Table variant="simple" size="sm">
          <TableCaption>Daftar Pelanggaran</TableCaption>
          <Thead bgColor="gray.100">
            <Tr>
              <Th py="4">No</Th>
              <Th py="4">Nama</Th>
              <Th py="4">Pelanggaran</Th>
              <Th py="4">Tanggal</Th>
              <Th py="4">Status</Th>
              <Th py="4">Detail</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((violation, i) => {
              const { id, pelanggaran, tanggal, status, student } = violation;
              return (
                <Tr key={id}>
                  <Td>{i + 1}</Td>
                  <Td>{student.nama}</Td>
                  <Td>{pelanggaran}</Td>
                  <Td>{tanggal}</Td>
                  <Td>{status}</Td>
                  <Td>
                    {/* <NextLink href={`${router.pathname}/${id}`}>
                      <Link color="teal.500" fontWeight="medium">
                        Detail
                      </Link>
                    </NextLink> */}
                    Detail
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </CardWrapper>
    </>
  );
}

export default PelanggaranTable;
