import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import RiwayatKesehatanTable from "../../components/riwayatKesehatan/riwayatKesehatanTable";
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

function RiwayatKesehatan() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const riwayatKesehatanData = useQuery(
    ["medical-histories"],
    medicHistoryFetcher
  );
  const siswaData = useQuery("students", medicHistoryFetcher);

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedName, setSelectedName] = useState("");
  const [penyakit, setPenyakit] = useState("null");
  const [jenis, setJenis] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const jenisList = ["Umum", "Parah", "Bawaan"];
  const statusList = ["Sembuh", "Belum Sembuh"];

  // KESEHATAN MUTATION
  const medicalHistoryMutation = useMutation((newMedicalHistory) =>
    axios.post(`${URL}/medical-histories`, newMedicalHistory, {
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

  const tambahKesehatanHandler = () => {
    setIsLoading(true);
    medicalHistoryMutation.mutate(
      {
        penyakit: penyakit,
        jenis: jenis,
        status: status === "Sembuh" ? true : false,
        tanggal: tanggal,
        keterangan: keterangan,
        student: { id: selectedName.id },
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          queryClient.invalidateQueries("medical-histories");
          setSelectedName(null);
          setStatus("");
          setJenis("");
          onClose();
          setIsLoading(false);
          toast({
            position: "bottom-right",
            title: "Data Riwayat Kesehatan Dibuat.",
            description: "Data riwayat kesehatan baru telah berhasil dibuat.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          notifMutation.mutate({
            notifikasi: "Riwayat Kesehatan baru ditambahkan",
            slug: "Kesehatan",
            waktu: new Date(),
            terbaca: false,
            student: { id: selectedName.id },
          });
        },
      }
    );
  };

  // error handling
  if (riwayatKesehatanData.isError) {
    console.log(riwayatKesehatanData.error);
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
  if (riwayatKesehatanData.isLoading) {
    return (
      <>
        <SkeletonLoading
          title={"Riwayat Kesehatan"}
          plusButton={"Riwayat Kesehatan"}
        />
      </>
    );
  }

  if (riwayatKesehatanData.isSuccess) {
    return (
      <>
        <Head>
          <title>Riwayat Kesehatan | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Riwayat Kesehatan
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Riwayat Kesehatan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form>
                {/* Siswa */}
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
                {/* Penyakit */}
                <FormControl isRequired>
                  <FormLabel>Penyakit</FormLabel>
                  <Input
                    placeholder="Penyakit"
                    onChange={(e) => setPenyakit(e.target.value)}
                  />
                </FormControl>
                {/* Jenis Penyakit */}
                <FormControl isRequired>
                  <FormLabel>Kategori</FormLabel>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      {jenis ? jenis : "Kategori"}
                    </MenuButton>
                    <MenuList>
                      {jenisList.map((jenisItem, i) => (
                        <MenuItem
                          key={i}
                          onClick={(e) => setJenis(e.target.innerHTML)}
                        >
                          {jenisItem}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>
                {/* Tanggal */}
                <FormControl isRequired>
                  <FormLabel>Tanggal</FormLabel>
                  <Input
                    type="date"
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </FormControl>
                {/* Status */}
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
                onClick={tambahKesehatanHandler}
                isLoading={isLoading}
              >
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <RiwayatKesehatanTable data={riwayatKesehatanData.data} />
      </>
    );
  }
}

// Function untuk fetch data dari API students
const medicHistoryFetcher = async ({ queryKey }) => {
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
    console.error(error);
    return { msg: "Query data failed" };
  }
};

export default RiwayatKesehatan;
