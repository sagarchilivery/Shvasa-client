/* eslint-disable react-hooks/exhaustive-deps */
import Baselayout from "@/components/baselayout";
import Spinner from "@/components/spinner";
import { Context } from "@/context";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DateCalc } from "..";

export default function TicketDetails() {
  const router = useRouter();
  const { ticketId } = router.query;
  const [loading, setLoading] = useState(true);
  const { state } = useContext(Context);
  const { agent } = state;
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<any>();

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const ticketDetailsRes = await axios.get(
        `http://localhost:1337/api/support-tickets/${ticketId}`
      );

      if (ticketDetailsRes.data.success) {
        console.log("ticketDetailsRes: ", ticketDetailsRes);
        setTicketDetails(ticketDetailsRes.data.ticket);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketDetails && ticketDetails.assignedTo._id === agent._id) {
      setShowChangeStatus(true);
    } else {
      setShowChangeStatus(false);
    }
  }, [ticketDetails]);

  return (
    <Baselayout>
      <div className="w-screen mt-10">
        <div className=" max-w-[1440px] mx-auto w-full">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="mb-4 text-2xl font-bold">Ticket Details</div>
              <div className="flex flex-col gap-4 ">
                {[
                  "topic",
                  "description",
                  "severity",
                  "assignedTo",
                  "status",
                  "ticketCreatedOn",
                ].map((item: string) => (
                  <div key={item} className="grid grid-cols-2 ">
                    <div className="font-semibold first-letter:uppercase">
                      {item}
                    </div>
                    <div className=" first-letter:uppercase">
                      {item === "assignedTo"
                        ? ticketDetails.assignedTo.name
                        : item === "ticketCreatedOn"
                        ? DateCalc(ticketDetails.ticketCreatedOn)
                        : ticketDetails[item]}
                    </div>
                  </div>
                ))}
              </div>
              {showChangeStatus && (
                <div className="flex items-center justify-center w-full mt-14">
                  <button className="px-4 py-1 border rounded">
                    Change Status
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Baselayout>
  );
}
