import React, { useState, useEffect } from "react";
import { useVehicleStore } from "@/app/stores/useVehicleStore";
import { useUserStore } from "@/app/stores/useUserStore";
import { addRepairRequest } from "@/app/utils/api";

function VehicleDetails() {
  const { vehicles, loading, error, fetchVehicles } = useVehicleStore();
  const { userToken } = useUserStore();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (userToken) {
      console.log("This is user token" + userToken)
      fetchVehicles();
    } else {
      console.log("No user token available");
    }
  }, [fetchVehicles, userToken]);

  const handleRepairRequest = async () => {
    if (!description) {
      alert("Please enter a repair description.");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to submit a repair request for the vehicle?`
    );

    if (confirm) {
      try {
        const result = await addRepairRequest(
          selectedVehicle._id,
          description,
          userToken
        );
        alert(result.message);
        setSelectedVehicle(null);
        setDescription("");
      } catch (err) {
        console.error(err);
        alert(err.message || "Failed to make repair request.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-full">
      <h1 className="border-b-2 border-black text-2xl font-bold text-center mb-6">
        Vehicles
      </h1>
      {vehicles.length === 0 ? (
        <div>No vehicles found.</div>
      ) : (
        <ul className="flex flex-col gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="flex justify-between p-4 border-black gap-6 bg-gray-200 rounded-lg"
            >
              <div>
                <div><strong>Brand:</strong> {vehicle.brand}</div>
                <div><strong>Model:</strong> {vehicle.model}</div>
                <div><strong>Registration Number:</strong> {vehicle.reg_number}</div>
                <div><strong>Color:</strong> {vehicle.color}</div>
                <div><strong>Chassis Number:</strong> {vehicle.chassis_number}</div>
                <div><strong>Engine Number:</strong> {vehicle.engine_number}</div>
                <div><strong>Status:</strong> {vehicle.status}</div>
              </div>
              <div className="flex flex-col justify-center">
                <button
                  className="rounded-md border-black px-4 py-2 text-white bg-primary-color hover:bg-orange-500 hover:scale-110 transition-transform"
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  Request Repair
                </button>
              </div>
            </div>
          ))}
        </ul>
      )}

      {selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Repair Request</h2>
            <div>
              <strong>Vehicle:</strong> {selectedVehicle.brand} -{" "}
              {selectedVehicle.model}
            </div>
            <textarea
              className="w-full mt-4 p-2 border rounded-md"
              placeholder="Enter repair description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                onClick={() => {
                  setSelectedVehicle(null);
                  setDescription("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-primary-color text-white hover:bg-orange-500 hover:scale-105 transition-transform"
                onClick={handleRepairRequest}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleDetails;
