/* eslint-disable react-hooks/exhaustive-deps */
import Baselayout from "@/components/baselayout";
import { Context } from "@/context";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";

const AgentLogin: React.FC = () => {
  const router = useRouter();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [data, setData] = useState<any>({
    email: "",
    password: "",
  });

  const { state, dispatch } = useContext<any>(Context);
  const { agent } = state;

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:1337"
            : "https://shvasa-server.onrender.com"
        }/api/support-agents/login`,
        data
      );
      if (loginRes.data.success) {
        toast.success(loginRes.data.message);
        dispatch({ type: "LOGIN", payload: loginRes.data });
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      console.log("error: ", error);
    }
  };

  const handleRegister = () => {
    router.push("/agent/register");
  };

  const handleInpChange = (event: any) =>
    setData((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

  useEffect(() => {
    if (data.email !== "" && data.password !== "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [data]);

  useEffect(() => {
    if (agent !== null) {
      router.push("/");
    }
  }, [agent]);

  return (
    <Baselayout title="Support Ticket - Login">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center w-full h-screen gap-4 bg-[#121212]"
      >
        <h1 className="mb-4 text-2xl font-bold">Agent Login</h1>

        {["email", "password"].map((item: any) => (
          <div key={item} className="grid items-center grid-cols-2 gap-2">
            <label className=" first-letter:uppercase">{item}</label>
            <div className="relative">
              <input
                type={
                  item === "password" && !showPassword ? "password" : "text"
                }
                autoComplete="off"
                name={item}
                value={data[item]}
                onChange={handleInpChange}
                className="border bg-[#272727] text-[#f1f1f1] border-gray-300 rounded px-2 py-1"
              />

              {item === "password" && (
                <FaEye
                  onClick={() => {
                    setShowPassword(true);
                    setTimeout(() => {
                      setShowPassword(false);
                    }, 2000);
                  }}
                  className="absolute cursor-pointer right-2 top-2"
                />
              )}
            </div>
          </div>
        ))}

        <button
          className={`${
            btnDisabled
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 cursor-pointer"
          } text-white px-4 py-2 rounded`}
        >
          Login
        </button>
        <p className="mt-4">
          New here?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={handleRegister}
          >
            Register now
          </span>
        </p>
      </form>
    </Baselayout>
  );
};

export default AgentLogin;
