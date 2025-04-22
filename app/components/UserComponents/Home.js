"use client";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/app/stores/useUserStore";
import { getUserRepairs, getBill } from "@/app/utils/vehicleapi";
import { generateBill } from "../../utils/workshopapi";

function Home() {
  const { user } = useUserStore();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [bills, setBills] = useState({}); // Store fetched bills
  const [billLoading, setBillLoading] = useState({}); // Track loading state for each repair
  const [popupBill, setPopupBill] = useState(null); // Store the bill to display in the popup

  const fetchRepairs = async (status) => {
    setLoading(true);
    try {
      const response = await getUserRepairs(status);
      if (response.success) {
        setRepairs(response.data);
      }
    } catch (error) {
      console.error("Error fetching repairs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBill = async (bill_id) => {
    console.log("Fetching bill for ID:", bill_id);
    setBillLoading((prev) => ({ ...prev, [bill_id]: true })); // Set loading state
    try {
      const result = await getBill(bill_id);
      if (result.success) {
        setPopupBill(result.data); // Set the bill to display in the popup
      } else {
        console.error("Failed to fetch bill:", result.message);
      }
    } catch (error) {
      console.error("Error fetching bill details:", error);
    } finally {
      setBillLoading((prev) => ({ ...prev, [bill_id]: false })); // Reset loading state
    }
  };

  const payBill = async (bill_id) => {
    console.log("Paying bill for ID:", bill_id);
    try {
      const response = await fetch(`http://localhost:5000/api/payment/khaltiPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({ bill_id }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = data.data.payment_url; // Redirect to Khalti payment URL
      } else {
        console.error("Payment initiation failed:", data.message);
        alert("Payment initiation failed: " + data.message);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleGenerateBill = async (repair_id) => {
    setBillLoading((prev) => ({ ...prev, [repair_id]: true })); // Set loading state

    try {
      const result = await generateBill(repair_id);

      if (result.success) {
        setBills((prevBills) => ({
          ...prevBills,
          [repair_id]: result.data, // Store the generated bill
        }));
      } else {
        console.error("Failed to generate bill:", result.message);
      }
    } catch (error) {
      console.error("Error generating bill:", error);
    }

    setBillLoading((prev) => ({ ...prev, [repair_id]: false })); // Reset loading state
  };

  useEffect(() => {
    fetchRepairs(selectedStatus);
  }, [selectedStatus]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Hello!{" "}
          <span className="text-lg">All your Vehicle Repair Status </span>
        </h1>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="">All Status</option>
          <option value="Requested">Requested</option>
          <option value="Accepted">Accepted</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : repairs.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {repairs.map((repair, index) => (
            <div
              key={repair.id || index}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Vehicle:</p>
                  <p>
                    {repair.vehicle_make} {repair.vehicle_model}
                  </p>
                  <p className="font-semibold mt-4">
                    Bill Status: 
                    <br/><span
                    className={`px-2 py-1 rounded-full text-sm ${
                      repair.bill_status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : repair.bill_status === "Pending"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >{repair.bill_status}</span>
                    </p>
                  <p className="font-semibold mt-2">Workshop:</p>
                  <p>{repair.workshop_name || "Not assigned"}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      repair.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : repair.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {repair.status}
                  </span>
                  <button
                    onClick={() => fetchBill(repair.bill_id)}
                    className="mt-2 px-4 py-2 ml-52 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={billLoading[repair.bill_id]}
                  >
                    {billLoading[repair.bill_id] ? "Fetching Bill..." : "Get Bill"}
                  </button>
                  <p className="font-semibold mt-2">Requested:</p>
                  <p>{new Date(repair.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <p className="font-semibold">Repair Description:</p>
                <p className="text-gray-600">{repair.repair_description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No repair requests found.</p>
        </div>
      )}

      {/* Popup for Bill Details */}
      {popupBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Bill Details</h2>
            <p>Workshop: {popupBill.workshop_name}</p>
            <p>Repair Description: {popupBill.repair_description}</p>
            <p>Parts Used:</p>
            <ul>
              {popupBill.parts_used && Array.isArray(popupBill.parts_used) ? (
                popupBill.parts_used.map((part) => (
                  <li key={part._id}>
                    {part.part_name}: ${part.part_cost}
                    {part.quantity ? ` (x${part.quantity})` : ""}
                  </li>
                ))
              ) : (
                <li>No parts data available</li>
              )}
            </ul>
            <p>Extra Charges: </p>
            <ul>
              {popupBill.extra_charges && Array.isArray(popupBill.extra_charges) ? (
                popupBill.extra_charges.map((charge) => (
                  <li key={charge._id}>
                    {charge.charge_name}: ${charge.charge_cost}
                  </li>
                ))
              ) : (
                <li>No extra charges data available</li>
              )}
            </ul>
            <p>Parts Total: ${popupBill.parts_total}</p>
            <p>Charges Total: ${popupBill.charges_total}</p>
            <p>Grand Total: ${popupBill.grand_total}</p>
            <p>Payment Status: {popupBill.payment_status}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setPopupBill(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => payBill(popupBill._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;