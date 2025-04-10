"use client";
import React from "react";

function WorkshopSidebar({ selected, setSelected }) {
  return (
    <div className="w-1/4 bg-gray-100 min-h-96 p-6 shadow-md">
      <button
        className={`block w-full text-left px-4 py-2 rounded ${
          selected === "workshophome" ? "bg-primary-color text-white" : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("workshophome")}
      >
        Home
      </button>
      <button
        className={`block w-full text-left px-4 py-2 rounded mt-4 ${
          selected === "workshopdetails" ? "bg-primary-color text-white" : "hover:bg-gray-200"
        }`}
        onClick={() => setSelected("workshopdetails")}
      >
        Workshop Details
      </button>
      <button
        className={`block w-full text-left px-4 py-2 rounded mt-4 ${
          selected === "acceptedrequests" ? "bg-primary-color text-white": "hover:bg-gray-200"
        }`}
        onClick={()=>{
          setSelected("acceptedrequests")
        }}>
          Accepted Requests
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

export default WorkshopSidebar;
