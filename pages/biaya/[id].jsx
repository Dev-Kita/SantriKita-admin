import React, { useState, useRef } from "react";
import axios from "axios";
import Moment from "react-moment";
import { useQuery, useQueryClient } from "react-query";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import CardWrapper from "../../components/cardWrapper";
import HapusBiayaAlert from "../../components/biaya/hapusBiayaAlert";
import SkeletonLoading from "../../components/skeletonLoading";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  VStack,
  HStack,
  ButtonGroup,
  Flex,
  Spacer,
  InputLeftAddon,
  InputGroup,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { client } from "../../utils/gql";
import { DETAIL_BIAYA, DELETE_BIAYA } from "../../utils/biayaQuery";

const useDetailBiayaQuery = () => {
  return useQuery("bill", async () => {
    const variables = { studentID: Router.router.query.id };
    const data = await client.request(DETAIL_BIAYA, variables);
    return data;
  });
};

function DetailPembayaran() {
  const biayaDetail = useDetailBiayaQuery();
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // EVENT HANDLER FUNCTION
  // Function untuk meng-Handle hapus data pelanggaran
  const deleteHandler = async () => {
    const variables = { studentID: Router.router.query.id };
    const res = await client.request(DELETE_BIAYA, variables);
    Router.router.replace("/biaya");
  };

  // error handling
  if (biayaDetail.isError) console.log("error");
  // loading state
  if (biayaDetail.isLoading) {
    return (
      <>
        <SkeletonLoading title={"Detail Biaya"} />
      </>
    );
  }

  if (biayaDetail.isSuccess) {
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
              onClick={() => Router.router.back()}
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
                value={`${biayaDetail.data.bill.student.nama} (${biayaDetail.data.bill.student.kelas.kelas})`}
                isReadOnly
              />
            </FormControl>

            <HStack w="full" gridGap="4">
              <FormControl id="semester">
                <FormLabel>Semester</FormLabel>
                <Input
                  type="text"
                  value={biayaDetail.data.bill.semester}
                  isReadOnly
                />
              </FormControl>
              <FormControl id="tahun">
                <FormLabel>Tahun</FormLabel>
                <Input
                  type="text"
                  value={biayaDetail.data.bill.tahun}
                  isReadOnly
                />
              </FormControl>
            </HStack>

            <FormControl id="keperluan">
              <FormLabel>Keperluan</FormLabel>
              <Input
                type="text"
                value={biayaDetail.data.bill.Keperluan}
                isReadOnly
              />
            </FormControl>

            <FormControl id="tanggal">
              <FormLabel>Tanggal</FormLabel>

              <Input
                type="text"
                value={biayaDetail.data.bill.tanggal_pembayaran}
                isReadOnly
              />
            </FormControl>
            <FormControl id="nominal">
              <FormLabel>Nominal</FormLabel>
              <InputGroup>
                <InputLeftAddon children="Rp" />
                <Input
                  type="text"
                  value={biayaDetail.data.bill.nominal}
                  isReadOnly
                />
              </InputGroup>
            </FormControl>

            <FormControl id="nominalDibayarkan">
              <FormLabel>Nominal Dibayarkan</FormLabel>
              <InputGroup>
                <InputLeftAddon children="Rp" />
                <Input
                  type="text"
                  value={biayaDetail.data.bill.nominal_dibayar}
                  isReadOnly
                />
              </InputGroup>
            </FormControl>

            <FormControl id="status">
              <FormLabel>Status</FormLabel>
              <Input
                type="text"
                value={biayaDetail.data.bill.status}
                isReadOnly
              />
            </FormControl>
          </VStack>
        </CardWrapper>
      </>
    );
  }
}

// export async function getServerSideProps(context) {
//   const jwt = parseCookies(context).jwt;
//   const { data } = await axios.get(`${URL}/violations/${context.params.id}`, {
//     headers: {
//       Authorization: `Bearer ${jwt}`,
//     },
//   });
//   return {
//     props: { pelanggaran: data },
//   };
// }

export default DetailPembayaran;
