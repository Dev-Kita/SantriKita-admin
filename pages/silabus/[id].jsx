import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import HapusSilabusAlert from "../../components/silabus/hapusSilabusAlert";
import CardWrapper from "../../components/cardWrapper";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  useToast,
  VStack,
  TextArea,
  ButtonGroup,
  Flex,
  Spacer,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;
const animatedComponents = makeAnimated();

// KKOMPONEN UTAMA
function SilabusDetail({ silabuses, daftarKelas }) {
  const toast = useToast();
  const router = useRouter();
  // ARRAY SEMUA KELAS
  const kelasList = daftarKelas.map((aaa) => {
    return aaa.value;
  });
  // ARRAY SILABUS KELAS
  const silabusKelas = silabuses.classrooms.map((kelasData) => {
    const x = [];
    x.push(kelasData.kelas);
    return x;
  });
  // array kumpulan kelas dijadikan satu string

  const joinSilKelas = silabusKelas.join(", ");
  const [kelas, setKelas] = useState("");
  const [pelajaran, setPelajaran] = useState(silabuses.pelajaran);
  const [bab, setBab] = useState(silabuses.bab);
  const [KD, setKD] = useState(silabuses.kompetensi_dasar);
  const [keterangan, setKeterangan] = useState(silabuses.keterangan);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // const silabusesInfo = {
  //   pelajaran: pelajaran,
  //   kompetensi_dasar: KD,
  //   bab: bab,
  //   keterangan: keterangan,
  // };

  // Function untuk meng-Handle hapus data siswa
  const deleteHandler = async () => {
    // Delete data dari DB
    const { data } = await axios.delete(`${URL}/silabuses/${router.query.id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    router.replace("/silabus");
    toast({
      position: "bottom-right",
      title: "Data Silabus Dihapus.",
      description: "Data silabus telah berhasil dihapus.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {
    // try {
    //   e.preventDefault();
    //   setIsLoading(true);
    //   const jwt = parseCookies().jwt;
    //   const { data } = await axios.put(
    //     `${URL}/silabuses/${router.query.id}`,
    //     silabusesInfo,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${jwt}`,
    //       },
    //     }
    //   );
    //   console.log(data);
    //   setIsLoading(false);
    //   setIsEditing(false);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  if (!silabuses) {
    return (
      <>
        <SkeletonLoading title={"Silabus Detail"} />
      </>
    );
  }

  if (silabuses) {
    return (
      <>
        <Head>
          <title>Silabus Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/silabus">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Silabus Detail</Heading>
            <Spacer />
            <ButtonGroup>
              {/* <Button
                variant="solid"
                size="sm"
                colorScheme={isEditing ? undefined : "teal"}
                onClick={() => {
                  setIsEditing(!isEditing);
                  setKelas(joinSilKelas);
                }}
              >
                {isEditing ? "Batal" : "Edit"}
              </Button> */}
              <Button
                variant="solid"
                size="sm"
                colorScheme="red"
                onClick={() => setOpenAlert(true)}
              >
                Hapus
              </Button>
            </ButtonGroup>
          </Flex>

          {/* KONFIRMASI HAPUS SISWA */}
          <HapusSilabusAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <FormControl id="kelas" mt="2">
              <FormLabel>Kelas</FormLabel>
              {isEditing ? (
                <Select
                  defaultValue={kelas}
                  onChange={setKelas}
                  options={daftarKelas}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  isClearable
                  isSearchable
                />
              ) : (
                <Input
                  type="text"
                  value={joinSilKelas}
                  isReadOnly={!isEditing}
                  onChange={(e) => setKelas(e.target.value)}
                />
              )}
            </FormControl>
            <FormControl id="nis" mt="2">
              <FormLabel>Pelajaran</FormLabel>
              <Input
                type="text"
                value={pelajaran}
                isReadOnly={!isEditing}
                onChange={(e) => setPelajaran(e.target.value)}
              />
            </FormControl>
            <FormControl id="kamar">
              <FormLabel>BAB</FormLabel>
              <Input
                type="text"
                value={bab}
                isReadOnly={!isEditing}
                onChange={(e) => setBab(e.target.value)}
              />
            </FormControl>
            <FormControl id="tglLahir" mt="2">
              <FormLabel>Kompetensi Dasar</FormLabel>
              <Input
                type="text"
                value={KD}
                isReadOnly={!isEditing}
                onChange={(e) => setKD(e.target.value)}
              />
            </FormControl>
            <FormControl id="tahunMasuk" mt="2">
              <FormLabel>Keterangan</FormLabel>
              <Textarea
                type="text"
                value={keterangan}
                isReadOnly={!isEditing}
                onChange={(e) => setKeterangan(e.target.value)}
              />
            </FormControl>

            {isEditing ? (
              <Flex mt="4" alignItems="center">
                <Spacer />

                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  isLoading={isLoading}
                  loadingText="Menyimpan"
                >
                  Simpan
                </Button>
              </Flex>
            ) : undefined}
          </form>
        </CardWrapper>
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

// PRE-RENDER DATA INDIVIDUAL SILABUS
export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const silabusData = await axios.get(`${URL}/silabuses/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const kelasData = await axios.get(`${URL}/classrooms`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const newKelasData = kelasData.data.map((kelas) => {
    return { value: kelas.kelas, label: kelas.kelas, id: kelas.id };
  });

  return {
    props: { silabuses: silabusData.data, daftarKelas: newKelasData },
  };
}

export default SilabusDetail;
