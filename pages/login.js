import axios from "axios";
import React, { useState } from "react";
import { setCookie } from "nookies";
import { useRouter } from "next/router";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const url = process.env.NEXT_PUBLIC_API_URL;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(true);
  const router = useRouter();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const loginInfo = { identifier: username, password: password };

      const login = await axios.post(`${url}/auth/local`, loginInfo);
      const loginResponse = login.data;

      setCookie(null, "jwt", loginResponse.jwt, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      setAuth(true);
      router.replace("/dashboard");
    } catch (error) {
      setAuth(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <h1>Login Page</h1>
      <form
        onSubmit={submitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.5rem",
          width: "40%",
          margin: "2rem auto",
        }}
      >
        <TextField
          required
          label="Username"
          variant="outlined"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          required
          label="Password"
          variant="outlined"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Log in
        </Button>
      </form>
      {auth ? undefined : (
        <div>
          <Typography variant="h5" color="secondary">
            Wrong username or password
          </Typography>
        </div>
      )}
    </div>
  );
}

export default Login;
