import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import makeAnimated from "react-select/animated";
import HapusRKesehatanAlert from "../../components/riwayatKesehatan/hapusRKesehatanAlert";
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
function RiwayatKesehatanDetail({ riwayatKesehatan }) {
  const toast = useToast();
  const router = useRouter();

  const [penyakit, setPenyakit] = useState(riwayatKesehatan.penyakit);
  const [siswa, setSiswa] = useState(riwayatKesehatan.student.nama);
  const [status, setStatus] = useState(riwayatKesehatan.status);
  const [jenis, setJenis] = useState(riwayatKesehatan.jenis);
  const [tanggal, setTanggal] = useState(riwayatKesehatan.tanggal);
  const [keterangan, setKeterangan] = useState(riwayatKesehatan.keterangan);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // DELETE SILABUS MUTATION
  const deleteRiwayatKesehatanMutation = useMutation((riwayatKesehatanID) =>
    axios.delete(`${URL}/medical-histories/${riwayatKesehatanID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data SILABSUS
  const deleteHandler = () => {
    deleteRiwayatKesehatanMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        router.replace("/riwayatKesehatan");
        toast({
          position: "bottom-right",
          title: "Data Riwayat Kesehatan Dihapus.",
          description: "Data riwayat kesehatan telah berhasil dihapus.",
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

  if (!riwayatKesehatan) {
    return (
      <>
        <SkeletonLoading title={"Riwayat Kesehatan Detail"} />
      </>
    );
  }

  if (riwayatKesehatan) {
    return (
      <>
        <Head>
          <title>Riwayat Kesehatan Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/riwayatKesehatan">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Riwayat Kesehatan Detail</Heading>
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
          <HapusRKesehatanAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <FormControl id="kelas" mt="2">
              <FormLabel>Nama</FormLabel>
              <Input
                type="text"
                value={siswa}
                isReadOnly={!isEditing}
                onChange={(e) => setSiswa(e.target.value)}
              />
            </FormControl>
            <FormControl id="nis" mt="2">
              <FormLabel>Pneyakit</FormLabel>
              <Input
                type="text"
                value={penyakit}
                isReadOnly={!isEditing}
                onChange={(e) => setPenyakit(e.target.value)}
              />
            </FormControl>
            <FormControl id="tanggal" mt="2">
              <FormLabel>Tanggal</FormLabel>
              <Input
                type="text"
                value={tanggal}
                isReadOnly={!isEditing}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </FormControl>
            <FormControl id="pengajar" mt="2">
              <FormLabel>Jenis</FormLabel>
              <Input
                type="text"
                value={jenis}
                isReadOnly={!isEditing}
                onChange={(e) => setJenis(e.target.value)}
              />
            </FormControl>
            <FormControl id="pengajar" mt="2">
              <FormLabel>Status</FormLabel>
              <Input
                type="text"
                value={status ? "Sembuh" : "Belum Sembuh"}
                isReadOnly={!isEditing}
                onChange={(e) => setStatus(e.target.value)}
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

// PRE-RENDER DATA INDIVIDUAL SILABUS
export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const kesehatanData = await axios.get(
    `${URL}/medical-histories/${context.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  return {
    props: { riwayatKesehatan: kesehatanData.data },
  };
}

export default RiwayatKesehatanDetail;
