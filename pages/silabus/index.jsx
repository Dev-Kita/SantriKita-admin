import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import SkeletonLoading from "../../components/skeletonLoading";
import SilabusTable from "../../components/silabus/silabusTable";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { animateVisualElement } from "framer-motion";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;
const animatedComponents = makeAnimated();

function Silabus() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const silabusData = useQuery(["silabuses"], fetcher, {
    refetchInterval: 3000,
  });
  console.log(silabusData.data);
  const kelasData = useQuery("classrooms", fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedClass, setSelectedClass] = useState("");
  const [pelajaran, setPelajaran] = useState("null");
  const [KD, setKD] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [bab, setBab] = useState("");

  const silabusMutation = useMutation((newsilabus) =>
    axios.post(`${URL}/silabuses`, newsilabus, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  const tambahSilabusHandler = () => {
    let submitClass = selectedClass.map((abc) => {
      return { id: abc.id };
    });

    silabusMutation.mutate({
      pelajaran: pelajaran,
      kompetensi_dasar: KD,
      bab: bab,
      keterangan: keterangan,
      classrooms: submitClass,
    });

    setSelectedClass(null);
    onClose();
  };

  // error handling
  if (silabusData.isError) {
    console.log(silabusData.error);
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
  if (silabusData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Silabus"} plusButton={"Silabus"} />
      </>
    );
  }

  if (silabusData.isSuccess) {
    return (
      <>
        <Head>
          <title>Silabus | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Silabus
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Silabus</ModalHeader>
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
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
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
                {/* BAB */}
                <FormControl isRequired>
                  <FormLabel>BAB</FormLabel>
                  <Input
                    placeholder="BAB"
                    onChange={(e) => setBab(e.target.value)}
                  />
                </FormControl>
                {/* Pengajar */}
                <FormControl isRequired>
                  <FormLabel>Kompetensi Dasar</FormLabel>
                  <Input
                    placeholder="Kompetensi Dasar"
                    onChange={(e) => setKD(e.target.value)}
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
              <Button colorScheme="teal" mr={3} onClick={tambahSilabusHandler}>
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <SilabusTable data={silabusData.data} />
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

export default Silabus;
