import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import AktivitasSiswaTable from "../../components/aktivitasSiswa/aktivitasSiswaTable";
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
  SimpleGrid,
} from "@chakra-ui/react";
import makeAnimated from "react-select/animated";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

const animatedComponents = makeAnimated();

function AktivitasSiswa() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const aktivitasSiswaData = useQuery(
    ["student-aktivities"],
    aktivitasSiswaFetcher
  );
  const mapelData = useQuery("lessons", aktivitasSiswaFetcher);
  const guruData = useQuery("teachers", aktivitasSiswaFetcher);
  const siswaData = useQuery("students", aktivitasSiswaFetcher);
  console.log(aktivitasSiswaData.data);

  const kategoriList = [
    {
      value: "setoran",
      label: "Setoran",
    },
    {
      value: "pelajaran",
      label: "Pelajaran",
    },
    {
      value: "dll",
      label: "Lainnya",
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [selectedClass, setSelectedClass] = useState("");
  const [title, setTitle] = useState("");
  const [mapel, setMapel] = useState("");
  const [pengajar, setPengajar] = useState("");
  const [siswa, setSiswa] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [kategori, setKategori] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentAktivityMutation = useMutation((newStudentAktivity) =>
    axios.post(`${URL}/student-aktivities`, newStudentAktivity, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  const tambahAktivitasSiswaHandler = () => {
    setIsSubmitting(true);
    const selSiswa = siswa.map((s) => s.id);

    studentAktivityMutation.mutate(
      {
        title: title,
        lesson: mapel.id,
        teacher: pengajar.id,
        kategori: kategori.value,
        students: selSiswa,
        tanggal: tanggal,
        keterangan: keterangan,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries("student-aktivities");
          console.log(data.data);
          setMapel("");
          setPengajar("");
          setSiswa("");
          setKategori("");
          onClose();
          setIsSubmitting(false);
          toast({
            position: "bottom-right",
            title: "Data Aktivitas Siswa Dibuat.",
            description: "Data aktivitas siswa baru telah berhasil dibuat.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  // error handling
  if (aktivitasSiswaData.isError) {
    console.log(aktivitasSiswaData.error);
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
  if (aktivitasSiswaData.isLoading) {
    return (
      <>
        <SkeletonLoading
          title={"Aktivitas Siswa"}
          plusButton={"Aktivitas Siswa"}
        />
      </>
    );
  }

  if (aktivitasSiswaData.isSuccess) {
    return (
      <>
        <Head>
          <title>Aktivitas Siswa | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Aktivitas Siswa
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Aktivitas Siswa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                <SimpleGrid columns={2} spacing={3}>
                  {/* Mapel */}
                  <FormControl isRequired mt="2">
                    <FormLabel>Mapel</FormLabel>
                    <Select
                      defaultValue={mapel}
                      onChange={setMapel}
                      options={mapelData.data}
                      isClearable
                      isSearchable
                    />
                  </FormControl>
                  {/* Title */}
                  <FormControl isRequired mt="2">
                    <FormLabel>Pelajaran</FormLabel>
                    <Input
                      placeholder="Pelajaran"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </FormControl>
                  {/* Pengajar */}
                  <FormControl isRequired mt="2">
                    <FormLabel>Pengajar</FormLabel>
                    <Select
                      defaultValue={pengajar}
                      onChange={setPengajar}
                      options={guruData.data}
                      isClearable
                      isSearchable
                    />
                  </FormControl>
                  {/* Kategori */}
                  <FormControl isRequired mt="2">
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      defaultValue={kategori}
                      onChange={setKategori}
                      options={kategoriList}
                      isClearable
                      isSearchable
                    />
                  </FormControl>
                  {/* Siswa */}
                  <FormControl isRequired mt="2">
                    <FormLabel>Siswa</FormLabel>
                    <Select
                      defaultValue={siswa}
                      onChange={setSiswa}
                      options={siswaData.data}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isClearable
                      isSearchable
                      isMulti
                    />
                  </FormControl>
                  {/* Tanggal */}
                  <FormControl isRequired mt="2">
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
                </SimpleGrid>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="teal"
                mr={3}
                isLoading={isSubmitting}
                onClick={tambahAktivitasSiswaHandler}
              >
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AktivitasSiswaTable data={aktivitasSiswaData.data} />
      </>
    );
  }
}

// Function untuk fetch data dari API classrooms
const aktivitasSiswaFetcher = async ({ queryKey }) => {
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

    let newLessons = [];
    let newTeachers = [];
    let newStudents = [];

    // Rekontruksi Mapel
    if (collection === "lessons") {
      newLessons = data.map((lesson) => {
        return {
          value: lesson.nama,
          label: `${lesson.nama}`,
          id: lesson.id,
        };
      });
      return newLessons;
    }

    // Rekontruksi Guru
    if (collection === "teachers") {
      newTeachers = data.map((lesson) => {
        return {
          value: lesson.nama,
          label: `${lesson.nama}`,
          id: lesson.id,
        };
      });
      return newTeachers;
    }

    // Rekontruksi Siswa
    if (collection === "students") {
      newStudents = data.map((lesson) => {
        return {
          value: lesson.nama,
          label: `${lesson.nama}`,
          id: lesson.id,
        };
      });
      return newStudents;
    }

    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Query data failed" };
  }
};

export default AktivitasSiswa;
