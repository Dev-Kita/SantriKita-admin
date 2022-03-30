import React, { useState, useEffect } from 'react';
import axios from 'axios';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import {
  useToast,
  Flex,
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
  Textarea,
  Input,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useMutation, useQueryClient } from 'react-query';
import SilabusTable from './silabusTable';

const animatedComponents = makeAnimated();

function Silabus({ data, kelasData }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [kelasOptions, setKelasOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [pelajaran, setPelajaran] = useState('null');
  const [KD, setKD] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [bab, setBab] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (kelasData) {
      const kelasOptions = kelasData.map(({ kelas, id }) => {
        return { value: kelas, label: kelas, id: id };
      });

      setKelasOptions(kelasOptions);
    }
  }, [kelasData]);

  const silabusMutation = useMutation((newsilabus) =>
    axios.post(`${URL}/silabuses`, newsilabus, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  const tambahSilabusHandler = () => {
    setIsSubmitting(true);
    let submitClass = selectedClass.map((abc) => {
      return { id: abc.id };
    });

    silabusMutation.mutate(
      {
        pelajaran: pelajaran,
        kompetensi_dasar: KD,
        bab: bab,
        keterangan: keterangan,
        classrooms: submitClass,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          setSelectedClass(null);
          queryClient.invalidateQueries(['silabuses']);
          onClose();
          setIsSubmitting(false);
          toast({
            position: 'bottom-right',
            title: 'Data Silabus Dibuat.',
            description: 'Data silabus baru telah berhasil dibuat.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <>
      <Flex mb="4">
        <Spacer />
        <Button
          leftIcon={<AddIcon />}
          onClick={onOpen}
          variant="solid"
          colorScheme="teal"
        >
          Silabus
        </Button>
      </Flex>

      {/* MODAL FORM TAMBAH PELANGGARAN */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Silabus</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              {/* Siswa */}
              <FormControl isRequired>
                <FormLabel>Kelas</FormLabel>
                <Select
                  defaultValue={selectedClass}
                  onChange={setSelectedClass}
                  options={kelasOptions}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  isClearable
                  isSearchable
                />
              </FormControl>
              {/* Pelajaran */}
              <FormControl isRequired>
                <FormLabel>Pelajaran</FormLabel>
                <Input
                  placeholder="Pelajaran"
                  onChange={(e) => setPelajaran(e.target.value)}
                />
              </FormControl>
              {/* BAB */}
              <FormControl isRequired>
                <FormLabel>BAB</FormLabel>
                <Input
                  placeholder="BAB"
                  onChange={(e) => setBab(e.target.value)}
                />
              </FormControl>
              {/* Pengajar */}
              <FormControl isRequired>
                <FormLabel>Kompetensi Dasar</FormLabel>
                <Input
                  placeholder="Kompetensi Dasar"
                  onChange={(e) => setKD(e.target.value)}
                />
              </FormControl>
              {/* Keterangan */}
              <FormControl>
                <FormLabel>Keterangan</FormLabel>
                <Textarea
                  placeholder="Keterangan"
                  onChange={(e) => setKeterangan(e.target.value)}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              isLoading={isSubmitting}
              onClick={tambahSilabusHandler}
            >
              Simpan
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SilabusTable data={data} />
    </>
  );
}

export default Silabus;
