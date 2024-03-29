import { Context } from "@/context";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { state, dispatch } = useContext(Context);
  const { agent, accessToken } = state;
  const [name, setName] = useState("");

  useEffect(() => {
    if (agent !== null) {
      setName(agent.name);
    } else {
      setName("");
    }
  }, [agent]);

  const handleLogout = async () => {
    setName("");
    try {
      const logoutRes = await axios.post(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:1337"
            : "https://shvasa-server.onrender.com"
        }/api/support-agents/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (logoutRes.data.success) {
        toast.success(logoutRes.data.message);
        dispatch({ type: "LOGOUT" });
      }
    } catch (error: any) {
      console.log("error: ", error);
      toast.error(error?.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen pb-10">
      <div className="flex justify-between bg-[#000]  px-10 w-screen mx-auto py-3.5 fixed top-0 ">
        <Link href="/" className="flex items-center gap-4">
          <h3>Ticket Support</h3>
          <h3>HOME</h3>
        </Link>
        <div className="flex items-center gap-5">
          {name === "" ? (
            <>
              <Link href="/agent/register">Agent Register</Link>
              <Link href="/agent/login">Agent Login</Link>
            </>
          ) : (
            <>
              <Link
                href={`/agent/${agent?._id}/dashboard`}
                className="flex items-center gap-2 px-4 py-1 border rounded "
              >
                <h3 className=" first-letter:uppercase">{name}&apos;s</h3>
                Dashboard
              </Link>
              <button
                className="px-4 py-1 border rounded "
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
