import Baselayout from "@/components/baselayout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/spinner";
import Image from "next/image";
import BasicModal from "@/components/modal";
import Link from "next/link";

export function DateCalc(inputDate: any) {
  const newDate = new Date(inputDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return newDate;
}

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const ticketsRes = await axios.get(
        "http://localhost:1337/api/support-tickets"
      );
      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.tickets);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Baselayout>
      <div className=" bg-[#121212]">
        {loading ? (
          <Spinner />
        ) : tickets.length !== 0 ? (
          <div className="w-screen min-h-screen">
            <div className=" max-w-[1440px] mx-auto flex gap-14 w-full flex-col pb-32">
              {/* Hero Section */}
              {/* <Image
                  src="https://images.unsplash.com/photo-1538905386057-4a5a580c45a6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className=" absolute top-0 left-0 w-full h-[75vh] object-cover"
                  alt=""
                /> */}
              <div className="flex relative flex-col border max-w-[70vw] mx-auto w-full rounded-md mt-10 items-center py-4 justify-center">
                <p className="flex flex-col gap-4 py-4 max-w-[650px] text-center">
                  <span className=" text-2xl font-semibold">
                    Empowering Solutions, Exceptional Support.
                  </span>
                  <span>
                    Welcome to our Ticket Support Hub, where we turn challenges
                    into triumphs. Submit a ticket, track your progress, and
                    experience the difference of expert assistance, 24/7
                    availability, and customer-first commitment. Let&apos;s
                    resolve together—your success is our mission
                  </span>
                </p>
                <button
                  onClick={() => {
                    setOpenModal(true);
                  }}
                  className=" border px-4 py-1 rounded-md"
                >
                  Create a Ticket
                </button>
              </div>

              {/* Table */}
              <div className="flex flex-col">
                <div className="grid grid-cols-7 text-center w-full justify-between cursor-default select-none ">
                  {[
                    "Topic",
                    "Description",
                    "Severity",
                    "Type",
                    "Assigned To",
                    "Status",
                    "Created on",
                  ].map((item: string) => (
                    <div key={item} className="w-full">
                      {item}
                    </div>
                  ))}
                </div>
                <div className=" w-full">
                  {tickets.map((ticket: any) => (
                    <Link
                      href={`/ticket/${ticket._id}`}
                      key={ticket._id}
                      className="grid grid-cols-7 select-none text-center rounded-md hover:bg-[#272727] justify-between w-full py-2"
                    >
                      <div className="">{ticket.topic}</div>
                      <div className="">{ticket.description}</div>
                      <div className="">{ticket.severity}</div>
                      <div className="">{ticket.type}</div>
                      <div className="">{ticket.assignedTo.name}</div>
                      <div className="">{ticket.status}</div>
                      <div className="">{DateCalc(ticket.ticketCreatedOn)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          "No tickets present"
        )}
      </div>

      {openModal && (
        <div className=" border">
          <BasicModal open={openModal} setOpen={setOpenModal} />
        </div>
      )}
    </Baselayout>
  );
}
