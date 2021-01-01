import React from "react";
import { useRouter } from "next/router";
import Sidebar from "./sidebar";
import { Box } from "@chakra-ui/react";

function Layout({ children }) {
  const router = useRouter();
  return (
    <Box color="gray.700">
      {router.pathname === "/" || router.pathname === "/login" ? (
        <Box>{children}</Box>
      ) : (
        <Sidebar>{children}</Sidebar>
      )}
    </Box>
  );
}

export default Layout;
