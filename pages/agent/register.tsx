import Baselayout from "@/components/baselayout";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";

const AgentLogin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    description: "",
    password: "",
  });

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
    // Handle login logic here
    router.push("/agent/login");
  };

  const handleRegister = () => {
    // Redirect to agent/register page
    // You can use React Router or any other routing library for this
  };

  return (
    <Baselayout title="Support Ticket - Login">
      <div className="flex flex-col -mt-10 w-full items-center gap-4 justify-center  h-screen">
        <h1 className="text-2xl font-bold mb-4">Agent Register</h1>

        {["name", "email", "phone", "description", "password"].map(
          (item: any) => (
            <div key={item} className="grid grid-cols-2 gap-2 items-center">
              <label className=" first-letter:uppercase">{item}</label>
              <input
                type="text"
                autoComplete="off"
                value={data[item]}
                name={item}
                onChange={handleInpChange}
                className="border bg-[#272727] text-[#f1f1f1] border-gray-300 rounded px-2 py-1"
              />
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
          <span className={`text-blue-500 cursor-pointer`} onClick={handleLogin}>
            Login now
          </span>
        </p>
      </div>
    </Baselayout>
  );
};

export default AgentLogin;
