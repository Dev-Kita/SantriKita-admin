import { gql } from "graphql-request";
// BIAYA MENU
// GET ALL BIAYA
export const ALL_BIAYA = gql`
  query {
    bills {
      id
      Keperluan
      semester
      tahun
      nominal
      nominal_dibayar
      tanggal_pembayaran
      status
      student {
        nama
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
export const ADD_BIAYA = gql`
  mutation AddBiaya(
    $student: ID!
    $Keperluan: String!
    $semester: Int
    $tahun: Int
    $nominal: Long
    $nominal_dibayar: Long
    $tanggal: Date
    $status: String
  ) {
    createBill(
      input: {
        data: {
          student: $student
          Keperluan: $Keperluan
          semester: $semester
          tahun: $tahun
          nominal: $nominal
          nominal_dibayar: $nominal_dibayar
          tanggal_pembayaran: $tanggal
          status: $status
        }
      }
    ) {
      bill {
        id
        semester
        nominal
        nominal_dibayar
        student {
          nama
        }
      }
    }
  }
`;

// GET DETAIL BIAYA
export const DETAIL_BIAYA = gql`
  query DetailBiaya($studentID: ID!) {
    bill(id: $studentID) {
      id
      Keperluan
      semester
      tahun
      nominal
      nominal_dibayar
      tanggal_pembayaran
      status
      student {
        nama
        kelas {
          kelas
        }
      }
    }
  }
`;

// HAPUS DATA PEMBAYARAN
export const DELETE_BIAYA = gql`
  mutation DeleteBiaya($studentID: ID!) {
    deleteBill(input: { where: { id: $studentID } }) {
      bill {
        id
        Keperluan
        student {
          nama
        }
      }
    }
  }
`;
