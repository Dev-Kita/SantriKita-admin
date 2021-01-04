import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import HapusPelanggaranAlert from "../../components/pelanggaran/hapusPelanggaranAlert";
import CardWrapper from "../../components/cardWrapper";
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
  Textarea,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;

function DetailPelanggaran({ pelanggaran }) {
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // EVENT HANDLER FUNCTION
  // Function untuk meng-Handle hapus data pelanggaran
  const deleteHandler = async () => {
    const jwt = parseCookies().jwt;
    // Delete data dari DB
    const { data } = await axios.delete(
      `${URL}/violations/${router.query.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    router.replace("/pelanggaran");
  };

  if (!pelanggaran) {
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

  if (pelanggaran) {
    return (
      <>
        <Head>
          <title>Siswa Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <Button
              size="sm"
              leftIcon={<ArrowBackIcon />}
              variant="solid"
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            <Spacer />
            <Heading fontSize="xl">Siswa Detail</Heading>
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

          {/* KONFIRMASI HAPUS PELANGGARAN */}
          <HapusPelanggaranAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form>
            <FormControl id="name">
              <FormLabel>Nama</FormLabel>
              <Input type="text" value={pelanggaran.student.nama} isReadOnly />
            </FormControl>

            <FormControl id="pelanggaran">
              <FormLabel>Pelanggaran</FormLabel>
              <Input type="text" value={pelanggaran.pelanggaran} isReadOnly />
            </FormControl>

            <FormControl id="tanggal">
              <FormLabel>Tanggal</FormLabel>

              <Input type="text" value={pelanggaran.tanggal} isReadOnly />
            </FormControl>

            <FormControl id="staus">
              <FormLabel>Status</FormLabel>
              <Input type="text" value={pelanggaran.status} isReadOnly />
            </FormControl>

            <FormControl id="keterangan">
              <FormLabel>Keterangan</FormLabel>
              <Textarea type="text" value={pelanggaran.keterangan} isReadOnly />
            </FormControl>
          </form>
        </CardWrapper>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const { data } = await axios.get(`${URL}/violations/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return {
    props: { pelanggaran: data },
  };
}

export default DetailPelanggaran;
