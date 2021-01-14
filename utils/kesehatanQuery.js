import { gql } from "graphql-request";
// BIAYA MENU
// GET ALL BIAYA
export const ALL_KESEHATAN = gql`
  query {
    medicalHistories {
      id
      penyakit
      status
      keterangan
      tanggal
      student {
        nama
        kelas {
          kelas
        }
      }
    }
    students {
      nama
      kelas {
        kelas
      }
      id
    }
  }
`;
// TAMBAH BIAYA BARU
export const ADD_KESEHATAN = gql`
  mutation AddCatatanKesehatan(
    $student: ID!
    $penyakit: String!
    $tanggal: Date
    $keterangan: String
    $status: Boolean
  ) {
    createMedicalHistory(
      input: {
        data: {
          student: $student
          penyakit: $penyakit
          tanggal: $tanggal
          keterangan: $keterangan
          status: $status
        }
      }
    ) {
      medicalHistory {
        id
        penyakit
        tanggal
        student {
          nama
        }
      }
    }
  }
`;

// GET DETAIL BIAYA
// export const DETAIL_BIAYA = gql`
//   query DetailBiaya($studentID: ID!) {
//     bill(id: $studentID) {
//       id
//       Keperluan
//       semester
//       tahun
//       nominal
//       nominal_dibayar
//       tanggal_pembayaran
//       status
//       student {
//         nama
//         kelas {
//           kelas
//         }
//       }
//     }
//   }
// `;

// // HAPUS DATA PEMBAYARAN
// export const DELETE_BIAYA = gql`
//   mutation DeleteBiaya($studentID: ID!) {
//     deleteBill(input: { where: { id: $studentID } }) {
//       bill {
//         id
//         Keperluan
//         student {
//           nama
//         }
//       }
//     }
//   }
// `;
