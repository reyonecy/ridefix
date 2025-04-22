"use client";
import { useEffect, useState } from "react";
import { getRepairLogs } from "@/app/utils/workshopapi";
import { useWorkshopLoginStore } from "@/app/stores/useWorkshopStore";

const WorkshopHome = () => {
  const [loading, setLoading] = useState(true);
  const { 
    workshop, 
    repairLogs, 
    setRepairLogs, 
    acceptRepairRequest 
  } = useWorkshopLoginStore();

  const fetchRepairLogs = async () => {
    if (!workshop) return;
    
    try {
      setLoading(true);
      const response = await getRepairLogs();
      // console.log("Full API Response:", response);
      
      if (response.success) {
        setRepairLogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (repair_id) => {
    try {
      const result = await acceptRepairRequest(repair_id);
      if (result.success) {
        // Refresh the repair logs after accepting
        await fetchRepairLogs();
      } else {
        console.error("Failed to accept request:", result.message);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  useEffect(() => {
    fetchRepairLogs();
  }, [workshop]);

  if (!workshop) {
    return <div>Please log in to view repair logs.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Repair Requests for {workshop.name}</h2>
        <button 
          onClick={fetchRepairLogs}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : repairLogs.length > 0 ? (
        <ul className="space-y-4">
          {repairLogs.map((log) => (
            <li key={log._id} className="p-3 bg-gray-100 rounded shadow flex justify-between items-center">
              <div className="flex-1">
                <p><strong>Name:</strong> {log.customer_name}</p>
                <p><strong>Vehicle:</strong> {log.vehicle_make}</p>
                <p><strong>Model:</strong> {log.vehicle_model}</p>
                <p><strong>Repair Description:</strong> {log.repair_description}</p>
                <p><strong>Request Time:</strong> {log.createdAt}</p>
                
              </div>
              {log.status !== 'accepted' && (
                <button 
                  onClick={() => handleAcceptRequest(log._id)}
                  className="bg-primary-color text-white rounded-md px-4 py-2 h-10 hover:bg-primary-color/90 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Accepting...' : 'Accept Request'}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No repair requests found.</p>
      )}
    </div>
  );
};

export default WorkshopHome;
