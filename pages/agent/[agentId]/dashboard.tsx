/* eslint-disable react-hooks/exhaustive-deps */
import Baselayout from "@/components/baselayout";
import Spinner from "@/components/spinner";
import { Context } from "@/context";
import axios from "axios";
import { useRouter } from "next/router";
import React, { use, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DateCalc } from "../..";

export default function Dashboard() {
  const router = useRouter();
  const { state, dispatch } = useContext(Context);
  const { accessToken, agent } = state;
  const [tickets, setTickets] = useState<any>([]);
  const { agentId } = router.query;
  const [loading, setLoading] = useState(true);

  const fetchAgentTickets = async () => {
    try {
      setLoading(true);
      const ticketsRes = await axios.get(
        "http://localhost:1337/api/support-tickets",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.tickets);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log("error: ", error);
      toast.error(error?.data?.message);
    }
  };

  useEffect(() => {
    fetchAgentTickets();
  }, [agentId]);

  useEffect(() => {
    if (agent === null) {
      router.push("/");
    }
  }, [agent]);

  return (
    <Baselayout>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-screen">
          <div className=" max-w-[1440px] w-full mx-auto">
            {tickets && tickets.length > 0 ? (
              <div className=" flex flex-col gap-4">
                <div className=" grid grid-cols-5 text-center">
                  <div className="">Topic</div>
                  <div className="">Description</div>
                  <div className="">Severity</div>
                  <div className="">Status</div>
                  <div className="">Date</div>
                </div>
                <div className="">
                  {tickets.map((ticket: any) => (
                    <div
                      key={ticket._id}
                      className=" grid grid-cols-5 text-center"
                    >
                      <div className="">{ticket.topic}</div>
                      <div className="">{ticket.description}</div>
                      <div className="">{ticket.severity}</div>
                      <div className="">{ticket.status}</div>
                      <div className="">{DateCalc(ticket.ticketCreatedOn)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              "No tickets found"
            )}
          </div>
        </div>
      )}
    </Baselayout>
  );
}
