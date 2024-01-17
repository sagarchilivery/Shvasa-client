import Baselayout from "@/components/baselayout";
import { Context } from "@/context";
import axios from "axios";
import { useRouter } from "next/router";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";

const AgentLogin: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    description: "",
    password: "",
  });

  const { dispatch } = useContext(Context);

  const [showPassword, setShowPassword] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);

  const handleInpChange = (event: any) =>
    setData((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

  useEffect(() => {
    if (
      data.name !== "" &&
      data.email !== "" &&
      data.phone !== "" &&
      data.description !== "" &&
      data.password !== ""
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [data]);

  const handleLogin = () => {
    router.push("/agent/login");
  };

  const handleRegister = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const registerRes = await axios.post(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:1337"
            : "https://shvasa-server.onrender.com"
        }/api/support-agents`,
        data,
        {
          withCredentials: true,
        }
      );
      if (registerRes.data.success) {
        toast.success(registerRes.data.message);
        dispatch({ type: "LOGIN", payload: registerRes.data });
        router.push("/");
      }

      console.log(registerRes);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Baselayout title="Support Ticket - Login">
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center justify-center w-full h-screen gap-4 -mt-10"
      >
        <h1 className="mb-4 text-2xl font-bold">Agent Register</h1>

        {["name", "email", "password", "phone", "description"].map(
          (item: any) => (
            <div key={item} className="grid items-center grid-cols-2 gap-2">
              <label className=" first-letter:uppercase">{item}</label>
              <div className="relative">
                <input
                  type={
                    item === "password" && !showPassword ? "password" : "text"
                  }
                  autoComplete="off"
                  value={data[item]}
                  name={item}
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
          )
        )}

        <button
          onClick={handleRegister}
          className={`${
            btnDisabled
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 cursor-pointer"
          } text-white px-4 py-2 rounded`}
        >
          Register
        </button>
        <p className="mt-4">
          Been here?{" "}
          <span
            className={`text-blue-500 cursor-pointer`}
            onClick={handleLogin}
          >
            Login now
          </span>
        </p>
      </form>
    </Baselayout>
  );
};

export default AgentLogin;
