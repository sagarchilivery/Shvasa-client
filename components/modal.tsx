import { Dialog, Menu } from "@headlessui/react";
import axios from "axios";
import React, {
  Children,
  FormEvent,
  Fragment,
  useEffect,
  useState,
} from "react";
import { IoMdClose } from "react-icons/io";

export default function BasicModal({ open, setOpen }: any) {
  const [data, setData] = useState({
    topic: "",
    description: "",
    severity: "",
    type: "",
  });

  const [btnDisabled, setBtnDisabled] = useState(true);

  const HandleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const createRes = await axios.post(
        "http://localhost:1337/api/support-tickets",
        data
      );
      console.log("createRes: ", createRes);
      if (createRes.data.success) {
        setData({
          topic: "",
          description: "",
          severity: "",
          type: "",
        });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const HandleInpChange = (e: any) => {
    setData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    if (
      data.topic !== "" &&
      data.description !== "" &&
      data.severity !== "" &&
      data.type !== ""
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="absolute top-0 left-0 flex w-screen text-[#f1f1f1] bg-[#121212d8] h-screen items-center justify-center"
    >
      <Dialog.Panel className="max-w-[500px] bg-[#282828] border max-h-[75vh] overflow-hidden h-full mx-auto w-full">
        <form onSubmit={HandleSubmit} className="">
          <div className="flex justify-between px-4 py-1 items-center border ">
            <Dialog.Title className="text-lg">Create a ticket</Dialog.Title>
            <IoMdClose
              onClick={() => setOpen(false)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <div className="flex flex-col py-5 gap-5 px-5">
            {/* Topic */}
            <div className="flex gap-10 items-center">
              <label htmlFor="topic">Topic</label>
              <input
                type="text"
                autoComplete="off"
                name="topic"
                value={data.topic}
                onChange={HandleInpChange}
                className=" bg-[#121212] rounded-md outline-none focus:outline-none border-none ring-0 h-8"
                id="topic"
              />
            </div>

            {/* Description */}
            <div className="flex gap-10 items-start">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                autoComplete="off"
                id="description"
                value={data.description}
                onChange={HandleInpChange}
                className=" resize-none h-[200px] w-full bg-[#121212] rounded-md outline-none focus:outline-none border-none ring-0"
              />
            </div>

            {/* Severity */}
            <div className="flex items-center gap-10">
              <label htmlFor="severity">Severity</label>
              <Menu>
                <div className="relative">
                  <Menu.Button className="border px-4 rounded-md">
                    {data.severity !== "" ? data.severity : "Select here"}
                  </Menu.Button>
                  <Menu.Items className="absolute top-8 w-full left-0">
                    {["Low", "Moderate", "Critical"].map((ele) => (
                      <Menu.Item key={ele} as={Fragment}>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              setData((prev: any) => ({
                                ...prev,
                                severity: ele,
                              }));
                            }}
                            className={`${
                              active
                                ? "bg-blue-500 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {ele}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </div>
              </Menu>
            </div>

            {/* Type */}
            <div className="flex gap-10 items-center">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                name="type"
                value={data.type}
                autoComplete="off"
                onChange={HandleInpChange}
                className=" bg-[#121212] rounded-md outline-none focus:outline-none border-none ring-0 h-8"
                id="type"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <button
              disabled={btnDisabled}
              className={`border px-4 py-1 rounded-md ${
                btnDisabled ? "bg-gray-500" : "bg-blue-500 text-white"
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
