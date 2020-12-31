import axios from "axios";
import React from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/router";

const url = process.env.NEXT_PUBLIC_API_URL;

function Dashboard(data) {
  const router = useRouter();
  // console.log(data);

  const logoutHandler = () => {
    destroyCookie(null, "jwt");
    router.replace("/login");
  };

  return (
    <div>
      <h1>Wellcome to dashboard</h1>
      <br />
      <button onClick={logoutHandler}>logout</button>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  try {
    const jwt = parseCookies(context).jwt;

    const { data } = await axios.get(`${url}/students`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return {
      props: { data },
    };
  } catch (error) {
    console.log(error);
    return {
      props: { msg: "You need to login first" },
    };
  }
};

export default Dashboard;
