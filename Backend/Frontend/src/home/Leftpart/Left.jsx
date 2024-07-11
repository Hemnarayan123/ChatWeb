import React from "react";
import Search from "./Search";
import Users from "./Users";
import Profile from "./Profile";

function Left() {
  return (
    <div className="w-full   bg-black text-gray-300">
      <Profile/>
      <Search />
      <div
        className=" flex-1  overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}
      >
        <Users />
      </div>
    
    </div>
  );
}

export default Left;
