import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import CardWrapper from "../cardWrapper";
import Moment from "react-moment";
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

function SiswaTable(props) {
  const { data } = props;
  const router = useRouter();
  if (!data) return <h1>Waiting</h1>;
  if (data) {
    return (
      <>
        <CardWrapper>
          <Heading fontSize="xl" mb="4" textAlign="center">
            Daftar Siswa
          </Heading>

          <Table variant="simple" size="sm">
            <TableCaption>Daftar Siswa</TableCaption>
            <Thead bgColor="gray.100">
              <Tr>
                <Th py="4">No</Th>
                <Th py="4">Nama</Th>
                <Th py="4">NIS</Th>
                <Th py="4">Kelas</Th>
                <Th py="4">Tanggal Lahir</Th>
                <Th py="4" isNumeric>
                  Tahun Masuk
                </Th>
                <Th py="4">Detail</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((siswa, i) => {
                const {
                  id,
                  nama,
                  nis,
                  classroom,
                  tanggal_lahir,
                  tahun_masuk,
                } = siswa;
                return (
                  <Tr key={id}>
                    <Td>{i + 1}</Td>
                    <Td>{nama}</Td>
                    <Td>{nis}</Td>
                    <Td>{classroom}</Td>
                    <Td>
                      <Moment format="DD MMM YYYY">{tanggal_lahir}</Moment>
                    </Td>
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
        </CardWrapper>
      </>
    );
  }
}

export default SiswaTable;
