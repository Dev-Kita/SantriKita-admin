import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useQuery, useQueryClient, useMutation } from "react-query";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import PrestasiTable from "../../components/prestasi/prestasiTable";
import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import {
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
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

// COMPONENT UTAMA
function DaftarPrestasi() {
  // const queryClient = useQueryClient();
  // DEKLARASI HOOKS DAN VARIABEL
  const prestasiData = useQuery(["achievements", "?_sort=tahun:ASC"], fetcher, {
    refetchInterval: 3000,
  });
  const siswaData = useQuery("students", fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedName, setSelectedName] = useState(null);
  const [lomba, setLomba] = useState("");
  const [prestasi, setPrestasi] = useState("");
  const [lingkup, setLingkup] = useState("");
  const [tahun, setTahun] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // MUTATION
  // PRESTASI MUTATION
  const achievementMutation = useMutation((newAchievement) =>
    axios.post(`${URL}/achievements`, newAchievement, {
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
  const tambahPrestasiHadler = () => {
    achievementMutation.mutate({
      kegiatan_lomba: lomba,
      prestasi: prestasi,
      lingkup: lingkup,
      tahun: tahun,
      keterangan: keterangan,
      student: { id: selectedName.id },
    });
    notifMutation.mutate({
      notifikasi: "Prestasi baru ditambahkan",
      slug: "prestasi",
      waktu: new Date(),
      terbaca: false,
      student: { id: selectedName.id },
    });

    setSelectedName(null);
    onClose();
  };

  // RENDER HALAMAN JSX
  // error handling
  if (prestasiData.isError) console.log(error);
  // loading state
  if (prestasiData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Prestasi"} plusButton={"Prestasi"} />
      </>
    );
  }

  if (prestasiData.isSuccess) {
    return (
      <>
        <Head>
          <title>Daftar Prestasi | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Prestasi
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Prestasi</ModalHeader>
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
                  <FormLabel>Lomba / Kegiatan</FormLabel>
                  <Input
                    placeholder="Lomba / kegiatan"
                    onChange={(e) => setLomba(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Prestasi</FormLabel>
                  <Input
                    placeholder="Prestasi"
                    onChange={(e) => setPrestasi(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Lingkup</FormLabel>
                  <Input
                    placeholder="Lingkup"
                    onChange={(e) => setLingkup(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tahun</FormLabel>
                  <Input
                    placeholder="2021"
                    type="number"
                    onChange={(e) => setTahun(e.target.value)}
                  />
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
              <Button colorScheme="teal" mr={3} onClick={tambahPrestasiHadler}>
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* TABEL PELANGGARAN */}
        <PrestasiTable data={prestasiData.data} />
      </>
    );
  }
}

// FETCH DATA
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

    let newSiswa = [];
    if (collection === "students") {
      newSiswa = data.map((student) => {
        return {
          value: student.nama,
          label: `${student.nama} (${student.kelas.kelas})`,
          id: student.id,
        };
      });
      return newSiswa;
    }

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
};

export default DaftarPrestasi;
