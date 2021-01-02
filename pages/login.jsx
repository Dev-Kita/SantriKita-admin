import axios from "axios";
import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Link,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Box,
  Flex,
  Text,
  Alert,
  AlertTitle,
  CloseButton,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";

const url = process.env.NEXT_PUBLIC_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Prefetch halaman dashboard
    router.prefetch("/dashboard");
  }, []);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setAuth(true);
      setIsLoading(true);
      const loginInfo = { identifier: username, password: password };

      const login = await axios.post(`${url}/auth/local`, loginInfo);
      const loginResponse = login.data;

      setCookie(null, "jwt", loginResponse.jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setAuth(true);
      setIsLoading(false);

      router.push("/dashboard");
    } catch (error) {
      setAuth(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Santri Kita</title>
      </Head>

      <Flex maxW="md" minHeight="100vh" m="auto" textAlign="center">
        <Flex
          p="8"
          m="auto"
          w="full"
          flexDir="column"
          border="1px"
          borderColor="gray.300"
          rounded="md"
        >
          <NextLink href="/">
            <Link fontSize="lg" color="teal.600">
              Santri Kita
            </Link>
          </NextLink>
          <Heading fontSize="2xl">Login Page</Heading>
          <form onSubmit={submitHandler}>
            <Flex flexDir="column" justify="center" gridGap="2" my="8">
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" mt="2" colorScheme="teal" variant="solid">
                Log in
              </Button>
            </Flex>
          </form>

          {isLoading ? (
            <Box justifyContent="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="teal.500"
              />
            </Box>
          ) : undefined}

          {auth ? undefined : (
            <Alert status="error" rounded="md">
              <AlertIcon />
              <AlertTitle>Wrong username or password</AlertTitle>
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setAuth(true)}
              />
            </Alert>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export default Login;
