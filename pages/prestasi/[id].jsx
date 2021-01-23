import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import Head from "next/head";
import HapusPrestasiAlert from "../../components/prestasi/hapusPrestasiAlert";
import CardWrapper from "../../components/cardWrapper";
import SkeletonLoading from "../../components/skeletonLoading";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  useToast,
  Textarea,
  VStack,
  HStack,
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

function DetailPrestasi({ prestasi }) {
  const toast = useToast();
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // DELETE SILABUS MUTATION
  const deletePrestasiMutation = useMutation((prestasiID) =>
    axios.delete(`${URL}/achievements/${prestasiID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data SILABSUS
  const deleteHandler = () => {
    deletePrestasiMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        router.replace("/prestasi");
        toast({
          position: "bottom-right",
          title: "Data Prestasi Dihapus.",
          description: "Data prestasi telah berhasil dihapus.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  // loading state
  if (!prestasi) {
    return (
      <>
        <SkeletonLoading title={"Detail Prestasi"} />
      </>
    );
  }

  if (prestasi) {
    return (
      <>
        <Head>
          <title>Detail Prestasi | Santri Kita</title>
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
            <Heading fontSize="xl">Prestasi Detail</Heading>
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
          <HapusPrestasiAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <VStack>
            <FormControl id="name">
              <FormLabel>Nama</FormLabel>
              <Input
                type="text"
                value={`${prestasi.student.nama}`}
                isReadOnly
              />
            </FormControl>

            <FormControl id="semester">
              <FormLabel>Kegiatan / Lomba</FormLabel>
              <Input type="text" value={prestasi.kegiatan_lomba} isReadOnly />
            </FormControl>

            <HStack w="full" gridGap="4">
              <FormControl id="prestasi">
                <FormLabel>Prestasi</FormLabel>
                <Input type="text" value={prestasi.prestasi} isReadOnly />
              </FormControl>
              <FormControl id="lingkup">
                <FormLabel>Lingkup</FormLabel>
                <Input type="text" value={prestasi.lingkup} isReadOnly />
              </FormControl>
            </HStack>

            <FormControl id="tahun">
              <FormLabel>Tahun</FormLabel>
              <Input type="text" value={prestasi.tahun} isReadOnly />
            </FormControl>

            <FormControl id="tahunMasuk" mt="2">
              <FormLabel>Keterangan</FormLabel>
              <Textarea type="text" value={prestasi.keterangan} isReadOnly />
            </FormControl>
          </VStack>
        </CardWrapper>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const prestasiData = await axios.get(
    `${URL}/achievements/${context.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return {
    props: { prestasi: prestasiData.data },
  };
}

export default DetailPrestasi;
