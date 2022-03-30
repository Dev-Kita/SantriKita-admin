import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
import Head from 'next/head';
import Select from 'react-select';
// import SkeletonLoading from "../../components/skeletonLoading";
import { parseCookies } from 'nookies';
import SiswaTable from '../../components/daftarSiswa/siswaTable';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  useToast,
  VStack,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function DaftarSiswa(props) {
  const queryClient = useQueryClient();
  const toast = useToast();
  // usequery Hooks untuk fetch data client-side
  const siswaData = useQuery(
    ['students', '?_sort=tahun_masuk:asc'],
    ({ queryKey }) => fetcher(queryKey, jwt),
    { initialData: props.siswa }
  );
  const kelasData = useQuery(
    ['classrooms', '?_sort=kelas:asc'],
    ({ queryKey }) => fetcher(queryKey, jwt),
    { enabled: !!props.siswa }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [kelasOptions, setKelasOptions] = useState([]);
  const [nama, setNama] = useState('');
  const [nis, setNis] = useState(null);
  const [kelas, setKelas] = useState('');
  const [kamar, setKamar] = useState('');
  const [jKelamin, setJKelamin] = useState('');
  const [tglLahir, setTglLahir] = useState('');
  const [tahunMasuk, setTahunMasuk] = useState(null);
  const [tahunKeluar, setTahunKeluar] = useState(null);
  const jkList = ['Laki-laki', 'Perempuan'];

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (kelasData.data) {
      const kelasOptions = kelasData.data.map(({ kelas, id }) => {
        return { value: kelas, label: kelas, id: id };
      });

      setKelasOptions(kelasOptions);
    }
  }, [kelasData.data]);

  // SISWA MUTATION
  const siswaMutation = useMutation((newSiswa) =>
    axios.post(`${URL}/students`, newSiswa, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  );
  // USER MUTATION
  const userMutation = useMutation((newUser) =>
    axios.post(`${URL}/auth/local/register`, newUser, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  );

  // UPDATE USER MUTATION
  const updateUserMutation = useMutation((newUser) =>
    axios.put(`${URL}/users/${newUser.id}`, newUser.data, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
  );

  // HANDLER SUBMIT TAMBAH SISWA
  const tambahSiswaHadler = () => {
    setIsSubmitting(true);
    userMutation.reset();
    // Tambah User Baru
    userMutation.mutate(
      {
        username: nis,
        email: `siswa${nis}@gmail.com`,
        password: `${nis}${tahunMasuk}`,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          // Query Invalidations
          // queryClient.invalidateQueries("students");
          console.log(data.data);
          const uid = Number(data.data?.user?.id);
          siswaMutation.mutate(
            {
              nama: nama,
              jenis_kelamin: jKelamin,
              nis: nis,
              kelas: { id: kelas.id },
              kamar: kamar,
              tanggal_lahir: tglLahir,
              tahun_masuk: tahunMasuk,
              tahun_keluar: tahunKeluar,
              photo: { id: 1 },
            },
            {
              onError: (error) => console.log(error),
              onSuccess: (data) => {
                console.log(data.data);
                queryClient.invalidateQueries([
                  'students',
                  '?_sort=tahun_masuk:asc',
                ]);
                const sid = data.data?.id;
                updateUserMutation.mutate(
                  {
                    id: uid,
                    data: {
                      role: 4,
                      student: sid,
                    },
                  },
                  {
                    onError: (error) => console.log(error),
                    onSuccess: (data) => {
                      console.log(data.data);
                      // queryClient.invalidateQueries("students");
                      onClose();
                      setIsSubmitting(false);
                      toast({
                        position: 'bottom-right',
                        title: 'Data Siswa Dibuat.',
                        description: 'Data siswa baru telah berhasil dibuat.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                      });
                    },
                  }
                );
              },
            }
          );
        },
      }
    );
    // setSelectedClass(null);
  };

  return (
    <>
      <Head>
        <title>Daftar Siswa | Santri Kita</title>
      </Head>

      <Flex mb="4">
        <Spacer />
        <Button
          leftIcon={<AddIcon />}
          onClick={onOpen}
          variant="solid"
          colorScheme="teal"
        >
          Siswa
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Siswa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <FormControl isRequired>
                <FormLabel>Nama</FormLabel>
                <Input
                  placeholder="Name"
                  onChange={(e) => setNama(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    {jKelamin ? jKelamin : 'Jenis Kelamin'}
                  </MenuButton>
                  <MenuList>
                    {jkList.map((jkItem, i) => (
                      <MenuItem
                        key={i}
                        onClick={(e) => setJKelamin(e.target.innerHTML)}
                      >
                        {jkItem}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>NIS</FormLabel>
                <Input
                  placeholder="NIS"
                  type="number"
                  onChange={(e) => setNis(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Kelas</FormLabel>
                <Select
                  defaultValue={kelas}
                  onChange={setKelas}
                  options={kelasOptions}
                  isClearable
                  isSearchable
                />
              </FormControl>
              <FormControl>
                <FormLabel>Kamar</FormLabel>
                <Input
                  placeholder="Kamar"
                  onChange={(e) => setKamar(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tanggal Lahir</FormLabel>
                <Input
                  type="date"
                  onChange={(e) => setTglLahir(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tahun Masuk</FormLabel>
                <Input
                  type="number"
                  onChange={(e) => setTahunMasuk(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tahun Keluar</FormLabel>
                <Input
                  type="number"
                  onChange={(e) => setTahunKeluar(e.target.value)}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              isLoading={isSubmitting}
              onClick={tambahSiswaHadler}
            >
              Simpan
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SiswaTable data={siswaData.data} />
    </>
  );
}

// Function untuk fetch data dari API students
const fetcher = async (key, token) => {
  const endpoint = `${URL}/${key[0]}${key[1] || ''}`;

  const { data } = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export async function getServerSideProps(context) {
  if (!context.req.cookies.jwt)
    return {
      redirect: { destination: '/login', permanent: false },
    };

  const siswa = await fetcher(
    ['students', '?_sort=tahun_masuk:asc'],
    context.req.cookies.jwt
  );

  return {
    props: {
      siswa,
    },
  };
}

export default DaftarSiswa;
