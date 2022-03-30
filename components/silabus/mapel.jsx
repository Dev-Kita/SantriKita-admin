import React, { useState } from 'react';
import axios from 'axios';
import {
  useToast,
  useDisclosure,
  Flex,
  Spacer,
  Button,
  Box,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import MapelTable from './mapelTable';

function Mapel({ data }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [mapel, setMapel] = useState('');
  const [isBukuSetoran, setIsBukuSetoran] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapelMutation = useMutation((newLesson) =>
    axios.post(`${URL}/lessons`, newLesson, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
  );

  const tambahMapelHandler = () => {
    setIsSubmitting(true);
    mapelMutation.mutate(
      {
        nama: mapel,
        isBukuSetoran: isBukuSetoran,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (data) => {
          console.log(data.data);
          queryClient.invalidateQueries(['lessons']);
          onClose();
          setIsSubmitting(false);
          toast({
            position: 'bottom-right',
            title: 'Data Mapel Dibuat.',
            description: 'Data mapel baru telah berhasil ditambahkan.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <Box mt="6">
      <Flex mb="4">
        <Spacer />
        <Button
          leftIcon={<AddIcon />}
          onClick={onOpen}
          variant="solid"
          colorScheme="teal"
        >
          Mapel
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Mapel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              {/* Pelajaran */}
              <FormControl isRequired>
                <FormLabel>Mapel</FormLabel>
                <Input
                  placeholder="Mapel"
                  onChange={(e) => setMapel(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired mt="2">
                <FormLabel htmlFor="isBukuSetoran">Buku Setoran</FormLabel>
                <Switch
                  id="isBukuSetoran"
                  value={isBukuSetoran}
                  onChange={(e) => setIsBukuSetoran(!isBukuSetoran)}
                />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={tambahMapelHandler}
              isLoading={isSubmitting}
            >
              Simpan
            </Button>
            <Button onClick={onClose}>Batal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <MapelTable data={data} />
    </Box>
  );
}

export default Mapel;
