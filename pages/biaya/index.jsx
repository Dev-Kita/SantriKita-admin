import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Head from "next/head";
import SkeletonLoading from "../../components/skeletonLoading";
import BiayaTable from "../../components/biaya/biayaTable.jsx";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Select from "react-select";
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
import { client } from "../../utils/gql";
import { ALL_BIAYA, ADD_BIAYA } from "../../utils/biayaQuery";

const useBiayaQuery = () => {
  return useQuery(
    "bills",
    async () => {
      const data = await client.request(ALL_BIAYA);
      return data;
    },
    { refetchInterval: 3000 }
  );
};

function Biaya() {
  const biayaData = useBiayaQuery();
  console.table(biayaData.data.bills);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedName, setSelectedName] = useState("");
  const [tahun, setTahun] = useState(null);
  const [semester, setSemester] = useState(null);
  const [keperluan, setKeperluan] = useState("");
  const [nominal, setNominal] = useState(null);
  const [nominalDibayar, setNominalDibayar] = useState(null);
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState("");
  const statusList = ["Lunas", "Belum Lunas"];

  const tambahBiayaHandler = async () => {
    const variables = {
      student: selectedName.id,
      Keperluan: keperluan,
      semester: Number(semester),
      tahun: Number(tahun),
      nominal: Number(nominal),
      nominal_dibayar: Number(nominalDibayar),
      tanggal: tanggal,
      status: status,
    };

    const res = await client.request(ADD_BIAYA, variables);
    onClose();
  };

  // error handling
  if (biayaData.isError) console.log("error");
  // loading state
  if (biayaData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Biaya"} plusButton={"Biaya"} />
      </>
    );
  }

  if (biayaData.isSuccess) {
    const newSiswa = biayaData.data.students.map((student) => {
      return {
        value: student.nama,
        label: `${student.nama} (${student.kelas.kelas})`,
        id: student.id,
      };
    });

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
                    options={newSiswa}
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
                    placeholder="Biaya Bulanan"
                    type="number"
                    onChange={(e) => setNominal(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Nominal Dibayar</FormLabel>
                  <Input
                    placeholder="Nominal Dibayar"
                    type="numeber"
                    onChange={(e) => setNominalDibayar(e.target.value)}
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

        <BiayaTable data={biayaData.data.bills} />
      </>
    );
  }
}

// Function untuk fetch data dari API students
// const fetcher = async ({ queryKey }) => {
//   try {
//     const collection = queryKey[0];
//     let endpoint = `${URL}/${collection}`;

//     if (queryKey[1]) {
//       const params = queryKey[1];
//       endpoint = `${URL}/${collection}${params}`;
//     }

//     const { data } = await axios.get(endpoint, {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//       },
//     });

//     let const  = [];
//     if (collection === "students") {
//       newSiswa = data.map((student) => {
//         return {
//           value: student.nama,
//           label: `${student.nama} (${student.kelas.kelas})`,
//           id: student.id,
//         };
//       });
//       return newSiswa;
//     }

//     return data;
//   } catch (error) {
//     console.log(error);
//     return { msg: "Query data failed" };
//   }
// };

export default Biaya;
