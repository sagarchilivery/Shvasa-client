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
        "http://localhost:1337/api/support-agents/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("logoutRes: ", logoutRes);
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
    <div className="flex justify-between items-center max-w-[1440px] mx-auto h-10 w-screen">
      <Link href="/" className="">
        Ticket Support
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
              className=" flex items-center gap-2 border rounded px-4 py-1"
            >
              <h3 className=" first-letter:uppercase">{name}&apos;s</h3>
              Dashboard
            </Link>
            <button
              className=" border rounded px-4 py-1"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
