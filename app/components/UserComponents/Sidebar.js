"use client";
import React from "react";

function Sidebar({ selected, setSelected }) {
  return (
    <div className="w-1/4 bg-gray-100 min-h-96 p-6 shadow-md">
      <button
        className={`block w-full text-left px-4 py-2 rounded ${
          selected === "home" ? "bg-primary-color text-white" : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("home")}
      >
        Home
      </button>
      <button
        className={`block w-full text-left px-4 py-2 rounded mt-4 ${
          selected === "profile" ? "bg-primary-color text-white" : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("profile")}
      >
        Profile Details
      </button>
      <button
        className={`block w-full text-left px-4 py-2 rounded mt-4 ${
          selected === "vehicledetail" ? "bg-primary-color text-white": "hover:bg-gray-200"
        }`}
        onClick={()=>{
          setSelected("vehicledetail")
        }}>
          Vehicles
      </button>
      <button
        className={`block w-full text-left px-4 py-2 rounded mt-4 ${
          selected === "register" ? "bg-primary-color text-white" : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("register")}
      >
        Register Vehicle
      </button>

     
    </div>
  );
}

export default Sidebar;
