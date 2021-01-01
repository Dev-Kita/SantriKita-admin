import React, { useState, useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import HapusSiswaAlert from "../../components/daftar-siswa/hapusSiswaAlert";
import {
  Box,
  VStack,
  ButtonGroup,
  Flex,
  Spacer,
  Skeleton,
  Heading,
  FormControl,
  FormLabel,
  Input,
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

function DetailSiswa() {
  const router = useRouter();
  // Fetch data dengan SWR Hooks
  const { data, error } = useSWR(`/students/${router.query.id}`, fetcher, {
    refreshInterval: 1000,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // Function untuk meng-Handle hapus data siswa
  const deleteHandler = async () => {
    const jwt = parseCookies().jwt;
    const { data } = await axios.delete(`${URL}/students/${router.query.id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    // console.log(data);
    router.replace("/daftar-siswa");
  };

  if (error) console.log(error);
  if (!data) {
    return (
      <>
        <Head>
          <title>Siswa Detail | Santri Kita</title>
        </Head>

        <Box bgColor="white" p="4" rounded="md" borderWidth="1px">
          <VStack align="stretch" spacing={2}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </VStack>
        </Box>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Siswa Detail | Santri Kita</title>
      </Head>

      <Box bgColor="white" p="4" rounded="md" borderWidth="1px">
        <Flex gridGap="4" my="4">
          <Heading fontSize="xl">Siswa Detail</Heading>
          <Spacer />
          <ButtonGroup>
            <Button
              variant="solid"
              size="sm"
              colorScheme={isEditing ? undefined : "teal"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Batal" : "Edit"}
            </Button>
            <Button
              variant="solid"
              size="sm"
              colorScheme="red"
              onClick={() => setOpenAlert(true)}
            >
              Hapus
            </Button>
          </ButtonGroup>
        </Flex>

        <HapusSiswaAlert
          deleteHandler={deleteHandler}
          openAlert={openAlert}
          cancelRef={cancelRef}
          onClose={onClose}
        />

        <form>
          <FormControl id="name">
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              defaultValue={data.nama}
              isReadOnly={!isEditing}
            />
          </FormControl>
          <FormControl id="nis" mt="2">
            <FormLabel>NIS</FormLabel>
            <Input
              type="number"
              defaultValue={data.nis}
              isReadOnly={!isEditing}
            />
          </FormControl>
          <FormControl id="kelas" mt="2">
            <FormLabel>Kelas</FormLabel>
            <Input
              type="text"
              defaultValue={data.classroom}
              isReadOnly={!isEditing}
            />
          </FormControl>
          <FormControl id="tglLahir" mt="2">
            <FormLabel>Tanggal Lahir</FormLabel>
            <Input
              type="text"
              defaultValue={data.tanggal_lahir}
              isReadOnly={!isEditing}
            />
          </FormControl>
          <FormControl id="name" mt="2">
            <FormLabel>Tahun Masuk</FormLabel>
            <Input
              type="number"
              defaultValue={data.tahun_masuk}
              isReadOnly={!isEditing}
            />
          </FormControl>
          <FormControl id="name" mt="2">
            <FormLabel>Tahun Masuk</FormLabel>
            <Input
              type="number"
              defaultValue={data.tahun_keluar}
              isReadOnly={!isEditing}
            />
          </FormControl>

          {isEditing ? (
            <Flex mt="4" alignItems="center">
              <Spacer />

              <Button type="submit" variant="solid" colorScheme="teal">
                Simpan
              </Button>
            </Flex>
          ) : undefined}
        </form>
      </Box>
    </>
  );
}

export default DetailSiswa;
