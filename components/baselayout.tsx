import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Head from "next/head";

type BaselayoutProps = {
  title?: string;
  children: ReactNode;
};

export default function Baselayout({ title, children }: BaselayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? title : "Support Ticket"}</title>
      </Head>
      <div className="flex text-[#f1f1f1]">
        <section className="flex flex-col w-screen overflow-hidden">
          <div className="z-[100]">
            <Navbar />
          </div>
          <div className="min-h-screen overflow-hidden bg-[#121212] ">{children}</div>
        </section>
      </div>
    </>
  );
}
