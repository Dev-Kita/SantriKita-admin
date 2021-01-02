import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import HapusSiswaAlert from "../../components/daftar-siswa/hapusSiswaAlert";
import CardWrapper from "../../components/cardWrapper";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  VStack,
  ButtonGroup,
  Flex,
  Spacer,
  Skeleton,
  SkeletonText,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;

// Komponen Utama
function DetailSiswa({ siswa }) {
  // console.log(siswa);
  const router = useRouter();
  const [nama, setNama] = useState(siswa.nama);
  const [nis, setNis] = useState(siswa.nis);
  const [kelas, setKelas] = useState(siswa.classroom);
  const [tglLahir, setTglLahir] = useState(siswa.tanggal_lahir);
  const [tahunMasuk, setTahunMasuk] = useState(siswa.tahun_masuk);
  const [tahunKeluar, setTahunKeluar] = useState(siswa.tahun_keluar);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();
  const siswaInfo = {
    nama: nama,
    nis: nis,
    classroom: kelas,
    tanggal_lahir: tglLahir,
    tahun_masuk: tahunMasuk,
    tahun_keluar: tahunKeluar,
  };

  // Function untuk meng-Handle hapus data siswa
  const deleteHandler = async () => {
    const jwt = parseCookies().jwt;
    // Delete data dari DB
    const { data } = await axios.delete(`${URL}/students/${router.query.id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    router.replace("/daftar-siswa");
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const jwt = parseCookies().jwt;
      const { data } = await axios.put(
        `${URL}/students/${router.query.id}`,
        siswaInfo,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(data);
      setIsLoading(false);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (!siswa) {
    return (
      <>
        <Head>
          <title>Siswa Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <VStack align="stretch" spacing={2}>
            <Skeleton height="20px" mb="4" rounded="md" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" rounded="full" />
          </VStack>
        </CardWrapper>
      </>
    );
  }

  if (siswa) {
    return (
      <>
        <Head>
          <title>Siswa Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/daftar-siswa">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Siswa Detail</Heading>
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

          <HapusSiswaAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <FormControl id="name">
              <FormLabel>Nama</FormLabel>
              <Input
                type="text"
                value={nama}
                isReadOnly={!isEditing}
                onChange={(e) => setNama(e.target.value)}
              />
            </FormControl>
            <FormControl id="nis" mt="2">
              <FormLabel>NIS</FormLabel>
              <Input
                type="number"
                value={nis}
                isReadOnly={!isEditing}
                onChange={(e) => setNis(e.target.value)}
              />
            </FormControl>
            <FormControl id="kelas" mt="2">
              <FormLabel>Kelas</FormLabel>
              <Input
                type="text"
                value={kelas}
                isReadOnly={!isEditing}
                onChange={(e) => setKelas(e.target.value)}
              />
            </FormControl>
            <FormControl id="tglLahir" mt="2">
              <FormLabel>Tanggal Lahir</FormLabel>
              <Input
                type="date"
                value={tglLahir}
                isReadOnly={!isEditing}
                onChange={(e) => setTglLahir(e.target.value)}
              />
            </FormControl>
            <FormControl id="tahunMasuk" mt="2">
              <FormLabel>Tahun Masuk</FormLabel>
              <Input
                type="number"
                value={tahunMasuk}
                isReadOnly={!isEditing}
                onChange={(e) => setTahunMasuk(e.target.value)}
              />
            </FormControl>
            <FormControl id="tahnKeluar" mt="2">
              <FormLabel>Tahun Keluar</FormLabel>
              <Input
                type="number"
                value={tahunKeluar}
                isReadOnly={!isEditing}
                onChange={(e) => setTahunKeluar(e.target.value)}
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

// Pre-render data individual siswa
export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const { data } = await axios.get(`${URL}/students/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return {
    props: { siswa: data },
  };
}

export default DetailSiswa;
