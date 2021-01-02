import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import Head from "next/head";
import { parseCookies } from "nookies";
import Select from "react-select";
import CardWrapper from "../../components/cardWrapper";
import PelanggaranTable from "../../components/pelanggaran/pelanggaranTable";
import { ChevronDownIcon } from "@chakra-ui/icons";
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
  Textarea,
  Input,
  Skeleton,
  SkeletonText,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;

// FETCH DATA
// Function untuk get data API violations
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
    return { msg: "Query data failed" };
  }
};

// COMPONENT UTAMA
function DaftarPelanggaran({ siswa }) {
  // DEKLARASI HOOKS DAN VARIABEL
  const { data, error } = useSWR(`/violations`, fetcher, {
    refreshInterval: 1000,
  });
  const newSiswa = siswa.map((student) => {
    return { value: student.nama, label: student.nama, id: student.id };
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedName, setSelectedName] = useState(null);
  const [pelanggaran, setPelanggaran] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const statusList = ["Ringan", "Sedang", "Berat"];
  const [keterangan, setKeterangan] = useState("");

  // EVENT HANDLER FUNCTION
  const tambahPelanggaranHadler = async () => {
    try {
      const newPelanggaran = {
        pelanggaran: pelanggaran,
        keterangan: keterangan,
        tanggal: tanggal,
        status: status,
        student: { id: selectedName.id },
      };
      const jwt = parseCookies().jwt;
      const { data } = await axios.post(`${URL}/violations`, newPelanggaran, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setSelectedName(null);
      setStatus("");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  // RENDER HALAMAN JSX
  // error handling
  if (error) console.log(error);
  // loading state
  if (!data) {
    return (
      <>
        <Head>
          <title>Daftar Pelanggaran | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button variant="solid" colorScheme="teal">
            Tambah Pelanggaran
          </Button>
        </Flex>
        <CardWrapper>
          <VStack align="stretch" spacing={2}>
            <Skeleton height="20px" mb="4" rounded="md" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" rounded="full" />
          </VStack>
        </CardWrapper>
      </>
    );
  }

  if (data) {
    return (
      <>
        <Head>
          <title>Daftar Pelanggaran | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button onClick={onOpen} variant="solid" colorScheme="teal">
            Tambah Pelanggaran
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Pelanggaran</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <FormControl isRequired>
                  <FormLabel>Siswa</FormLabel>
                  <Select
                    defaultValue={selectedName}
                    onChange={setSelectedName}
                    options={newSiswa}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Pelanggaran</FormLabel>
                  <Input
                    placeholder="Pelanggaran"
                    onChange={(e) => setPelanggaran(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tanggal</FormLabel>
                  <Input
                    type="date"
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      {status ? status : "Status"}
                    </MenuButton>
                    <MenuList>
                      {statusList.map((statusItem, i) => (
                        <MenuItem
                          key={i}
                          onClick={(e) => setStatus(e.target.innerHTML)}
                        >
                          {statusItem}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>

                <FormControl>
                  <FormLabel>Keterangan</FormLabel>
                  <Textarea
                    placeholder="Keterangan"
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="teal"
                mr={3}
                onClick={tambahPelanggaranHadler}
              >
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* TABEL PELANGGARAN */}
        <PelanggaranTable data={data} />
      </>
    );
  }
}

export async function getServerSideProps(context) {
  try {
    const jwt = parseCookies(context).jwt;

    const { data } = await axios.get(`${URL}/students`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return { props: { siswa: data } };
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
}

export default DaftarPelanggaran;
