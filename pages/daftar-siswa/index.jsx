import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { parseCookies } from "nookies";
import {
  Heading,
  Box,
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
import SiswaTable from "../../components/daftar-siswa/siswaTable";

const URL = process.env.NEXT_PUBLIC_API_URL;

// Function untuk fetch data dari API
const fetcher = async (url) => {
  try {
    const jwt = parseCookies().jwt;

    const { data } = await axios.get(
      `${URL}${url}?_sort=tahun_masuk:asc,classroom:asc`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "You need to login first" };
  }
};

function DaftarSiswa() {
  // useSWR Hooks untuk fetch data client-side
  const { data, error } = useSWR(`/students`, fetcher, {
    refreshInterval: 1000,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [tahunMasuk, setTahunMasuk] = useState(null);
  const [tahunKeluar, setTahunKeluar] = useState(null);

  const tambahSiswaHadler = async () => {
    const siswaData = {
      nama: nama,
      classroom: kelas,
      tanggal_lahir: tglLahir,
      tahun_masuk: tahunMasuk,
      tahun_keluar: tahunKeluar,
    };
    const jwt = parseCookies().jwt;
    const { data } = await axios.post(`${URL}/students`, siswaData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    onClose();
    console.log(data);
  };

  // error handling
  if (error) console.log(error);
  // loading state
  if (!data) {
    return (
      <Box bgColor="white" p="4" rounded="md">
        <Heading fontSize="2xl" textAlign="center">
          Loading...
        </Heading>
      </Box>
    );
  }

  // data tersedia
  return (
    <>
      <Flex mb="4">
        <Spacer />
        <Button onClick={onOpen} variant="solid" colorScheme="teal">
          Tambah Siswa
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

export default DaftarSiswa;
