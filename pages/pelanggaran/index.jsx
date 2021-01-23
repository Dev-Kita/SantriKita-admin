import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useQuery, useQueryClient, useMutation } from "react-query";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import PelanggaranTable from "../../components/pelanggaran/pelanggaranTable";
import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import {
  useToast,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

// COMPONENT UTAMA
function DaftarPelanggaran() {
  const toast = useToast();
  // const queryClient = useQueryClient();
  // DEKLARASI HOOKS DAN VARIABEL
  const pelanggaranData = useQuery(
    ["violations", "?_sort=tanggal:DESC"],
    pelanggaranFetcher,
    { refetchInterval: 500 }
  );
  const siswaData = useQuery("students", siswaFetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedName, setSelectedName] = useState(null);
  const [pelanggaran, setPelanggaran] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [statusPelanggaran, setStatusPelanggaran] = useState("");
  const statusList = ["Ringan", "Sedang", "Berat"];
  const [keterangan, setKeterangan] = useState("");

  // MUTATION
  // PRESTASI MUTATION
  const violationMutation = useMutation((newViolation) =>
    axios.post(`${URL}/violations`, newViolation, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );
  // NOTIF MUTATION
  const notifMutation = useMutation((newNotif) =>
    axios.post(`${URL}/notifications`, newNotif, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // EVENT HANDLER FUNCTION
  const tambahPelanggaranHandler = () => {
    violationMutation.mutate({
      pelanggaran: pelanggaran,
      keterangan: keterangan,
      tanggal: tanggal,
      status: statusPelanggaran,
      student: { id: selectedName.id },
    });
    notifMutation.mutate({
      notifikasi: "Pelanggaran baru ditambahkan",
      slug: "Pelanggaran",
      waktu: new Date(),
      terbaca: false,
      student: { id: selectedName.id },
    });

    setSelectedName(null);
    setStatusPelanggaran("");
    onClose();
    toast({
      position: "bottom-right",
      title: "Data Pelanggaran Dibuat.",
      description: "Data pelanggaran baru telah berhasil dibuat.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // RENDER HALAMAN JSX
  // error handling
  if (pelanggaranData.isError) console.log(error);
  // loading state
  if (pelanggaranData.isLoading) {
    return (
      <>
        <SkeletonLoading
          title={"Daftar Pelanggaran"}
          plusButton={"Pelanggaran"}
        />
      </>
    );
  }

  if (pelanggaranData.isSuccess) {
    return (
      <>
        <Head>
          <title>Daftar Pelanggaran | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Pelanggaran
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
                    options={siswaData.data}
                    isClearable
                    isSearchable
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
                      {statusPelanggaran ? statusPelanggaran : "Status"}
                    </MenuButton>
                    <MenuList>
                      {statusList.map((statusItem, i) => (
                        <MenuItem
                          key={i}
                          onClick={(e) =>
                            setStatusPelanggaran(e.target.innerHTML)
                          }
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
                onClick={tambahPelanggaranHandler}
              >
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* TABEL PELANGGARAN */}
        <PelanggaranTable data={pelanggaranData.data} />
      </>
    );
  }
}

// FETCH DATA
// Function untuk get data API pelanggaran
const pelanggaranFetcher = async ({ queryKey }) => {
  try {
    // Define data tabel / collection yang akan di query
    const collection = queryKey[0];
    // Define API endpoint
    let endpoint = `${URL}/${collection}`;
    // Define endpoint jika ada parameter lain (sorting, filter, dll)
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

// Function untuk get data API daftar siswa
const siswaFetcher = async ({ queryKey }) => {
  try {
    // Define data tabel / collection yang akan di query
    const collection = queryKey[0];
    // Define API endpoint
    let endpoint = `${URL}/${collection}`;
    // Define endpoint jika ada parameter lain (sorting, filter, dll)
    if (queryKey[1]) {
      const params = queryKey[1];
      endpoint = `${URL}/${collection}${params}`;
    }

    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const newSiswa = data.map((student) => {
      return {
        value: student.nama,
        label: `${student.nama} (${student.kelas.kelas})`,
        id: student.id,
      };
    });
    return newSiswa;
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
};

export default DaftarPelanggaran;
