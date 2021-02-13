import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

function HapusSiswaAlert({
  deleteHandler,
  openAlert,
  cancelRef,
  onClose,
  isLoading,
}) {
  return (
    <AlertDialog
      isOpen={openAlert}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Hapus Data Siswa
          </AlertDialogHeader>

          <AlertDialogBody>
            Apakah anda yakin? Data siswa yang dihapus tidak bisa dikembalikan.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Batal
            </Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={deleteHandler}
              isLoading={isLoading}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default HapusSiswaAlert;
