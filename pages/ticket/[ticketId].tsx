/* eslint-disable react-hooks/exhaustive-deps */
import Baselayout from "@/components/baselayout";
import Spinner from "@/components/spinner";
import { Context } from "@/context";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DateCalc, DropDown } from "..";

export default function TicketDetails() {
  const router = useRouter();
  const { ticketId } = router.query;
  const [loading, setLoading] = useState(true);
  const { state } = useContext(Context);
  const { agent, accessToken } = state;
  console.log("agent: ", accessToken);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<any>();
  const [selectedStatus, setSelectedStatus] = useState("Select here");

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const ticketDetailsRes = await axios.get(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:1337"
            : "https://shvasa-server.onrender.com"
        }/api/support-tickets/${ticketId}`
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

  const HandleChangeStatus = async () => {
    try {
      const changeStatusRes = await axios.patch(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:1337"
            : "https://shvasa-server.onrender.com"
        }/api/support-tickets/${ticketId}`,
        {
          status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (changeStatusRes.data.success) {
        toast.success("Status changed successfully");
        setSelectedStatus("Select here");
        // window.location.reload();
        fetchTicketDetails();
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
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
                <div className="flex flex-col items-center justify-center w-full gap-10 mt-14">
                  <DropDown
                    title="Change Status"
                    options={["New", "Assigned", "Resolved"]}
                    selectedOption={selectedStatus}
                    setSelectedOption={setSelectedStatus}
                  />
                  <button
                    onClick={HandleChangeStatus}
                    disabled={selectedStatus === "Select here"}
                    className={`px-4 py-1 border rounded ${
                      selectedStatus === "Select here"
                        ? " cursor-not-allowed"
                        : ""
                    }`}
                  >
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
