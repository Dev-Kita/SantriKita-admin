import React from "react";
import Head from "next/head";
import { Box, Heading } from "@chakra-ui/react";

function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Santri Kita</title>
      </Head>

      <Box bgColor="white" p="4" rounded="md" borderWidth="1px">
        <Heading textAlign="center" fontSize="2xl">
          Wellcome to dashboard
        </Heading>
      </Box>
    </>
  );
}

export default Dashboard;
