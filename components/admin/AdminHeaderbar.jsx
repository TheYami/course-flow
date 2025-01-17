import React, { useState } from "react";
import { MagnifyingIcon } from "@/assets/icons/admin_icon/adminIcon";
import { useRouter } from "next/router";

const AdminHeaderbar = ({ title, buttonLabel, onSearch, navigatePath }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex bg-[#FFFFFF] justify-between items-center py-4 px-10 mb-6 border-b shadow-sm">
      <h1 className="text-2xl font-sans ">{title}</h1>
      <div className="flex  space-x-4">
        <div className="relative">
          <input
            className="border rounded-md mt-1 pl-8 pr-20 py-[0.75rem] focus:ring-2 focus:ring-[#2F5FAC] focus:outline-none"
            placeholder="Enter or Click for Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          />
          <span
            onClick={handleSearch}
            className="absolute top-5 right-3 text-[#9AA1B9] cursor-pointer"
          >
            <MagnifyingIcon />
          </span>
        </div>
        <button
          className="bg-[#2F5FAC] hover:bg-[#3f74ca] text-[#FFFFFF] py-3 px-8 rounded-lg"
          onClick={() => handleNavigation(navigatePath)}
        >
          {buttonLabel || "Search"}
        </button>
      </div>
    </div>
  );
};

export default AdminHeaderbar;
