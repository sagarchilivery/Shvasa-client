import React from "react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center max-w-[1440px] mx-auto h-10 w-screen">
      <div className="">Ticket Support</div>
      <div className="flex items-center gap-5">
        <button>Agent Register</button>
        <button>Agent Login</button>
      </div>
    </div>
  );
}
