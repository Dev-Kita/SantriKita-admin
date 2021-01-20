import React, { useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Select from "react-select";
import SkeletonLoading from "../../components/skeletonLoading";
import BiayaTable from "../../components/biaya/biayaTable";
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

function Biaya() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const biayaData = useQuery(
    ["bills", "?_sort=tanggal_pembayaran:DESC"],
    fetcher,
    { refetchInterval: 3000 }
  );
  const siswaData = useQuery("students", fetcher);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedName, setSelectedName] = useState("");
  const [tahun, setTahun] = useState(null);
  const [semester, setSemester] = useState(null);
  const [keperluan, setKeperluan] = useState("");
  const [nominal, setNominal] = useState(null);
  const [nominalDibayar, setNominalDibayar] = useState(null);
  const [sisaPembayaran, setSisaPembayaran] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [status, setStatus] = useState("");
  const statusList = ["Lunas", "Belum Lunas"];

  // BIAYA MUTATION
  const billMutation = useMutation((newBill) =>
    axios.post(`${URL}/bills`, newBill, {
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

  const tambahBiayaHandler = () => {
    billMutation.mutate({
      keperluan: keperluan,
      nominal: nominal,
      nominal_dibayar: nominalDibayar,
      sisa_pembayaran: sisaPembayaran,
      status: status,
      semester: semester,
      tahun: tahun,
      tanggal_pembayaran: tanggal,
      keterangan: keterangan,
      student: { id: selectedName.id },
    });
    notifMutation.mutate({
      notifikasi: "Pembayaran baru ditambahkan",
      slug: "biaya",
      waktu: new Date(),
      terbaca: false,
      student: { id: selectedName.id },
    });
    setSelectedName(null);
    setStatus("");
    onClose();
    toast({
      position: "bottom-right",
      title: "Data Pembayaran Dibuat.",
      description: "Data pembayaran baru telah berhasil dibuat.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // error handling
  if (biayaData.isError) {
    console.log(biayaData.error);
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
  if (biayaData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Biaya"} plusButton={"Biaya"} />
      </>
    );
  }

  if (biayaData.isSuccess) {
    return (
      <>
        <Head>
          <title>Daftar Biaya | Santri Kita</title>
        </Head>

        <Flex mb="4">
          <Spacer />
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            variant="solid"
            colorScheme="teal"
          >
            Biaya
          </Button>
        </Flex>

        {/* MODAL FORM TAMBAH PELANGGARAN */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tambah Pembayaran</ModalHeader>
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
                  <FormLabel>Keperluan</FormLabel>
                  <Input
                    placeholder="Keperluan"
                    onChange={(e) => setKeperluan(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Semester</FormLabel>
                  <Input
                    placeholder="Semester"
                    type="number"
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tahun</FormLabel>
                  <Input
                    placeholder="Tahun"
                    type="number"
                    onChange={(e) => setTahun(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Biaya</FormLabel>
                  <Input
                    placeholder="Biaya"
                    type="number"
                    onChange={(e) => setNominal(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Nominal Dibayar</FormLabel>
                  <Input
                    placeholder="Nominal Dibayar"
                    type="number"
                    onChange={(e) => setNominalDibayar(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Sisa Pembayaran</FormLabel>
                  <Input
                    placeholder="Sisa Pembayaran"
                    type="number"
                    onChange={(e) => setSisaPembayaran(e.target.value)}
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
              <Button colorScheme="teal" mr={3} onClick={tambahBiayaHandler}>
                Simpan
              </Button>
              <Button onClick={onClose}>Batal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <BiayaTable data={biayaData.data} />
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

export default Biaya;
