import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import HapusKelasAlert from "../../components/kelas/hapusKelasAlert";
import KelasSiswaTable from "../../components/kelas/kelasSiswaTable";
import KelasSilabusTable from "../../components/kelas/kelasSilabusTable";
import CardWrapper from "../../components/cardWrapper";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  useToast,
  ButtonGroup,
  Flex,
  Spacer,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

// KKOMPONEN UTAMA
function KelasDetail({ kelasData }) {
  const router = useRouter();
  const toast = useToast();
  console.log(kelasData);

  const [kelas, setKelas] = useState(kelasData.kelas);
  const [pembimbing, setPembimbing] = useState(kelasData.pembimbing);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();
  const jkList = ["Laki-laki", "Perempuan"];

  // UPDATE KELAS MUTATION
  const editKelasMutation = useMutation((newKelas) =>
    axios.put(`${URL}/classrooms/${newKelas.id}`, newKelas.data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );
  // DELETE KELAS MUTATION
  const deleteKelasMutation = useMutation((kelasID) =>
    axios.delete(`${URL}/classrooms/${kelasID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data siswa
  const deleteHandler = () => {
    // Delete data dari DB
    deleteKelasMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        router.replace("/kelas");
        toast({
          position: "bottom-right",
          title: "Data Kelas Dihapus.",
          description: "Data kelas telah berhasil dihapus.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    editKelasMutation.mutate(
      {
        id: router.query.id,
        data: {
          kelas: kelas,
          pembimbing: pembimbing,
        },
      },
      {
        onSuccess: (data) => {
          setIsLoading(false);
          setIsEditing(false);
          toast({
            position: "bottom-right",
            title: "Data Kelas Diubah.",
            description: "Data kelas telah berhasil diedit.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  if (!kelasData) {
    return (
      <>
        <SkeletonLoading title={"Siswa Detail"} />
      </>
    );
  }

  if (kelasData) {
    return (
      <>
        <Head>
          <title>Kelas Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/kelas">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Kelas Detail</Heading>
            <Spacer />
            <ButtonGroup>
              <Button
                variant="solid"
                size="sm"
                colorScheme={isEditing ? undefined : "teal"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Batal" : "Edit"}
              </Button>
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
          <HapusKelasAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <FormControl id="name">
              <FormLabel>Kelas</FormLabel>
              <Input
                type="text"
                value={kelas}
                isReadOnly={!isEditing}
                onChange={(e) => setKelas(e.target.value)}
              />
            </FormControl>
            <FormControl id="pembimbing">
              <FormLabel>Pembimbing</FormLabel>
              <Input
                type="text"
                value={pembimbing}
                isReadOnly={!isEditing}
                onChange={(e) => setPembimbing(e.target.value)}
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

        {/*  SISWA KELAS TABLE */}
        <KelasSiswaTable data={kelasData.students} kelas={kelasData.kelas} />
        {/*  SILABUS KELAS TABLE */}
        <KelasSilabusTable data={kelasData.silabuses} kelas={kelasData.kelas} />
      </>
    );
  }
}

// PRE-RENDER DATA INDIVIDUAL SISWA
export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const kelasData = await axios.get(`${URL}/classrooms/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  return {
    props: { kelasData: kelasData.data },
  };
}

export default KelasDetail;
