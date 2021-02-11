import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Image from "next/image";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import Select from "react-select";
import HapusGuruAlert from "../../components/daftarGuru/hapusGuruAlert";
import CardWrapper from "../../components/cardWrapper";
import NextLink from "next/link";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function DetailGuru({ guru, daftarKelas }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selKelas = daftarKelas.filter(
    (k) => k.value === (guru.classroom?.kelas || "-")
  );

  const [nama, setNama] = useState(guru.nama);
  const [alamat, setAlamat] = useState(guru.alamat);
  const [kelas, setKelas] = useState(selKelas[0]);

  // UPDATE SISWA MUTATION
  const editGuruMutation = useMutation((newGuru) =>
    axios.put(`${URL}/teachers/${newGuru.id}`, newGuru.data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );
  // DELETE GURU MUTATION
  const deleteGuruMutation = useMutation((guruID) =>
    axios.delete(`${URL}/teachers/${guruID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );
  // DELETE USER MUTATION
  const deleteUserMutation = useMutation((userID) =>
    axios.delete(`${URL}/users/${userID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data siswa
  const deleteHandler = () => {
    // Delete data dari DB
    deleteGuruMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        console.log(data.data);
        const uid = data.data.user.id;
        deleteUserMutation.mutate(uid, {
          onError: (error) => console.log(error),
          onSuccess: (data) => {
            queryClient.invalidateQueries("teachers");
            router.replace("/daftarGuru");
            toast({
              position: "bottom-right",
              title: "Data Guru Dihapus.",
              description: "Data Guru telah berhasil dihapus.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          },
        });
      },
    });
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    editGuruMutation.mutate(
      {
        id: router.query.id,
        data: {
          nama: nama,
          alamat: alamat,
          classroom: kelas.id,
        },
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries("teachers");
          console.log(data);
          setIsLoading(false);
          setIsEditing(false);
          toast({
            position: "bottom-right",
            title: "Data Guru Diubah.",
            description: "Data guru telah berhasil diedit.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  /*
  JSX RETURN
  */
  if (!guru) {
    return (
      <>
        <SkeletonLoading title={"Guru Detail"} />
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Guru Detail | Santri Kita</title>
      </Head>

      <CardWrapper>
        <Flex gridGap="4" my="4" align="center">
          <NextLink href="/daftarGuru">
            <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
              Kembali
            </Button>
          </NextLink>
          <Spacer />
          <Heading fontSize="xl">Guru Detail</Heading>
          <Spacer />
          <ButtonGroup>
            <Button
              variant="solid"
              size="sm"
              colorScheme={isEditing ? undefined : "teal"}
              onClick={() => {
                setIsEditing(!isEditing);
                setKelas(selKelas[0]);
              }}
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

        <Alert status="warning" mb="2" rounded="lg">
          <AlertIcon />
          Perubahan pada data guru tidak akan berpengaruh ke akun guru terkait!
        </Alert>
        {/* KONFIRMASI HAPUS SISWA */}
        <HapusGuruAlert
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
          <FormControl id="alamat" mt="2">
            <FormLabel>Alamat</FormLabel>
            <Textarea
              type="text"
              value={alamat}
              isReadOnly={!isEditing}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </FormControl>

          <FormControl id="kelas" mt="2">
            <FormLabel>Kelas</FormLabel>
            {isEditing ? (
              <Select
                defaultValue={kelas}
                onChange={setKelas}
                options={daftarKelas}
                isClearable
                isSearchable
              />
            ) : (
              <Input
                type="text"
                value={kelas.label}
                isReadOnly
                onChange={(e) => setKelas(e.target.value)}
              />
            )}
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

export default DetailGuru;

//  FETCHER
const fetcher = async ({ queryKey }) => {
  const collection = queryKey[0];
  let endpoint = `${URL}/${collection}`;

  if (queryKey[1]) {
    const filter = queryKey[1];
    endpoint = `${URL}/${collection}${filter}`;
  }

  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    let newKelas = [];
    if (collection === "classrooms") {
      newKelas = data.map((kelas) => {
        return { value: kelas.kelas, label: kelas.kelas, id: kelas.id };
      });
      newKelas.unshift({ value: "-", label: "-", id: undefined });
      return newKelas;
    }

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "Query data failed" };
  }
};

// PRE-RENDER DATA INDIVIDUAL SISWA
export async function getServerSideProps(context) {
  const jwt = parseCookies(context).jwt;
  const guruData = await axios.get(`${URL}/teachers/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const kelasData = await axios.get(`${URL}/classrooms`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  let newKelasData = kelasData.data.map((kelas) => {
    return { value: kelas.kelas, label: kelas.kelas, id: kelas.id };
  });

  newKelasData.unshift({ value: "-", label: "-", id: null });
  return {
    props: { guru: guruData.data, daftarKelas: newKelasData },
  };
}
