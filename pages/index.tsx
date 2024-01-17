/* eslint-disable react-hooks/exhaustive-deps */
import Baselayout from "@/components/baselayout";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/spinner";
import Image from "next/image";
import BasicModal from "@/components/modal";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";
import { Menu } from "@headlessui/react";

export function DateCalc(inputDate: any) {
  const newDate = new Date(inputDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return newDate;
}

export function DropDown({
  title,
  options,
  selectedOption,
  setSelectedOption,
}: any) {
  return (
    <div className="flex gap-2">
      <label htmlFor="severity">{title}</label>
      <Menu>
        <div className="relative">
          <Menu.Button className="px-4 border rounded-md">
            {selectedOption}
          </Menu.Button>
          <Menu.Items className="absolute left-0 w-full top-8">
            {options.map((ele: any) => (
              <Menu.Item key={ele} as={Fragment}>
                {({ active }) => (
                  <div
                    onClick={() => {
                      setSelectedOption(ele);
                    }}
                    className={`${
                      active ? "bg-blue-500 text-white" : "bg-white text-black"
                    } cursor-pointer`}
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
  );
}

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const recordsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  console.log("totalPages: ", totalPages);

  const [selectedSeverity, setSelectedSeverity] = useState("Select here");
  const [selectedStatus, setSelectedStatus] = useState("Select here");
  const [selectedActivity, setSelectedActivity] = useState("Select here");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSortOrder, setSelectedSortOrder] = useState("Select here");

  const fetchTicketsByPage = async (currentPage1: number) => {
    try {
      const ticketsRes = await axios.get(
        `http://localhost:1337/api/support-tickets?status=${
          selectedStatus !== "Select here" ? selectedStatus : ""
        }&severity=${
          selectedSeverity !== "Select here" ? selectedSeverity : ""
        }&sortField=${
          selectedActivity !== "Select here" ? selectedActivity : ""
        }&sortOrder=${
          selectedSortOrder !== "Select here" ? selectedSortOrder : ""
        }&page=${currentPage1}&pageSize=${recordsPerPage}`
      );
      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.tickets);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error fetching tickets");
    }
  };

  const handlePageClick = (data: any) => {
    let currentPage1 = data.selected + 1;
    setCurrentPage(currentPage1);
    fetchTicketsByPage(currentPage1);
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const ticketsRes = await axios.get(
        "http://localhost:1337/api/support-tickets?page=1&pageSize=10"
      );
      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.tickets);
        console.log("ticketsRes.data.totalCount: ", ticketsRes.data.totalCount);
        if (ticketsRes.data.totalCount <= 10) {
          setTotalPages(1);
        } else {
          setTotalPages(Math.ceil(ticketsRes.data.totalCount / 10));
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  // /api/getAllTickets?status=New&assignedTo=<agentId>&severity=Critical&type=Issue&sortField=resolvedOn&sortOrder=desc&page=1&pageSize=10
  const fetchTicketByFilter = async () => {
    try {
      const FilterRes = await axios.get(
        `http://localhost:1337/api/support-tickets?status=${
          selectedStatus !== "Select here" ? selectedStatus : ""
        }&severity=${
          selectedSeverity !== "Select here" ? selectedSeverity : ""
        }&sortField=${
          selectedActivity !== "Select here" ? selectedActivity : ""
        }&sortOrder=${
          selectedSortOrder !== "Select here"
            ? selectedSortOrder === "Descending"
              ? "desc"
              : ""
            : ""
        }&page=${currentPage}&pageSize=${recordsPerPage}`
      );

      if (FilterRes.data.success) {
        setTotalPages(Math.ceil(FilterRes.data.totalCount / 10));
        setTickets(FilterRes.data.tickets);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (
      selectedSeverity !== "Select here" ||
      selectedStatus !== "Select here" ||
      selectedActivity !== "Select here" ||
      selectedSortOrder !== "Select here"
    ) {
      fetchTicketByFilter();
    }
  }, [selectedSeverity, selectedStatus, selectedActivity, selectedSortOrder]);

  return (
    <Baselayout>
      <div className="bg-[#121212]">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col">
            {/* Hero Section */}
            <div className="flex relative flex-col border max-w-[70vw] mx-auto w-full rounded-md mt-10 items-center py-4 justify-center">
              <p className="flex flex-col gap-4 py-4 max-w-[650px] text-center">
                <span className="text-2xl font-semibold ">
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
                className="px-4 py-1 border rounded-md "
              >
                Create a Ticket
              </button>
            </div>

            <div className="flex gap-8 py-10 mx-auto">
              <DropDown
                title="Severity"
                selectedOption={selectedSeverity}
                setSelectedOption={setSelectedSeverity}
                options={["Low", "Moderate", "Critical"]}
              />
              <DropDown
                title="Status"
                selectedOption={selectedStatus}
                setSelectedOption={setSelectedStatus}
                options={["New", "Assigned", "Resolved"]}
              />
              <DropDown
                title="Activity"
                // selectedActivity, selectedActivity
                selectedOption={selectedActivity}
                setSelectedOption={setSelectedActivity}
                options={["Resolved On", "Created On"]}
              />
              <DropDown
                title="Sort order"
                selectedOption={selectedSortOrder}
                setSelectedOption={setSelectedSortOrder}
                options={["Ascending", "Descending"]}
              />
            </div>
            <div className="pb-10 ">
              {tickets.length !== 0 ? (
                <div className="w-screen min-h-screen">
                  <div className=" max-w-[1440px] mx-auto flex gap-14 w-full flex-col pb-32">
                    {/* Table */}
                    <div className="flex flex-col">
                      <div className="grid justify-between w-full grid-cols-7 text-center cursor-default select-none ">
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
                      <div className="w-full ">
                        {tickets.map((ticket: any) => (
                          <Link
                            href={`/ticket/${ticket._id}`}
                            key={ticket._id}
                            className="grid grid-cols-7 select-none text-center group rounded-md hover:bg-[#272727] justify-between w-full py-2"
                          >
                            <div className="">{ticket.topic}</div>
                            <div className="max-w-[120px] mx-auto w-full relative">
                              {ticket.description}
                            </div>
                            <div className="">{ticket.severity}</div>
                            <div className="">{ticket.type}</div>
                            <div className="">{ticket.assignedTo.name}</div>
                            <div className="">{ticket.status}</div>
                            <div className="">
                              {DateCalc(ticket.ticketCreatedOn)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Pagination */}
                    <div className="flex w-full text-[#858585]">
                      <ReactPaginate
                        previousLabel="Previous"
                        nextLabel="Next"
                        breakLabel={"..."}
                        pageCount={totalPages}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={1}
                        onPageChange={handlePageClick}
                        containerClassName="flex gap-2 justify-center items-center w-full"
                        pageClassName="flex justify-center items-center w-8 h-8 rounded-full border border-[#272727] hover:bg-[#272727]  cursor-pointer"
                        pageLinkClassName="flex justify-center items-center w-full h-full "
                        previousClassName="flex justify-center items-center px-2 h-8 rounded border border-[#272727] hover:bg-[#272727] cursor-pointer"
                        nextClassName="flex justify-center items-center px-2 h-8 rounded border border-[#272727] hover:bg-[#272727] cursor-pointer"
                        nextLinkClassName="flex justify-center items-center w-full h-full text-[#01AAF9]"
                        previousLinkClassName="flex justify-center items-center w-full h-full text-[#01AAF9]"
                        breakClassName="flex justify-center items-center w-8 h-8 rounded-full border border-[#272727] hover:bg-[#818181] cursor-pointer"
                        breakLinkClassName="flex justify-center items-center w-full h-full"
                        activeClassName="bg-[#272727] text-[#f1f1f1]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-screen text-center min-h-screen pt-[150px]">
                  No tickets present
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {openModal && (
        <div className="border ">
          <BasicModal open={openModal} setOpen={setOpenModal} />
        </div>
      )}
    </Baselayout>
  );
}
