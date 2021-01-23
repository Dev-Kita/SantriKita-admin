import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import { useMutation } from "react-query";
import HapusPelanggaranAlert from "../../components/pelanggaran/hapusPelanggaranAlert";
import SkeletonLoading from "../../components/skeletonLoading";
import CardWrapper from "../../components/cardWrapper";
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

function DetailPelanggaran({ pelanggaran }) {
  const router = useRouter();
  const toast = useToast();
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // DELETE SILABUS MUTATION
  const deletePelanggaranMutation = useMutation((pelanggaranID) =>
    axios.delete(`${URL}/violations/${pelanggaranID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data SILABSUS
  const deleteHandler = () => {
    deletePelanggaranMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        router.replace("/pelanggaran");
        toast({
          position: "bottom-right",
          title: "Data Pelanggaran Dihapus.",
          description: "Data pelanggaran telah berhasil dihapus.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  if (!pelanggaran) {
    return (
      <>
        <SkeletonLoading title={"Detail Pelanggaran"} />
      </>
    );
  }

  if (pelanggaran) {
    return (
      <>
        <Head>
          <title>Pelanggaran Detail | Santri Kita</title>
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
            <Heading fontSize="xl">Pelanggaran Detail</Heading>
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
