import React, { useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import SkeletonLoading from "../../components/skeletonLoading";
import Head from "next/head";
import makeAnimated from "react-select/animated";
import HapusStudentActivityAlert from "../../components/aktivitasSiswa/hapusStudentActivityAlert";
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
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;
const animatedComponents = makeAnimated();

// KKOMPONEN UTAMA
function StudentAktivityDetail({ studentActivities }) {
  const toast = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const onClose = () => setOpenAlert(false);
  const cancelRef = useRef();

  // DELETE SILABUS MUTATION
  const deleteStudentAktivityMutation = useMutation((riwayatBelajarID) =>
    axios.delete(`${URL}/student-aktivities/${riwayatBelajarID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  // Function untuk meng-Handle hapus data SILABSUS
  const deleteHandler = () => {
    setIsLoading(true);
    deleteStudentAktivityMutation.mutate(router.query.id, {
      onError: (erorr) => console.log(error),
      onSuccess: (data) => {
        console.log(data.data);
        setIsLoading(false);
        router.replace("/aktivitasSiswa");
        toast({
          position: "bottom-right",
          title: "Data Aktivitas Siswa Dihapus.",
          description: "Data aktivitas siswa telah berhasil dihapus.",
          status: "success",
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

  if (!studentActivities) {
    return (
      <>
        <SkeletonLoading title={"Aktivitas Siswa Detail"} />
      </>
    );
  }

  if (studentActivities) {
    return (
      <>
        <Head>
          <title>Aktivitas Siswa Detail | Santri Kita</title>
        </Head>

        <CardWrapper>
          <Flex gridGap="4" my="4" align="center">
            <NextLink href="/aktivitasSiswa">
              <Button size="sm" leftIcon={<ArrowBackIcon />} variant="solid">
                Kembali
              </Button>
            </NextLink>
            <Spacer />
            <Heading fontSize="xl">Aktivitas Siswa Detail</Heading>
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

          {/* KONFIRMASI HAPUS SISWA */}
          <HapusStudentActivityAlert
            deleteHandler={deleteHandler}
            openAlert={openAlert}
            cancelRef={cancelRef}
            onClose={onClose}
            isLoading={isLoading}
          />

          <form onSubmit={editHandler}>
            <FormControl id="kelas" mt="4">
              <FormLabel>Mapel</FormLabel>
              <Input
                type="text"
                value={studentActivities.lesson.nama}
                isReadOnly
              />
            </FormControl>
            <FormControl id="nis" mt="4">
              <FormLabel>Pelajaran</FormLabel>
              <Input type="text" value={studentActivities.title} isReadOnly />
            </FormControl>
            <FormControl id="pengajar" mt="4">
              <FormLabel>Pengajar</FormLabel>
              <Input
                type="text"
                value={studentActivities.teacher.nama}
                isReadOnly
              />
            </FormControl>
            <FormControl id="kategori" mt="4">
              <FormLabel>Siswa</FormLabel>
              <UnorderedList>
                {studentActivities.students.map((student) => (
                  <ListItem ml="4" key={student.id}>
                    {student.nama}
                  </ListItem>
                ))}
              </UnorderedList>
            </FormControl>
            <FormControl id="kategori" mt="4">
              <FormLabel>Kategori</FormLabel>
              <Input
                textTransform="capitalize"
                type="text"
                value={studentActivities.kategori}
                isReadOnly
              />
            </FormControl>
            <FormControl id="tanggal" mt="4">
              <FormLabel>Tanggal</FormLabel>
              <Input
                type="text"
                value={moment(studentActivities.tanggal)
                  .format("dddd, DD MMMM YYYY")
                  .toString()}
                isReadOnly
              />
            </FormControl>
            <FormControl id="tahunMasuk" mt="4">
              <FormLabel>Keterangan</FormLabel>
              <Textarea
                type="text"
                value={studentActivities.keterangan}
                isReadOnly
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
  const pembelajaranData = await axios.get(
    `${URL}/student-aktivities/${context.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  return {
    props: { studentActivities: pembelajaranData.data },
  };
}

export default StudentAktivityDetail;
