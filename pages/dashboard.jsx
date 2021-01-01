import axios from "axios";
import React from "react";
import { useRouter } from "next/router";

function Dashboard() {
  const router = useRouter();
  // console.log(data);

  return (
    <div>
      <h1>Wellcome to dashboard</h1>
      <br />
    </div>
  );
}

export default Dashboard;
