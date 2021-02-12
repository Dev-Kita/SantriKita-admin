import React, { useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import MapelTable from "./mapelTable";
import SkeletonLoading from "../skeletonLoading";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function Mapel() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const mapelData = useQuery("lessons", fetcher);

  const [mapel, setMapel] = useState("");
  const [isBukuSetoran, setIsBukuSetoran] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(mapelData);

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
          queryClient.invalidateQueries("lessons");
          onClose();
          setIsSubmitting(false);
          toast({
            position: "bottom-right",
            title: "Data Mapel Dibuat.",
            description: "Data mapel baru telah berhasil ditambahkan.",
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
  if (mapelData.isLoading) {
    console.log(mapelData.status);
    // return (
    //   <>
    //     <SkeletonLoading plusButton={"Mapel"} />
    //   </>
    // );
  }

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

      {mapelData.isSuccess ? (
        <>
          <MapelTable data={mapelData.data} />
        </>
      ) : undefined}
    </Box>
  );
}

export default Mapel;

// Function untuk fetch data dari API classrooms
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

    let newClassrooms = [];
    if (collection === "classrooms") {
      newClassrooms = data.map((classroom) => {
        return {
          value: classroom.kelas,
          label: `${classroom.kelas}`,
          id: classroom.id,
        };
      });
      return newClassrooms;
    }

    return data;
  } catch (error) {
    console.error(error);
    return { msg: "Query data failed" };
  }
};
