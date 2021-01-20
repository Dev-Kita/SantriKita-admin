import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import RiwayatPembelajaranTable from "../../components/riwayatPembelajaran/riwayatPembelajaranTable";
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

function RiwayatPembelajaran() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const riwayatPembelajaranData = useQuery(["lesson-histories"], fetcher, {
    refetchInterval: 3000,
  });
  const kelasData = useQuery("classrooms", fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClass, setSelectedClass] = useState("");
  const [pelajaran, setPelajaran] = useState("null");
  const [pengajar, setPengajar] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");

  const lessonHistoryMutation = useMutation((newLessonHistory) =>
    axios.post(`${URL}/lesson-histories`, newLessonHistory, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  const tambahRiwayatBelajarHandler = () => {
    lessonHistoryMutation.mutate({
      pelajaran: pelajaran,
      pengajar: pengajar,
      tanggal: tanggal,
      keterangan: keterangan,
      classroom: { id: selectedClass.id },
    });
    setSelectedClass(null);
    onClose();
    toast({
      position: "bottom-right",
      title: "Data Riwayat Belajar Dibuat.",
      description: "Data riwayat belajar baru telah berhasil dibuat.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // error handling
  if (riwayatPembelajaranData.isError) {
    console.log(riwayatPembelajaranData.error);
    return (
      <Flex justify="center" direction="row">
        <Button
          mt="8"
          mx="auto"
          onClick={() => router.reload()}
          variant="solid"
          colorScheme="teal"
        >
          Reload
        </Button>
      </Flex>
    );
  }
  // loading state
  if (riwayatPembelajaranData.isLoading) {
    return (
      <>
        <SkeletonLoading
          title={"Riwayat Pembelajaran"}
          plusButton={"Riwayat Pembelajaran"}
        />
      </>
    );
  }

  if (riwayatPembelajaranData.isSuccess) {
    return (
      <>
        <Head>
          <title>Riwayat Pembelajaran | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Riwayat Pembelajaran
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Riwayat Pembelajaran</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                {/* Siswa */}
                <FormControl isRequired>
                  <FormLabel>Kelas</FormLabel>
                  <Select
                    defaultValue={selectedClass}
                    onChange={setSelectedClass}
                    options={kelasData.data}
                    isClearable
                    isSearchable
                  />
                </FormControl>
                {/* Pelajaran */}
                <FormControl isRequired>
                  <FormLabel>Pelajaran</FormLabel>
                  <Input
                    placeholder="Pelajaran"
                    onChange={(e) => setPelajaran(e.target.value)}
                  />
                </FormControl>
                {/* Pengajar */}
                <FormControl isRequired>
                  <FormLabel>Pengajar</FormLabel>
                  <Input
                    placeholder="Pengajar"
                    onChange={(e) => setPengajar(e.target.value)}
                  />
                </FormControl>
                {/* Tanggal */}
                <FormControl isRequired>
                  <FormLabel>Tanggal</FormLabel>
                  <Input
                    type="date"
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </FormControl>
                {/* Keterangan */}
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
                onClick={tambahRiwayatBelajarHandler}
              >
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <RiwayatPembelajaranTable data={riwayatPembelajaranData.data} />
      </>
    );
  }
}

// Function untuk fetch data dari API classrooms
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

    let newClassrooms = [];
    if (collection === "classrooms") {
      newClassrooms = data.map((classroom) => {
        return {
          value: classroom.kelas,
          label: `${classroom.kelas}`,
          id: classroom.id,
        };
      });
      return newClassrooms;
    }

    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Query data failed" };
  }
};

export default RiwayatPembelajaran;
