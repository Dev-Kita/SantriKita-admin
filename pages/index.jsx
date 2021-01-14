import Head from "next/head";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { Heading, Button, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Landing Page | Santri kita</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading>Welcome to Santri Kita Admin</Heading>

        <Text fontSize="xl" mt="4">
          <NextLink href="/login">
            <Button variant="solid" colorScheme="teal">
              Log in
            </Button>
          </NextLink>
        </Text>
      </main>
    </div>
  );
}
