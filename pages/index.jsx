import Head from "next/head";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { Heading, Link, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading>Welcome to Santri Kita</Heading>

        <Text fontSize="xl" mt="4">
          Get started by{" "}
          <NextLink href="/login">
            <Link color="teal.600">Login</Link>
          </NextLink>
        </Text>
      </main>
    </div>
  );
}
