import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import HapusBiayaAlert from "../../components/biaya/hapusBiayaAlert";
import CardWrapper from "../../components/cardWrapper";
import SkeletonLoading from "../../components/skeletonLoading";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  VStack,
  HStack,
  ButtonGroup,
  Flex,
  Spacer,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;

function DetailBiaya({ biaya }) {
  console.log(biaya);
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // EVENT HANDLER FUNCTION
  // Function untuk meng-Handle hapus data pelanggaran
  const deleteHandler = async () => {
    const jwt = parseCookies().jwt;
    // Delete data dari DB
    const { data } = await axios.delete(`${URL}/bills/${router.query.id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    router.replace("/biaya");
  };

  // loading state
  if (!biaya) {
    return (
      <>
        <SkeletonLoading title={"Detail Biaya"} />
      </>
    );
  }

  if (biaya) {
    return (
      <>
        <Head>
          <title>Detail Biaya | Santri Kita</title>
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
          <HapusBiayaAlert
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
                value={`${biaya.student.nama} (${biaya.student.kelas.kelas})`}
                isReadOnly
              />
            </FormControl>

            <HStack w="full" gridGap="4">
              <FormControl id="semester">
                <FormLabel>Semester</FormLabel>
                <Input type="text" value={biaya.semester} isReadOnly />
              </FormControl>
              <FormControl id="tahun">
                <FormLabel>Tahun</FormLabel>
                <Input type="text" value={biaya.tahun} isReadOnly />
              </FormControl>
            </HStack>

            <FormControl id="keperluan">
              <FormLabel>Keperluan</FormLabel>
              <Input type="text" value={biaya.keperluan} isReadOnly />
            </FormControl>

            <FormControl id="tanggal">
              <FormLabel>Tanggal</FormLabel>

              <Input type="text" value={biaya.tanggal_pembayaran} isReadOnly />
            </FormControl>
            <FormControl id="nominal">
              <FormLabel>Nominal</FormLabel>
              <InputGroup>
                <InputLeftAddon children="Rp" />
                <Input type="text" value={biaya.nominal} isReadOnly />
              </InputGroup>
            </FormControl>

            <FormControl id="nominalDibayarkan">
              <FormLabel>Nominal Dibayarkan</FormLabel>
              <InputGroup>
                <InputLeftAddon children="Rp" />
                <Input type="text" value={biaya.nominal_dibayar} isReadOnly />
              </InputGroup>
            </FormControl>

            <FormControl id="status">
              <FormLabel>Status</FormLabel>
              <Input type="text" value={biaya.status} isReadOnly />
            </FormControl>
          </VStack>
        </CardWrapper>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const biayaData = await axios.get(`${URL}/bills/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  return {
    props: { biaya: biayaData.data },
  };
}

export default DetailBiaya;
