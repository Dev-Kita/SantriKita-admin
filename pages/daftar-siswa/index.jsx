import React from "react";
import useSWR from "swr";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";

const URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = async (url) => {
  try {
    const jwt = parseCookies().jwt;

    const { data } = await axios.get(`${URL}${url}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return { msg: "You need to login first" };
  }
};

function DaftarSiswa() {
  const { data, error } = useSWR(`/students`, fetcher);

  if (error) console.log(error);
  if (!data) {
    return <h3 style={{ textAlign: "center" }}>Loading</h3>;
  }
  // console.log(tableData);
  return <div></div>;
}

export default DaftarSiswa;
