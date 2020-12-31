import { parseCookies } from "nookies";
import Router from "next/router";
import Head from "next/head";

import "../styles/globals.css";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
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
