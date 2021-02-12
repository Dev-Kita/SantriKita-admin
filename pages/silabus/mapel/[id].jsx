import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import SkeletonLoading from "../../../components/skeletonLoading";
import Head from "next/head";
import HapusMapelAlert from "../../../components/silabus/hapusMapelAlert";
import CardWrapper from "../../../components/cardWrapper";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  useToast,
  Switch,
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

// KKOMPONEN UTAMA
function SilabusDetail({ mapelData }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const [mapel, setMapel] = useState(mapelData.nama);
  const [isBukuSetoran, setIsBukuSetoran] = useState(mapelData.isBukuSetoran);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // DELETE SILABUS MUTATION
  const deleteMapelMutation = useMutation((mapelID) =>
    axios.delete(`${URL}/lessons/${mapelID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data SILABSUS
  const deleteHandler = () => {
    setIsLoading(true);
    deleteMapelMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        queryClient.invalidateQueries("lessons");
        setIsLoading(false);
        router.replace("/silabus");
        toast({
          position: "bottom-right",
          title: "Data Mapel Dihapus.",
          description: "Data mapel telah berhasil dihapus.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {};

  if (!mapelData) {
    return (
      <>
        <SkeletonLoading title={"Mapel Detail"} />
      </>
    );
  }

  if (mapelData) {
    return (
      <>
        <Head>
          <title>Mapel Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/silabus">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Mapel Detail</Heading>
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
                isLoading={isLoading}
                onClick={() => setOpenAlert(true)}
              >
                Hapus
              </Button>
            </ButtonGroup>
          </Flex>

          {/* KONFIRMASI HAPUS SISWA */}
          <HapusMapelAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <FormControl id="nis" mt="2">
              <FormLabel>Mapel</FormLabel>
              <Input
                type="text"
                value={mapel}
                isReadOnly={!isEditing}
                onChange={(e) => setMapel(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt="2">
              <FormLabel htmlFor="isBukuSetoran">Buku Setoran</FormLabel>
              <Switch
                id="isBukuSetoran"
                value={isBukuSetoran}
                isReadOnly={!isEditing}
                onChange={(e) => setIsBukuSetoran(!isBukuSetoran)}
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
  const mapelData = await axios.get(`${URL}/lessons/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  return {
    props: { mapelData: mapelData.data },
  };
}

export default SilabusDetail;
