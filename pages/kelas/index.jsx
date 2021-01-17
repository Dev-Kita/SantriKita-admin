import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Head from "next/head";
import SkeletonLoading from "../../components/skeletonLoading";
import { parseCookies } from "nookies";
import KelasTable from "../../components/kelas/kelasTable";
import { AddIcon } from "@chakra-ui/icons";
import {
  VStack,
  Flex,
  Spacer,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function DaftarKelas() {
  const kelasData = useQuery(["classrooms", "?_sort=kelas:asc"], fetcher, {
    refetchInterval: 3000,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [kelas, setKelas] = useState("");
  const [pembimbing, setPembimbing] = useState("");

  const tambahKelasHadler = async () => {
    const newKelasData = {
      kelas: kelas,
      pembimbing: pembimbing,
    };
    const { data } = await axios.post(`${URL}/classrooms`, newKelasData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    onClose();
    // console.log(data);
  };

  // error handling
  if (kelasData.isError) console.log(error);
  // loading state
  if (kelasData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Kelas"} plusButton={"Kelas"} />
      </>
    );
  }

  if (kelasData.isSuccess) {
    return (
      <>
        <Head>
          <title>Daftar Kelas | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Kelas
          </Button>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Siswa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <FormControl isRequired>
                  <FormLabel>Kelas</FormLabel>
                  <Input
                    placeholder="Kelas"
                    onChange={(e) => setKelas(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Pembimbing</FormLabel>
                  <Input
                    placeholder="Pembimbing"
                    onChange={(e) => setPembimbing(e.target.value)}
                  />
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={tambahKelasHadler}>
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <KelasTable data={kelasData.data} />
      </>
    );
  }
}

// Function untuk fetch data dari API students
const fetcher = async ({ queryKey }) => {
  try {
    const collection = queryKey[0];
    let endpoint = `${URL}/${collection}`;

    if (queryKey[1]) {
      const params = queryKey[1];
      endpoint = `${URL}/${collection}${params}`;
    }

    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
};

export default DaftarKelas;
