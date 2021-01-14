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
import { ADD_KESEHATAN, ALL_KESEHATAN } from "../../utils/kesehatanQuery";

const useKesehatanQuery = () => {
  return useQuery(
    "medicalHistories",
    async () => {
      const data = await client.request(ALL_KESEHATAN);
      return data;
    },
    { refetchInterval: 3000 }
  );
};

function Biaya() {
  const medicalData = useKesehatanQuery();
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
  if (medicalData.isError) console.log("error");
  // loading state
  if (medicalData.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Daftar Biaya"} plusButton={"Biaya"} />
      </>
    );
  }

  if (medicalData.isSuccess) {
    const newSiswa = medicalData.data.students.map((student) => {
      return {
        value: student.nama,
        label: `${student.nama} (${student.kelas.kelas})`,
        id: student.id,
      };
    });
    console.table(medicalData.data.medicalHistories);

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

        {/* <BiayaTable data={medicalData.data.bills} /> */}
      </>
    );
  }
}

export default Biaya;
