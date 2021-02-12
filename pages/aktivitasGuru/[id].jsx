import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import makeAnimated from "react-select/animated";
import HapusRBelajarAlert from "../../components/riwayatPembelajaran/hapusRBelajarAlert";
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
  Textarea,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;
const animatedComponents = makeAnimated();

// KKOMPONEN UTAMA
function RiwayatBelajarDetail({ riwayatBelajar }) {
  const toast = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // DELETE SILABUS MUTATION
  const deleteRiwayatBelajarMutation = useMutation((riwayatBelajarID) =>
    axios.delete(`${URL}/lesson-histories/${riwayatBelajarID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data SILABSUS
  const deleteHandler = () => {
    deleteRiwayatBelajarMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        router.replace("/riwayatPembelajaran");
        toast({
          position: "bottom-right",
          title: "Data Riwayat Belajar Dihapus.",
          description: "Data riwayat pembelajaran telah berhasil dihapus.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {
    // }
  };

  if (!riwayatBelajar) {
    return (
      <>
        <SkeletonLoading title={"Riwayat Belajar Detail"} />
      </>
    );
  }

  if (riwayatBelajar) {
    return (
      <>
        <Head>
          <title>Riwayat Belajar Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/riwayatPembelajaran">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Riwayat Belajar Detail</Heading>
            <Spacer />
            <ButtonGroup>
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
          <HapusRBelajarAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <FormControl id="kelas" mt="2">
              <FormLabel>Kelas</FormLabel>
              <Input
                type="text"
                value={riwayatBelajar.classroom.kelas}
                isReadOnly
              />
            </FormControl>
            <FormControl id="nis" mt="2">
              <FormLabel>Pelajaran</FormLabel>
              <Input type="text" value={riwayatBelajar.pelajaran} isReadOnly />
            </FormControl>
            <FormControl id="pengajar" mt="2">
              <FormLabel>Pengajar</FormLabel>
              <Input type="text" value={riwayatBelajar.pengajar} isReadOnly />
            </FormControl>
            <FormControl id="tanggal" mt="2">
              <FormLabel>Tanggal</FormLabel>
              <Input type="text" value={riwayatBelajar.tanggal} isReadOnly />
            </FormControl>
            <FormControl id="tahunMasuk" mt="2">
              <FormLabel>Keterangan</FormLabel>
              <Textarea
                type="text"
                value={riwayatBelajar.keterangan}
                isReadOnly
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

// PRE-RENDER DATA INDIVIDUAL SILABUS
export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const pembelajaranData = await axios.get(
    `${URL}/lesson-histories/${context.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  return {
    props: { riwayatBelajar: pembelajaranData.data },
  };
}

export default RiwayatBelajarDetail;
