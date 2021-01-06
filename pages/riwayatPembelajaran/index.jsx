// import React, { useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import axios from "axios";
// import Head from "next/head";
// import SkeletonLoading from "../../components/skeletonLoading";
// import { parseCookies } from "nookies";
// import Select from "react-select";
// // import SiswaTable from "../../components/daftarSiswa/siswaTable";
// import { AddIcon } from "@chakra-ui/icons";
// import {
//   VStack,
//   Flex,
//   Spacer,
//   Button,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   FormControl,
//   FormLabel,
//   Input,
//   Textarea,
// } from "@chakra-ui/react";

// const URL = process.env.NEXT_PUBLIC_API_URL;
// const jwt = parseCookies().jwt;

// function DaftarRiwayatPembelajaran() {
//   // useSWR Hooks untuk fetch data client-side
//   const riwayatData = useQuery(["lesson-histories"], siswaFetcher, {
//     refetchInterval: 3000,
//   });
//   const siswaData = useQuery("students", siswaFetcher);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [pelajaran, setPelajaran] = useState("");
//   const [pengajar, setPengajar] = useState("");
//   const [tanggal, setTanggal] = useState("");
//   const [keterangan, setKeterangan] = useState("");
//   const [classroom, setClassroom] = useState();

//   const tambahSiswaHadler = async () => {
//     const newRiwayatData = {
//       pelajaran: pelajaran,
//       pengajar: pengajar,
//       tanggal: tanggal,
//       keterangan: keterangan,
//       students: [{ classroom: classroom.value }],
//     };
//     console.log(newRiwayatData);
//     const { data } = await axios.post(
//       `${URL}/lesson-histories`,
//       newRiwayatData,
//       {
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       }
//     );
//     onClose();
//     console.log(data);
//   };

//   // error handling
//   if (riwayatData.isError) console.log(error);
//   // loading state
//   if (riwayatData.isLoading) {
//     return (
//       <>
//         <SkeletonLoading
//           title={"Riwayat Pembelajaran"}
//           plusButton={"Riwayat"}
//         />
//       </>
//     );
//   }

//   if (riwayatData.isSuccess) {
//     return (
//       <>
//         <Head>
//           <title>Riwayat Pembelajaran | Santri Kita</title>
//         </Head>

//         <Flex mb="4">
//           <Spacer />
//           <Button
//             leftIcon={<AddIcon />}
//             onClick={onOpen}
//             variant="solid"
//             colorScheme="teal"
//           >
//             Riwayat
//           </Button>
//         </Flex>

//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Tambah Riwayat Pembelajaran</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <form>
//                 <FormControl isRequired>
//                   <FormLabel>Kelas</FormLabel>
//                   <Select
//                     defaultValue={classroom}
//                     onChange={setClassroom}
//                     options={siswaData.data}
//                     isClearable
//                     isSearchable
//                   />
//                 </FormControl>
//                 <FormControl isRequired>
//                   <FormLabel>Pelajaran</FormLabel>
//                   <Input
//                     placeholder="pelajaran"
//                     onChange={(e) => setPelajaran(e.target.value)}
//                   />
//                 </FormControl>
//                 <FormControl isRequired>
//                   <FormLabel>Pengajar</FormLabel>
//                   <Input
//                     placeholder="Pengajar"
//                     onChange={(e) => setPengajar(e.target.value)}
//                   />
//                 </FormControl>
//                 <FormControl isRequired>
//                   <FormLabel>Tanggal</FormLabel>
//                   <Input
//                     type="date"
//                     onChange={(e) => setTanggal(e.target.value)}
//                   />
//                 </FormControl>
//                 <FormControl>
//                   <FormLabel>Keterangan</FormLabel>
//                   <Textarea
//                     placeholder="Keterangan"
//                     onChange={(e) => setKeterangan(e.target.value)}
//                   />
//                 </FormControl>
//               </form>
//             </ModalBody>

//             <ModalFooter>
//               <Button colorScheme="teal" mr={3} onClick={tambahSiswaHadler}>
//                 Simpan
//               </Button>
//               <Button onClick={onClose}>Batal</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>

//         {/* <SiswaTable data={data} /> */}
//       </>
//     );
//   }
// }

// // Function untuk fetch data dari API students
// const siswaFetcher = async ({ queryKey }) => {
//   try {
//     const collection = queryKey[0];
//     let endpoint = `${URL}/${collection}`;

//     if (queryKey[1]) {
//       const params = queryKey[1];
//       endpoint = `${URL}/${collection}${params}`;
//     }

//     const { data } = await axios.get(endpoint, {
//       headers: {
//         Authorization: `Bearer ${jwt}`,
//       },
//     });

//     let newSiswa = [];
//     if (collection === "students") {
//       newSiswa = data.map((student) => {
//         return { value: student.classroom, label: student.classroom };
//       });
//       return newSiswa;
//     }

//     return data;
//   } catch (error) {
//     console.log(error);
//     return { msg: "Query data failed" };
//   }
// };

// export default DaftarRiwayatPembelajaran;

import React from "react";

function RiwayatBelajar() {
  return (
    <div>
      <h1>Riwayat Belajar</h1>
    </div>
  );
}

export default RiwayatBelajar;
