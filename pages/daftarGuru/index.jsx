import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import Select from "react-select";
import { parseCookies } from "nookies";
import { useQueryClient, useQuery, useMutation } from "react-query";
import {
  useToast,
  useDisclosure,
  Button,
  Flex,
  Spacer,
  Textarea,
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
import { AddIcon } from "@chakra-ui/icons";
import SkeletonLoading from "../../components/skeletonLoading";
import GuruTable from "../../components/daftarGuru/guruTable";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function DaftarGuru() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const kelasData = useQuery(["classrooms", "?_sort=kelas:asc"], fetcher);
  const guruData = useQuery("teachers", fetcher, {
    refetchInterval: 2000,
  });
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kelas, setKelas] = useState("");

  // GURU MUTATION
  const guruMutation = useMutation((newGuru) =>
    axios.post(`${URL}/teachers`, newGuru, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // USER MUTATION
  const userMutation = useMutation((newUser) =>
    axios.post(`${URL}/auth/local/register`, newUser, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // UPDATE USER MUTATION
  const updateUserMutation = useMutation((newUser) =>
    axios.put(`${URL}/users/${newUser.id}`, newUser.data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  const tambahGuruHandler = () => {
    const uniqueNama = nama.split(" ").join("").toLowerCase();
    userMutation.reset();

    // Register User Baru
    userMutation.mutate(
      {
        username: uniqueNama,
        email: `${uniqueNama}@gmail.com`,
        password: `${uniqueNama}123`,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries("teachers");
          const uid = Number(data.data?.user?.id);
          guruMutation.mutate(
            {
              nama: nama,
              alamat: alamat,
              classroom: kelas.id && { id: kelas.id },
            },
            {
              onError: (error) => console.log(error),
              onSuccess: (data) => {
                queryClient.invalidateQueries("teachers");
                const gid = data.data?.id;
                updateUserMutation.mutate(
                  {
                    id: uid,
                    data: {
                      role: 5,
                      teacher: gid,
                    },
                  },
                  {
                    onError: (error) => console.log(error),
                    onSuccess: (data) => {
                      toast({
                        position: "bottom-right",
                        title: "Data Guru Dibuat.",
                        description: "Data Guru baru telah berhasil dibuat.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                      console.log(data.data);
                    },
                  }
                );
              },
            }
          );
        },
      }
    );
    onClose();
  };

  // error handling
  if (guruData.isError) console.log(error);
  // loading state
  if (guruData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Guru"} plusButton={"Guru"} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Daftar Guru | Santri Kita</title>
      </Head>

      <Flex mb="4">
        <Spacer />
        <Button
          leftIcon={<AddIcon />}
          onClick={onOpen}
          variant="solid"
          colorScheme="teal"
        >
          Guru
        </Button>
      </Flex>

      <GuruTable data={guruData.data} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Guru</ModalHeader>
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
                <FormLabel>Alamat</FormLabel>
                <Textarea
                  placeholder="Alamat"
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Kelas</FormLabel>
                <Select
                  defaultValue={kelas}
                  onChange={setKelas}
                  options={kelasData.data}
                  isClearable
                  isSearchable
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={tambahGuruHandler}>
              Simpan
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DaftarGuru;

const fetcher = async ({ queryKey }) => {
  const collection = queryKey[0];
  let endpoint = `${URL}/${collection}`;

  if (queryKey[1]) {
    const filter = queryKey[1];
    endpoint = `${URL}/${collection}${filter}`;
  }

  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    let newKelas = [];
    if (collection === "classrooms") {
      newKelas = data.map((kelas) => {
        return { value: kelas.kelas, label: kelas.kelas, id: kelas.id };
      });
      newKelas.unshift({ value: "-", label: "-", id: null });
      return newKelas;
    }

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
};
