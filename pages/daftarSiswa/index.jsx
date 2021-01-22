import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";
import Head from "next/head";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import { parseCookies } from "nookies";
import SiswaTable from "../../components/daftarSiswa/siswaTable";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  useToast,
  VStack,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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

function DaftarSiswa() {
  const queryClient = useQueryClient();
  const toast = useToast();
  // useSWR Hooks untuk fetch data client-side
  const siswaData = useQuery(["students", "?_sort=tahun_masuk:asc"], fetcher, {
    refetchInterval: 3000,
  });
  const kelasData = useQuery(["classrooms", "?_sort=kelas:asc"], fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userID, setUserID] = useState(0);
  const [nama, setNama] = useState("");
  const [nis, setNis] = useState(null);
  const [kelas, setKelas] = useState("");
  const [kamar, setKamar] = useState("");
  const [jKelamin, setJKelamin] = useState("");
  const [tglLahir, setTglLahir] = useState("");
  const [tahunMasuk, setTahunMasuk] = useState(null);
  const [tahunKeluar, setTahunKeluar] = useState(null);
  const jkList = ["Laki-laki", "Perempuan"];

  // SISWA MUTATION
  const siswaMutation = useMutation((newSiswa) => {
    return axios.post(`${URL}/students`, newSiswa, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  });
  // USER MUTATION
  const userMutation = useMutation((newUser) =>
    axios.post(`${URL}/auth/local/register`, newUser, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // HANDLER SUBMIT TAMBAH SISWA
  const tambahSiswaHadler = () => {
    userMutation.reset();
    // Tambah User Baru
    userMutation.mutate(
      {
        username: nis,
        email: `siswa${nis}@gmail.com`,
        password: `${nis}${tahunMasuk}`,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data, variables) => {
          // Query Invalidations
          // queryCache.invalidateQueries("students");
          console.log(data);
          console.log(variables);
          console.log(data.data.user.id);
          // Ketika berhasil menambah user, tambah siswa baru
          siswaMutation.mutate(
            {
              nama: nama,
              jenis_kelamin: jKelamin,
              nis: nis,
              kelas: { id: kelas.id },
              kamar: kamar,
              tanggal_lahir: tglLahir,
              tahun_masuk: tahunMasuk,
              tahun_keluar: tahunKeluar,
              photo: { id: 2 },
              // user: { id: data.data.user.id },
            },
            {
              onSuccess: (data) => {
                // Ketika berhasil tambah siswa baru, tampilkan toast
                toast({
                  position: "bottom-right",
                  title: "Data Siswa Dibuat.",
                  description: "Data siswa baru telah berhasil dibuat.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                console.log(data);
              },
            }
          );
        },
      }
    );
    onClose();
    // setSelectedClass(null);
  };

  // error handling
  if (siswaData.isError) console.log(error);
  // loading state
  if (siswaData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Siswa"} plusButton={"Siswa"} />
      </>
    );
  }

  if (siswaData.isSuccess) {
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
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      {jKelamin ? jKelamin : "Jenis Kelamin"}
                    </MenuButton>
                    <MenuList>
                      {jkList.map((jkItem, i) => (
                        <MenuItem
                          key={i}
                          onClick={(e) => setJKelamin(e.target.innerHTML)}
                        >
                          {jkItem}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
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
                  <Select
                    defaultValue={kelas}
                    onChange={setKelas}
                    options={kelasData.data}
                    isClearable
                    isSearchable
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Kamar</FormLabel>
                  <Input
                    placeholder="Kamar"
                    onChange={(e) => setKamar(e.target.value)}
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

        <SiswaTable data={siswaData.data} />
      </>
    );
  }
}

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

    let newKelas = [];
    if (collection === "classrooms") {
      newKelas = data.map((kelas) => {
        return { value: kelas.kelas, label: kelas.kelas, id: kelas.id };
      });
      return newKelas;
    }

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
};

export default DaftarSiswa;
