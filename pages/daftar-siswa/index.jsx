import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import Head from "next/head";
import SkeletonLoading from "../../components/skeletonLoading";
import { parseCookies } from "nookies";
import CardWrapper from "../../components/cardWrapper";
import SiswaTable from "../../components/daftar-siswa/siswaTable";
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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function DaftarSiswa() {
  // useSWR Hooks untuk fetch data client-side
  const { data, isError, isLoading, isSuccess } = useQuery(
    ["students", "?_sort=tahun_masuk:asc,classroom:asc"],
    siswaFetcher,
    { refetchInterval: 3000 }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nama, setNama] = useState("");
  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [tahunMasuk, setTahunMasuk] = useState(null);
  const [tahunKeluar, setTahunKeluar] = useState(null);

  const tambahSiswaHadler = async () => {
    const siswaData = {
      nama: nama,
      nis: nis,
      classroom: kelas,
      tanggal_lahir: tglLahir,
      tahun_masuk: tahunMasuk,
      tahun_keluar: tahunKeluar,
    };
    const { data } = await axios.post(`${URL}/students`, siswaData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    onClose();
    // console.log(data);
  };

  // error handling
  if (isError) console.log(error);
  // loading state
  if (isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Siswa"} plusButton={"Siswa"} />
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <Head>
          <title>Daftar Siswa | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Siswa
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
                  <FormLabel>Nama</FormLabel>
                  <Input
                    placeholder="Name"
                    onChange={(e) => setNama(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>NIS</FormLabel>
                  <Input
                    placeholder="NIS"
                    type="number"
                    onChange={(e) => setNis(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Kelas</FormLabel>
                  <Input
                    placeholder="Kelas"
                    onChange={(e) => setKelas(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <Input
                    type="date"
                    onChange={(e) => setTglLahir(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tahun Masuk</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => setTahunMasuk(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tahun Keluar</FormLabel>
                  <Input
                    type="number"
                    onChange={(e) => setTahunKeluar(e.target.value)}
                  />
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={tambahSiswaHadler}>
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <SiswaTable data={data} />
      </>
    );
  }
}

// Function untuk fetch data dari API students
const siswaFetcher = async ({ queryKey }) => {
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

export default DaftarSiswa;
