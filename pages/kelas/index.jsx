import React, { useState } from "react";
import {
  dehydrate,
  useQuery,
  useQueryClient,
  QueryClient,
  useMutation,
} from "react-query";
import axios from "axios";
import Head from "next/head";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import { parseCookies } from "nookies";
import KelasTable from "../../components/kelas/kelasTable";
import { AddIcon } from "@chakra-ui/icons";
import {
  useToast,
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
  const toast = useToast();
  const queryClient = useQueryClient();
  const kelasData = useQuery(["classrooms", "?_sort=kelas:asc"], fetcher);
  const guruData = useQuery(["teachers", "?_sort=nama:asc"], fetcher);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [kelas, setKelas] = useState("");
  const [pembimbing, setPembimbing] = useState({ id: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SISWA MUTATION
  const kelasMutation = useMutation((newKelas) =>
    axios.post(`${URL}/classrooms`, newKelas, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // HANDLER SUBMIT TAMBAH SISWA
  const tambahKelasHadler = () => {
    setIsSubmitting(true);
    kelasMutation.mutate(
      {
        kelas: kelas,
        teacher: pembimbing.id,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries("classrooms");
          console.log(data);
          onClose();
          setIsSubmitting(false);
          toast({
            position: "bottom-right",
            title: "Data Kelas Dibuat.",
            description: "Data kelas baru telah berhasil dibuat.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );

    // setSelectedClass(null);
  };

  // error handling
  if (kelasData.isError) {
    console.log(error);
    return <div>error</div>;
  }
  // loading state
  if (kelasData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Kelas"} plusButton={"Kelas"} />
      </>
    );
  }

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
          <ModalHeader>Tambah Kelas</ModalHeader>
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
                <Select
                  onChange={setPembimbing}
                  options={guruData.data || []}
                  isClearable
                  isSearchable
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              isLoading={isSubmitting}
              onClick={tambahKelasHadler}
            >
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

// Function untuk fetch data dari API students
const fetcher = async ({ queryKey }) => {
  const endpoint = `${URL}/${queryKey[0]}${queryKey[1] || ""}`;

  const { data } = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (queryKey[0] !== "teachers") return data;
  else {
    let guruTersedia = data.filter((g) => g.classroom === null);
    let newGuru = guruTersedia.map((guru) => {
      return { value: guru.nama, label: guru.nama, id: guru.id };
    });
    newGuru.unshift({ value: "-", label: "-", id: null });
    return newGuru;
  }
};

export async function getServerSideProps(context) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["classrooms", "?_sort=kelas:asc"], fetcher);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default DaftarKelas;
