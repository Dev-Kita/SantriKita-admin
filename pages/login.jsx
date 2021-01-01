import axios from "axios";
import React, { useState } from "react";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Box,
  Text,
  Alert,
  AlertTitle,
  CloseButton,
  AlertIcon,
} from "@chakra-ui/react";

const url = process.env.NEXT_PUBLIC_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState(true);
  const router = useRouter();

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

      router.replace("/dashboard");
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

      <Box maxW="sm" my="8" mx="auto" textAlign="center">
        <Heading>Login Page</Heading>
        <form
          onSubmit={submitHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.5rem",
            margin: "2rem auto",
          }}
        >
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" onChange={(e) => setUsername(e.target.value)} />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" variant="solid">
            Log in
          </Button>
        </form>

        {isLoading ? (
          <Text fontSize="lg" fontWeight="medium">
            Loading...
          </Text>
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
      </Box>
    </>
  );
}

export default Login;
