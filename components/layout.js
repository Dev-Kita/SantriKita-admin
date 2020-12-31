import React from "react";
import { useRouter } from "next/router";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Sidebar from "./sidebar";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#6EE7B7",
      main: "#059669",
      dark: "#047857",
    },
    secondary: {
      light: "#FCA5A5",
      main: "#DC2626",
      dark: "#B91C1C",
    },
  },
});

function Layout({ children }) {
  const router = useRouter();
  return (
    <>
      <ThemeProvider theme={theme}>
        {router.pathname === "/" || router.pathname === "/login" ? (
          <div>{children}</div>
        ) : (
          <Sidebar>{children}</Sidebar>
        )}
      </ThemeProvider>
    </>
  );
}

export default Layout;
