import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import SkeletonLoading from '../../components/skeletonLoading';
import SilabusTable from '../../components/silabus/silabusTable';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { animateVisualElement } from 'framer-motion';
import Mapel from '../../components/silabus/mapel';
import Silabus from '../../components/silabus/silabus';

const URL = process.env.NEXT_PUBLIC_API_URL;
const jwt = parseCookies().jwt;

function SilabusPage(props) {
  const silabusData = useQuery(
    ['silabuses'],
    ({ queryKey }) => fetcher(queryKey, jwt),
    { initialData: props.silabus }
  );
  const mapelData = useQuery(
    ['lessons'],
    ({ queryKey }) => fetcher(queryKey, jwt),
    { initialData: props.mapel }
  );
  const kelasData = useQuery(
    ['classrooms', '?_sort=kelas:asc'],
    ({ queryKey }) => fetcher(queryKey, jwt),
    { enabled: !!props.silabus }
  );

  return (
    <>
      <Head>
        <title>Silabus | Santri Kita</title>
      </Head>

      <Silabus data={silabusData.data} kelasData={kelasData.data} />
      <Mapel data={mapelData.data} />
    </>
  );
}

// Function untuk fetch data dari API classrooms
const fetcher = async (key, token) => {
  const endpoint = `${URL}/${key[0]}${key[1] || ''}`;
  const { data } = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
  // let newClassrooms = [];
  // if (collection === "classrooms") {
  //   newClassrooms = data.map((classroom) => {
  //     return {
  //       value: classroom.kelas,
  //       label: `${classroom.kelas}`,
  //       id: classroom.id,
  //     };
  //   });
  //   return newClassrooms;
  // }
};
// const mapelData = useQuery("lessons", fetcher);

export async function getServerSideProps(context) {
  const silabus = await fetcher(['silabuses'], context.req.cookies.jwt);
  const mapel = await fetcher(['lessons'], context.req.cookies.jwt);

  return {
    props: {
      silabus,
      mapel,
    },
  };
}

export default SilabusPage;
