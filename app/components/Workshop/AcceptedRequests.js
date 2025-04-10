"use client";
import { useEffect, useState } from 'react';
import { useWorkshopLoginStore } from '@/app/stores/useWorkshopStore';

function AcceptedRequests() {
  const [loading, setLoading] = useState(true);
  const { 
    workshop, 
    acceptedRepairLogs,
    fetchAcceptedRepairLogs 
  } = useWorkshopLoginStore();

  useEffect(() => {
    const loadAcceptedRequests = async () => {
      if (!workshop) return;
      setLoading(true);
      await fetchAcceptedRepairLogs();
      setLoading(false);
    };

    loadAcceptedRequests();
  }, [workshop]);

  if (!workshop) {
    return <div>Please log in to view accepted requests.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Accepted Repair Requests</h2>
        <button 
          onClick={() => fetchAcceptedRepairLogs()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : acceptedRepairLogs.length > 0 ? (
        <ul className="space-y-6">
          {acceptedRepairLogs.map((log) => (
            <li key={log._id} className="p-4 bg-gray-200 rounded shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {log._id}</p>
                  <p><strong>Vehicle Number:</strong> {log.vehicle_id}</p>
                  <p><strong>Issue:</strong> {log.repair_description}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded">
                      {log.status}
                    </span>
                  </p>
                  <p><strong>Accepted Time:</strong> {new Date(log.updatedAt).toLocaleString()}</p>
                  <p><strong>Requested Time:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p><strong>Customer Details:</strong></p>
                <p className="text-sm text-gray-600">
                  Name: {log.user_name}<br />
                  Contact: {log.customer_contact}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No accepted repair requests found.</p>
        </div>
      )}
    </div>
  );
}

export default AcceptedRequests;