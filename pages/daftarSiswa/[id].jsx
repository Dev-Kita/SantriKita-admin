import React, { useState, useRef } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import Image from "next/image";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import Select from "react-select";
import HapusSiswaAlert from "../../components/daftarSiswa/hapusSiswaAlert";
import CardWrapper from "../../components/cardWrapper";
import NextLink from "next/link";
import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  useToast,
  Wrap,
  WrapItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ButtonGroup,
  Flex,
  Spacer,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

// KKOMPONEN UTAMA
function DetailSiswa({ siswa, daftarKelas }) {
  const router = useRouter();
  const toast = useToast();
  const selKelas = daftarKelas.filter((k) => k.value === siswa.kelas.kelas);
  // console.log(daftarKelas);
  // console.log(siswa);
  const [photo, setPhoto] = useState(
    siswa.photo.formats.small.url || undefined
  );
  const [nama, setNama] = useState(siswa.nama);
  const [nis, setNis] = useState(siswa.nis);
  const [JK, setJK] = useState(siswa.jenis_kelamin);
  const [kelas, setKelas] = useState(selKelas[0]);
  const [tglLahir, setTglLahir] = useState(siswa.tanggal_lahir);
  const [tahunMasuk, setTahunMasuk] = useState(siswa.tahun_masuk);
  const [tahunKeluar, setTahunKeluar] = useState(siswa.tahun_keluar);
  const [kamar, setKamar] = useState(siswa.kamar);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();
  const jkList = ["Laki-laki", "Perempuan"];
  const siswaInfo = {
    nama: nama,
    nis: nis,
    kelas: { id: kelas.id },
    kamar: kamar,
    tanggal_lahir: tglLahir,
    tahun_masuk: tahunMasuk,
    tahun_keluar: tahunKeluar,
  };

  // UPDATE SISWA MUTATION
  const editSiswaMutation = useMutation((newSiswa) =>
    axios.put(`${URL}/students/${newSiswa.id}`, newSiswa.data, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );
  // DELETE SISWA MUTATION
  const deleteSiswaMutation = useMutation((siswaID) =>
    axios.delete(`${URL}/students/${siswaID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data siswa
  const deleteHandler = () => {
    // Delete data dari DB
    deleteSiswaMutation.mutate(router.query.id, {
      onSuccess: (data) => {
        router.replace("/daftarSiswa");
        toast({
          position: "bottom-right",
          title: "Data Siswa Dihapus.",
          description: "Data siswa telah berhasil dihapus.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  // Function untuk menghandle edit data siswa
  const editHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    editSiswaMutation.mutate(
      {
        id: router.query.id,
        data: {
          nama: nama,
          nis: nis,
          jenis_kelamin: JK,
          kelas: { id: kelas.id },
          kamar: kamar,
          tanggal_lahir: tglLahir,
          tahun_masuk: tahunMasuk,
          tahun_keluar: tahunKeluar,
        },
      },
      {
        onSuccess: (data) => {
          setIsLoading(false);
          setIsEditing(false);
          toast({
            position: "bottom-right",
            title: "Data Siswa Diubah.",
            description: "Data siswa telah berhasil diedit.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  if (!siswa) {
    return (
      <>
        <SkeletonLoading title={"Siswa Detail"} />
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
            <NextLink href="/daftarSiswa">
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
            Perubahan pada data guru tidak akan berpengaruh ke akun guru
            terkait!
          </Alert>

          {/* KONFIRMASI HAPUS SISWA */}
          <HapusSiswaAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
          />

          <form onSubmit={editHandler}>
            <Flex alignItems="center">
              <FormLabel mr="4">Photo : </FormLabel>
              <Wrap>
                <WrapItem
                  boxShadow="base"
                  overflow="hidden"
                  rounded="100px"
                  border="2px"
                  borderColor="gray.500"
                  bg="white"
                  lineHeight="0"
                >
                  <Image
                    src={photo}
                    alt="Profile Photo"
                    width={150}
                    height={150}
                    layout="intrinsic"
                  />
                </WrapItem>
              </Wrap>

              <Spacer />
              {isEditing ? (
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={(e) => console.log(e.target.files[0])}
                />
              ) : (
                <Spacer />
              )}
              <Spacer />
            </Flex>
            <FormControl id="name">
              <FormLabel>Nama</FormLabel>
              <Input
                type="text"
                value={nama}
                isReadOnly={!isEditing}
                onChange={(e) => setNama(e.target.value)}
              />
            </FormControl>
            <FormControl mt="2">
              <FormLabel>Jenis Kelamin</FormLabel>
              {isEditing ? (
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    {JK ? JK : "Jenis Kelamin"}
                  </MenuButton>
                  <MenuList>
                    {jkList.map((jkItem, i) => (
                      <MenuItem
                        key={i}
                        onClick={(e) => setJK(e.target.innerHTML)}
                      >
                        {jkItem}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ) : (
                <Input
                  type="text"
                  value={JK}
                  isReadOnly
                  onChange={(e) => setJK(e.target.value)}
                />
              )}
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
            <FormControl id="kamar">
              <FormLabel>Kamar</FormLabel>
              <Input
                type="text"
                value={kamar}
                isReadOnly={!isEditing}
                onChange={(e) => setKamar(e.target.value)}
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

          <style jsx>
            {`
              .image {
                border: 1px solid red;
                border-radius: 25px;
              }
            `}
          </style>
        </CardWrapper>
      </>
    );
  }
}

// Function untuk fetch data dari API students
const fetcher = async ({ queryKey }) => {
  try {
    const collection = queryKey[0];
    let endpoint = `${URL}/${collection}`;

    if (queryKey[1]) {
      const params = queryKey[1];
      endpoint = `${URL}/${collection}${params}`;
    }

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
  const siswaData = await axios.get(`${URL}/students/${context.params.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const kelasData = await axios.get(`${URL}/classrooms`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const newKelasData = kelasData.data.map((kelas) => {
    return { value: kelas.kelas, label: kelas.kelas, id: kelas.id };
  });

  return {
    props: { siswa: siswaData.data, daftarKelas: newKelasData },
  };
}

export default DetailSiswa;
