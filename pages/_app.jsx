import { useEffect } from "react";
import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import Router from "next/router";
import Head from "next/head";

import Layout from "../components/layout";
import { customTheme } from "../components/theme";
import { Fonts } from "../components/Font";

const theme = extendTheme(customTheme);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Fonts />
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
