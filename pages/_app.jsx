import { useEffect } from "react";
import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import Router from "next/router";
import Head from "next/head";

import "../styles/globals.css";
import Layout from "../components/layout";
import { colors } from "../components/theme";

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  );
}

const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  try {
    const jwt = parseCookies(ctx).jwt;

    if (jwt) {
      if (ctx.pathname === "/login") {
        redirectUser(ctx, "/dashboard");
      }
    }

    if (!jwt) {
      if (ctx.pathname === "/dashboard") {
        redirectUser(ctx, "/login");
      }
    }

    return { msg: jwt };
  } catch (error) {
    console.log(error);
    return { msg: "You need to login first" };
  }
};

export default MyApp;
