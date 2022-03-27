import "regenerator-runtime/runtime.js";
import { createContext } from "react";
import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import { QueryClient, QueryClientProvider } from "react-query";
import Router from "next/router";
import Head from "next/head";
import NProgress from "nprogress";
// import { endpoint } from "../utils/gql";
import { GraphQLClient } from "graphql-request";

import Layout from "../components/layout";
import { customTheme } from "../components/customStyles/theme";
import { Fonts } from "../components/customStyles/Font";

// INIT NPROGRESS
Router.events.on("routeChangeStart", (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// INIT GRAPHQL
export const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;
export const jwt = parseCookies().jwt;

// ChakraUI Custom Config
const theme = extendTheme(customTheme);
// react-query & graphql-request init
const queryClient = new QueryClient();
export const gqlConnect = new GraphQLClient(
  endpoint,
  jwt
    ? {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      }
    : undefined
);

export const GqlClient = createContext();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Fonts />
          <CSSReset />
          <Layout>
            <Component {...pageProps} gqlClient={gqlConnect} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
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
      if (ctx.pathname !== "/login" && ctx.pathname !== "/") {
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
